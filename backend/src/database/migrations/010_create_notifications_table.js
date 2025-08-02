exports.up = function(knex) {
  return knex.schema.createTable('notifications', (table) => {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('sender_id').references('id').inTable('users').onDelete('SET NULL');
    
    // Notification info
    table.string('type').notNullable(); // order_status, payment, affiliate, system, etc.
    table.string('title').notNullable();
    table.text('message').notNullable();
    table.jsonb('data'); // Additional data for the notification
    
    // Channel settings
    table.boolean('email_sent').defaultTo(false);
    table.boolean('sms_sent').defaultTo(false);
    table.boolean('push_sent').defaultTo(false);
    table.boolean('in_app_sent').defaultTo(true);
    
    // Status
    table.enum('status', ['pending', 'sent', 'failed', 'cancelled']).defaultTo('pending');
    table.boolean('is_read').defaultTo(false);
    table.boolean('is_archived').defaultTo(false);
    
    // Delivery tracking
    table.timestamp('scheduled_at');
    table.timestamp('sent_at');
    table.timestamp('read_at');
    table.timestamp('archived_at');
    table.jsonb('delivery_log'); // Log of delivery attempts
    
    // Priority and settings
    table.enum('priority', ['low', 'normal', 'high', 'urgent']).defaultTo('normal');
    table.jsonb('settings'); // Notification-specific settings
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at');
    
    // Indexes
    table.index(['user_id']);
    table.index(['sender_id']);
    table.index(['type']);
    table.index(['status']);
    table.index(['is_read']);
    table.index(['priority']);
    table.index(['scheduled_at']);
    table.index(['created_at']);
    table.index(['deleted_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('notifications');
}; 