export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export class Validator {
  private errors: string[] = []

  required(value: any, fieldName: string): this {
    if (value === undefined || value === null || value === '') {
      this.errors.push(`${fieldName} majburiy maydon`)
    }
    return this
  }

  email(value: string, fieldName: string = 'Email'): this {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value && !emailRegex.test(value)) {
      this.errors.push(`${fieldName} formati noto'g'ri`)
    }
    return this
  }

  minLength(value: string, min: number, fieldName: string): this {
    if (value && value.length < min) {
      this.errors.push(`${fieldName} kamida ${min} ta belgidan iborat bo'lishi kerak`)
    }
    return this
  }

  maxLength(value: string, max: number, fieldName: string): this {
    if (value && value.length > max) {
      this.errors.push(`${fieldName} ${max} ta belgidan oshmasligi kerak`)
    }
    return this
  }

  min(value: number, min: number, fieldName: string): this {
    if (value !== undefined && value < min) {
      this.errors.push(`${fieldName} ${min} dan katta bo'lishi kerak`)
    }
    return this
  }

  max(value: number, max: number, fieldName: string): this {
    if (value !== undefined && value > max) {
      this.errors.push(`${fieldName} ${max} dan kichik bo'lishi kerak`)
    }
    return this
  }

  phone(value: string, fieldName: string = 'Telefon'): this {
    const phoneRegex = /^\+?998[0-9]{9}$/
    if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
      this.errors.push(`${fieldName} formati noto'g'ri (+998XXXXXXXXX)`)
    }
    return this
  }

  url(value: string, fieldName: string = 'URL'): this {
    try {
      if (value) new URL(value)
    } catch {
      this.errors.push(`${fieldName} formati noto'g'ri`)
    }
    return this
  }

  pattern(value: string, pattern: RegExp, fieldName: string, message?: string): this {
    if (value && !pattern.test(value)) {
      this.errors.push(message || `${fieldName} formati noto'g'ri`)
    }
    return this
  }

  oneOf(value: any, options: any[], fieldName: string): this {
    if (value && !options.includes(value)) {
      this.errors.push(`${fieldName} qiymati noto'g'ri`)
    }
    return this
  }

  custom(condition: boolean, message: string): this {
    if (!condition) {
      this.errors.push(message)
    }
    return this
  }

  result(): ValidationResult {
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
    }
  }
}

// Helper function to create validator
export function validate(): Validator {
  return new Validator()
}

// Common validation schemas
export const schemas = {
  signUp: (data: any): ValidationResult => {
    return validate()
      .required(data.email, 'Email')
      .email(data.email)
      .required(data.password, 'Parol')
      .minLength(data.password, 6, 'Parol')
      .required(data.full_name, 'To\'liq ism')
      .minLength(data.full_name, 2, 'To\'liq ism')
      .required(data.role, 'Rol')
      .oneOf(data.role, ['customer', 'seller', 'blogger'], 'Rol')
      .result()
  },

  signIn: (data: any): ValidationResult => {
    return validate()
      .required(data.email, 'Email')
      .email(data.email)
      .required(data.password, 'Parol')
      .result()
  },

  createProduct: (data: any): ValidationResult => {
    return validate()
      .required(data.title, 'Mahsulot nomi')
      .minLength(data.title, 3, 'Mahsulot nomi')
      .maxLength(data.title, 200, 'Mahsulot nomi')
      .required(data.description, 'Tavsif')
      .minLength(data.description, 10, 'Tavsif')
      .required(data.price, 'Narx')
      .min(data.price, 0, 'Narx')
      .required(data.category, 'Kategoriya')
      .required(data.stock, 'Ombor')
      .min(data.stock, 0, 'Ombor')
      .custom(
        data.images && Array.isArray(data.images) && data.images.length > 0,
        'Kamida bitta rasm yuklash kerak'
      )
      .result()
  },

  createOrder: (data: any): ValidationResult => {
    return validate()
      .required(data.items, 'Mahsulotlar')
      .custom(
        data.items && Array.isArray(data.items) && data.items.length > 0,
        'Buyurtma bo\'sh bo\'lishi mumkin emas'
      )
      .required(data.delivery_address, 'Yetkazib berish manzili')
      .required(data.delivery_address?.region, 'Viloyat')
      .required(data.delivery_address?.city, 'Shahar')
      .required(data.delivery_address?.street, 'Ko\'cha')
      .required(data.delivery_method, 'Yetkazib berish usuli')
      .oneOf(data.delivery_method, ['standard', 'express', 'pickup'], 'Yetkazib berish usuli')
      .required(data.payment_method, 'To\'lov usuli')
      .oneOf(data.payment_method, ['click', 'payme', 'cash', 'card'], 'To\'lov usuli')
      .result()
  },

  updateProfile: (data: any): ValidationResult => {
    const validator = validate()

    if (data.full_name !== undefined) {
      validator
        .required(data.full_name, 'To\'liq ism')
        .minLength(data.full_name, 2, 'To\'liq ism')
    }

    if (data.email !== undefined) {
      validator
        .required(data.email, 'Email')
        .email(data.email)
    }

    if (data.phone !== undefined) {
      validator.phone(data.phone)
    }

    return validator.result()
  },

  changePassword: (data: any): ValidationResult => {
    return validate()
      .required(data.current_password, 'Joriy parol')
      .required(data.new_password, 'Yangi parol')
      .minLength(data.new_password, 6, 'Yangi parol')
      .custom(
        data.new_password === data.confirm_password,
        'Parollar mos kelmaydi'
      )
      .result()
  },
}

// Sanitization helpers
export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, '')
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function sanitizePhone(phone: string): string {
  return phone.replace(/\s/g, '')
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
}
