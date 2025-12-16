import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface ProductVerificationResult {
  approved: boolean
  score: number
  issues: string[]
  suggestions: string[]
  pricing: {
    isReasonable: boolean
    suggestedRange?: { min: number; max: number }
  }
}

export interface ProductData {
  title: string
  description: string
  category: string
  price: number
  images: string[]
}

export class AIService {
  async verifyProduct(product: ProductData): Promise<ProductVerificationResult> {
    try {
      const prompt = `
Analyze this product listing and provide verification:

Title: ${product.title}
Description: ${product.description}
Category: ${product.category}
Price: ${product.price} UZS

Check for:
1. Title quality (clear, descriptive, no spam)
2. Description completeness (min 50 words, informative)
3. Category accuracy
4. Price reasonableness for the product
5. Potential spam or fraud indicators

Respond in JSON format:
{
  "approved": boolean,
  "score": number (0-100),
  "issues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "pricing": {
    "isReasonable": boolean,
    "suggestedRange": { "min": number, "max": number }
  }
}
      `.trim()

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a product verification AI for an e-commerce platform. Analyze products for quality, accuracy, and fraud detection.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      })

      const result = JSON.parse(response.choices[0].message.content || '{}')
      return result as ProductVerificationResult
    } catch (error) {
      console.error('AI verification error:', error)
      
      // Fallback verification
      return this.fallbackVerification(product)
    }
  }

  private fallbackVerification(product: ProductData): ProductVerificationResult {
    const issues: string[] = []
    const suggestions: string[] = []
    let score = 100

    // Check title
    if (product.title.length < 10) {
      issues.push('Sarlavha juda qisqa')
      suggestions.push('Sarlavhani to\'ldiring (kamida 10 belgi)')
      score -= 20
    }

    // Check description
    if (product.description.length < 50) {
      issues.push('Tasnif juda qisqa')
      suggestions.push('Batafsil tasnif yozing (kamida 50 so\'z)')
      score -= 30
    }

    // Check price
    if (product.price < 1000) {
      issues.push('Narx juda past')
      score -= 20
    }

    // Check images
    if (product.images.length === 0) {
      issues.push('Rasm yo\'q')
      suggestions.push('Kamida 1 ta rasm qo\'shing')
      score -= 30
    }

    return {
      approved: score >= 70,
      score,
      issues,
      suggestions,
      pricing: {
        isReasonable: product.price >= 1000,
        suggestedRange: {
          min: Math.round(product.price * 0.8),
          max: Math.round(product.price * 1.2),
        },
      },
    }
  }

  async generateProductDescription(title: string, features: string[]): Promise<string> {
    try {
      const prompt = `
Generate a compelling product description in Uzbek language for:

Product: ${title}
Features: ${features.join(', ')}

Requirements:
- Write in Uzbek (Latin script)
- 100-150 words
- Highlight key features
- Professional and engaging tone
- Include benefits for customers
      `.trim()

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional product copywriter for an e-commerce platform.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      })

      return response.choices[0].message.content || ''
    } catch (error) {
      console.error('AI description generation error:', error)
      return `${title} - premium mahsulot. ${features.join('. ')}.`
    }
  }

  async generatePromoText(product: ProductData, bloggerName: string): Promise<string> {
    try {
      const prompt = `
Generate a promotional social media post in Uzbek for:

Product: ${product.title}
Price: ${product.price} UZS
Blogger: ${bloggerName}

Requirements:
- Write in Uzbek (Latin script)
- Engaging and persuasive
- Include emojis
- Call to action
- Mention discount/promo code
- 50-100 words
      `.trim()

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a social media marketing expert creating promotional content.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
      })

      return response.choices[0].message.content || ''
    } catch (error) {
      console.error('AI promo text generation error:', error)
      return `🔥 ${product.title}\n\n💰 Faqat ${product.price.toLocaleString()} so'm!\n\n🎁 Promo kod bilan chegirma!\n\n🛒 Xarid qilish: [link]`
    }
  }

  async detectFraud(order: any): Promise<{ isFraud: boolean; riskScore: number; reasons: string[] }> {
    const reasons: string[] = []
    let riskScore = 0

    // Check for suspicious patterns
    if (order.total > 50000000) {
      riskScore += 30
      reasons.push('Juda yuqori summa')
    }

    if (order.items.length > 20) {
      riskScore += 20
      reasons.push('Juda ko\'p mahsulot')
    }

    // Check delivery address
    if (!order.deliveryAddress || order.deliveryAddress.length < 10) {
      riskScore += 25
      reasons.push('Noto\'g\'ri manzil')
    }

    // Check phone number
    if (!order.phone || !order.phone.match(/^\+998\d{9}$/)) {
      riskScore += 15
      reasons.push('Noto\'g\'ri telefon raqam')
    }

    return {
      isFraud: riskScore >= 50,
      riskScore,
      reasons,
    }
  }

  async calculateOptimalPrice(product: ProductData): Promise<{
    basePrice: number
    bloggerCommission: number
    platformFee: number
    finalPrice: number
  }> {
    const basePrice = product.price
    
    // Calculate commissions based on category
    const categoryRates: Record<string, { blogger: number; platform: number }> = {
      'Elektronika': { blogger: 0.20, platform: 0.20 },
      'Kiyim': { blogger: 0.25, platform: 0.15 },
      'Maishiy texnika': { blogger: 0.18, platform: 0.22 },
      'Sport': { blogger: 0.22, platform: 0.18 },
      'Go\'zallik': { blogger: 0.25, platform: 0.15 },
      'default': { blogger: 0.20, platform: 0.20 },
    }

    const rates = categoryRates[product.category] || categoryRates['default']
    
    const bloggerCommission = Math.round(basePrice * rates.blogger)
    const platformFee = Math.round(basePrice * rates.platform)
    const finalPrice = basePrice + bloggerCommission + platformFee

    return {
      basePrice,
      bloggerCommission,
      platformFee,
      finalPrice,
    }
  }
}

export const aiService = new AIService()
