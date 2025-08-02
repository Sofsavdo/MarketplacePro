const { Model } = require('objection');

class Notification extends Model {
  static get tableName() {
    return 'notifications';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['recipient_id', 'type', 'title'],

      properties: {
        id: { type: 'integer' },
        recipient_id: { type: 'integer' },
        sender_id: { type: ['integer', 'null'] },
        type: { type: 'string', enum: ['system', 'order', 'payment', 'affiliate', 'review', 'security', 'marketing', 'support'] },
        title: { type: 'string', minLength: 1, maxLength: 255 },
        message: { type: 'string', maxLength: 1000 },
        data: { type: 'object' },
        email_enabled: { type: 'boolean' },
        sms_enabled: { type: 'boolean' },
        push_enabled: { type: 'boolean' },
        in_app_enabled: { type: 'boolean' },
        status: { type: 'string', enum: ['unread', 'read', 'archived'] },
        scheduled_at: { type: 'string', format: 'date-time' },
        sent_at: { type: 'string', format: 'date-time' },
        read_at: { type: 'string', format: 'date-time' },
        archived_at: { type: 'string', format: 'date-time' },
        delivery_log: { type: 'array', items: { type: 'object' } },
        priority: { type: 'string', enum: ['low', 'normal', 'high', 'urgent'] },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const User = require('./User');

    return {
      recipient: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'notifications.recipient_id',
          to: 'users.id'
        }
      },
      sender: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'notifications.sender_id',
          to: 'users.id'
        }
      }
    };
  }

  // Instance methods
  async getFullNotificationDetails() {
    const [recipient, sender] = await Promise.all([
      this.$relatedQuery('recipient'),
      this.$relatedQuery('sender')
    ]);

    return {
      ...this.toJSON(),
      recipient: recipient ? recipient.toJSON() : null,
      sender: sender ? sender.toJSON() : null
    };
  }

  async markAsRead() {
    this.status = 'read';
    this.read_at = new Date().toISOString();
    
    await this.$query().patch({
      status: this.status,
      read_at: this.read_at
    });

    return this;
  }

  async markAsUnread() {
    this.status = 'unread';
    this.read_at = null;
    
    await this.$query().patch({
      status: this.status,
      read_at: this.read_at
    });

    return this;
  }

  async archive() {
    this.status = 'archived';
    this.archived_at = new Date().toISOString();
    
    await this.$query().patch({
      status: this.status,
      archived_at: this.archived_at
    });

    return this;
  }

  async unarchive() {
    this.status = 'unread';
    this.archived_at = null;
    
    await this.$query().patch({
      status: this.status,
      archived_at: this.archived_at
    });

    return this;
  }

  async markAsSent(channel) {
    this.sent_at = new Date().toISOString();
    
    if (!this.delivery_log) {
      this.delivery_log = [];
    }

    this.delivery_log.push({
      channel,
      status: 'sent',
      timestamp: new Date().toISOString()
    });

    await this.$query().patch({
      sent_at: this.sent_at,
      delivery_log: this.delivery_log
    });

    return this;
  }

  async markAsFailed(channel, error) {
    if (!this.delivery_log) {
      this.delivery_log = [];
    }

    this.delivery_log.push({
      channel,
      status: 'failed',
      error: error.message || error,
      timestamp: new Date().toISOString()
    });

    await this.$query().patch({
      delivery_log: this.delivery_log
    });

    return this;
  }

  async schedule(scheduledAt) {
    this.scheduled_at = scheduledAt;
    await this.$query().patch({ scheduled_at: this.scheduled_at });
    return this;
  }

  isRead() {
    return this.status === 'read';
  }

  isUnread() {
    return this.status === 'unread';
  }

  isArchived() {
    return this.status === 'archived';
  }

  isSent() {
    return this.sent_at !== null;
  }

  isScheduled() {
    return this.scheduled_at !== null && new Date() < new Date(this.scheduled_at);
  }

  isHighPriority() {
    return ['high', 'urgent'].includes(this.priority);
  }

  canBeSent() {
    return !this.isSent() && !this.isScheduled();
  }

  // Static methods
  static async findByRecipient(recipientId) {
    return await this.query().where('recipient_id', recipientId);
  }

  static async findBySender(senderId) {
    return await this.query().where('sender_id', senderId);
  }

  static async findByType(type) {
    return await this.query().where('type', type);
  }

  static async findByStatus(status) {
    return await this.query().where('status', status);
  }

  static async findUnread() {
    return await this.query().where('status', 'unread');
  }

  static async findRead() {
    return await this.query().where('status', 'read');
  }

  static async findArchived() {
    return await this.query().where('status', 'archived');
  }

  static async findScheduled() {
    return await this.query()
      .whereNotNull('scheduled_at')
      .where('scheduled_at', '<=', new Date().toISOString());
  }

  static async findPendingDelivery() {
    return await this.query()
      .whereNull('sent_at')
      .where(function() {
        this.whereNull('scheduled_at')
          .orWhere('scheduled_at', '<=', new Date().toISOString());
      });
  }

  static async findByPriority(priority) {
    return await this.query().where('priority', priority);
  }

  static async search(searchTerm) {
    return await this.query()
      .where(function() {
        this.where('title', 'ilike', `%${searchTerm}%`)
          .orWhere('message', 'ilike', `%${searchTerm}%`);
      });
  }

  static async getUnreadCount(recipientId) {
    const result = await this.query()
      .where('recipient_id', recipientId)
      .where('status', 'unread')
      .count('id as count')
      .first();

    return parseInt(result.count || 0);
  }

  static async markAllAsRead(recipientId) {
    return await this.query()
      .where('recipient_id', recipientId)
      .where('status', 'unread')
      .patch({
        status: 'read',
        read_at: new Date().toISOString()
      });
  }

  static async markAllAsArchived(recipientId) {
    return await this.query()
      .where('recipient_id', recipientId)
      .whereIn('status', ['read', 'unread'])
      .patch({
        status: 'archived',
        archived_at: new Date().toISOString()
      });
  }

  static async getStats() {
    const stats = await this.query()
      .select(
        this.raw('COUNT(*) as total_notifications'),
        this.raw('COUNT(CASE WHEN status = \'unread\' THEN 1 END) as unread_notifications'),
        this.raw('COUNT(CASE WHEN status = \'read\' THEN 1 END) as read_notifications'),
        this.raw('COUNT(CASE WHEN status = \'archived\' THEN 1 END) as archived_notifications'),
        this.raw('COUNT(CASE WHEN sent_at IS NOT NULL THEN 1 END) as sent_notifications'),
        this.raw('COUNT(CASE WHEN scheduled_at IS NOT NULL THEN 1 END) as scheduled_notifications'),
        this.raw('COUNT(CASE WHEN priority = \'urgent\' THEN 1 END) as urgent_notifications'),
        this.raw('COUNT(CASE WHEN priority = \'high\' THEN 1 END) as high_priority_notifications')
      )
      .first();

    return stats;
  }

  static async getNotificationStats(days = 30) {
    const result = await this.query()
      .select(
        this.raw('DATE(created_at) as date'),
        this.raw('COUNT(*) as notifications_count'),
        this.raw('COUNT(CASE WHEN status = \'unread\' THEN 1 END) as unread_count'),
        this.raw('COUNT(CASE WHEN status = \'read\' THEN 1 END) as read_count'),
        this.raw('COUNT(CASE WHEN sent_at IS NOT NULL THEN 1 END) as sent_count'),
        this.raw('COUNT(CASE WHEN priority = \'urgent\' THEN 1 END) as urgent_count')
      )
      .where('created_at', '>=', this.raw(`NOW() - INTERVAL '${days} days'`))
      .groupBy('date')
      .orderBy('date');

    return result;
  }

  static async getTypeStats() {
    const result = await this.query()
      .select(
        'type',
        this.raw('COUNT(*) as count'),
        this.raw('COUNT(CASE WHEN status = \'unread\' THEN 1 END) as unread_count'),
        this.raw('COUNT(CASE WHEN status = \'read\' THEN 1 END) as read_count'),
        this.raw('COUNT(CASE WHEN sent_at IS NOT NULL THEN 1 END) as sent_count')
      )
      .groupBy('type')
      .orderBy('count', 'desc');

    return result;
  }

  static async getPriorityStats() {
    const result = await this.query()
      .select(
        'priority',
        this.raw('COUNT(*) as count'),
        this.raw('COUNT(CASE WHEN status = \'unread\' THEN 1 END) as unread_count'),
        this.raw('COUNT(CASE WHEN status = \'read\' THEN 1 END) as read_count'),
        this.raw('COUNT(CASE WHEN sent_at IS NOT NULL THEN 1 END) as sent_count')
      )
      .groupBy('priority')
      .orderBy('count', 'desc');

    return result;
  }

  static async getDeliveryStats() {
    const result = await this.query()
      .select(
        this.raw('COUNT(CASE WHEN email_enabled = true THEN 1 END) as email_enabled_count'),
        this.raw('COUNT(CASE WHEN sms_enabled = true THEN 1 END) as sms_enabled_count'),
        this.raw('COUNT(CASE WHEN push_enabled = true THEN 1 END) as push_enabled_count'),
        this.raw('COUNT(CASE WHEN in_app_enabled = true THEN 1 END) as in_app_enabled_count'),
        this.raw('COUNT(CASE WHEN sent_at IS NOT NULL THEN 1 END) as successfully_sent_count'),
        this.raw('COUNT(CASE WHEN sent_at IS NULL AND scheduled_at IS NULL THEN 1 END) as pending_count')
      )
      .first();

    return result;
  }

  static async getFailedDeliveries() {
    const result = await this.query()
      .select(
        'id',
        'type',
        'title',
        'recipient_id',
        'delivery_log'
      )
      .whereRaw("delivery_log @> '[{\"status\": \"failed\"}]'")
      .orderBy('created_at', 'desc');

    return result;
  }

  static async createSystemNotification(recipientId, title, message, data = {}, priority = 'normal') {
    return await this.query().insert({
      recipient_id: recipientId,
      type: 'system',
      title,
      message,
      data,
      priority,
      email_enabled: true,
      sms_enabled: false,
      push_enabled: true,
      in_app_enabled: true,
      status: 'unread'
    });
  }

  static async createOrderNotification(recipientId, orderId, title, message, data = {}) {
    return await this.query().insert({
      recipient_id: recipientId,
      type: 'order',
      title,
      message,
      data: { ...data, order_id: orderId },
      priority: 'normal',
      email_enabled: true,
      sms_enabled: true,
      push_enabled: true,
      in_app_enabled: true,
      status: 'unread'
    });
  }

  static async createPaymentNotification(recipientId, paymentId, title, message, data = {}) {
    return await this.query().insert({
      recipient_id: recipientId,
      type: 'payment',
      title,
      message,
      data: { ...data, payment_id: paymentId },
      priority: 'high',
      email_enabled: true,
      sms_enabled: true,
      push_enabled: true,
      in_app_enabled: true,
      status: 'unread'
    });
  }

  static async createAffiliateNotification(recipientId, affiliateId, title, message, data = {}) {
    return await this.query().insert({
      recipient_id: recipientId,
      type: 'affiliate',
      title,
      message,
      data: { ...data, affiliate_id: affiliateId },
      priority: 'normal',
      email_enabled: true,
      sms_enabled: false,
      push_enabled: true,
      in_app_enabled: true,
      status: 'unread'
    });
  }

  static async createSecurityNotification(recipientId, title, message, data = {}) {
    return await this.query().insert({
      recipient_id: recipientId,
      type: 'security',
      title,
      message,
      data,
      priority: 'urgent',
      email_enabled: true,
      sms_enabled: true,
      push_enabled: true,
      in_app_enabled: true,
      status: 'unread'
    });
  }

  static async createMarketingNotification(recipientId, title, message, data = {}) {
    return await this.query().insert({
      recipient_id: recipientId,
      type: 'marketing',
      title,
      message,
      data,
      priority: 'low',
      email_enabled: true,
      sms_enabled: false,
      push_enabled: true,
      in_app_enabled: true,
      status: 'unread'
    });
  }

  static async bulkCreate(notifications) {
    return await this.query().insert(notifications);
  }

  static async deleteOldNotifications(days = 90) {
    return await this.query()
      .where('created_at', '<', this.raw(`NOW() - INTERVAL '${days} days'`))
      .where('status', 'archived')
      .delete();
  }
}

module.exports = Notification; 