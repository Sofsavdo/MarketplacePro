const crypto = require('crypto');
const moment = require('moment');

class Helpers {
  // Generate unique code for affiliate links
  static generateUniqueCode(length = 8) {
    return crypto.randomBytes(length).toString('hex').toUpperCase();
  }
  
  // Generate short URL
  static generateShortUrl(code) {
    return `affilimart.com/${code}`;
  }
  
  // Format currency
  static formatCurrency(amount, currency = 'UZS') {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
  
  // Format date
  static formatDate(date, format = 'DD.MM.YYYY') {
    return moment(date).format(format);
  }
  
  // Format datetime
  static formatDateTime(date, format = 'DD.MM.YYYY HH:mm') {
    return moment(date).format(format);
  }
  
  // Calculate commission
  static calculateCommission(amount, rate) {
    return (amount * rate) / 100;
  }
  
  // Generate order number
  static generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `ORD-${timestamp.slice(-6)}-${random}`;
  }
  
  // Generate SKU
  static generateSKU(prefix = 'PROD') {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `${prefix}-${timestamp.slice(-6)}-${random}`;
  }
  
  // Slugify text
  static slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
  
  // Validate email
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Validate phone number
  static isValidPhone(phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
  
  // Pagination helper
  static getPagination(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return { offset, limit };
  }
  
  // Search helper
  static buildSearchQuery(query, searchFields) {
    if (!query.search) return query;
    
    const searchTerm = query.search;
    const whereClause = searchFields.map(field => ({
      [field]: { $ilike: `%${searchTerm}%` }
    }));
    
    return {
      ...query,
      $or: whereClause
    };
  }
  
  // File size formatter
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // Generate random string
  static generateRandomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  // Calculate percentage change
  static calculatePercentageChange(oldValue, newValue) {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
  }
  
  // Debounce function
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Throttle function
  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

module.exports = Helpers; 