import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface AIProductScanResult {
  success: boolean
  productCard: {
    name: string
    description: string
    category: string
    features?: string[]
    specifications?: Record<string, string>
  }
  suggestedPrice?: number
  priceBreakdown?: {
    sellingPrice: number
    basePrice: number
    bloggerCommission: number
    platformFee: number
  }
  confidence: number
  error?: string
}

interface ProductIdentification {
  productName: string
  category: string
  confidence: number
}

interface ProductDetails {
  description: string
  features: string[]
  specifications: Record<string, string>
  marketPrice?: number
}

interface GeneratedProductCard {
  name: string
  description: string
  category: string
  features: string[]
  specifications: Record<string, string>
}

interface PriceBreakdown {
  sellingPrice: number
  basePrice: number
  bloggerCommission: number
  platformFee: number
}

export class AIProductScanner {
  async scanProduct(imageData: string): Promise<AIProductScanResult> {
    try {
      const identification = await this.analyzeImage(imageData)
      const details = await this.searchProductDetails(identification)
      const productCard = await this.generateProductCard(details, identification)
      
      const suggestedPrice = details.marketPrice || 100000
      const priceBreakdown = this.calculatePriceBreakdown(suggestedPrice)

      return {
        success: true,
        productCard,
        suggestedPrice,
        priceBreakdown,
        confidence: identification.confidence / 100,
      }
    } catch (error: any) {
      console.error('AI Scanner error:', error)
      return {
        success: false,
        productCard: {
          name: '',
          description: '',
          category: 'Elektronika',
        },
        confidence: 0,
        error: error.message || 'Scanning failed',
      }
    }
  }

  async analyzeImage(imageData: string): Promise<ProductIdentification> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this product image and identify:
1. Product name (exact model if possible)
2. Category (Elektronika, Kiyim, Maishiy texnika, Sport, Go'zallik, Kitoblar, O'yinchoqlar, Avtotovarlar)
3. Confidence level (0-100)

Respond in JSON format:
{
  "productName": "exact product name",
  "category": "category",
  "confidence": 95
}`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      })

      const content = response.choices[0].message.content || '{}'
      const result = JSON.parse(content)

      return {
        productName: result.productName || 'Unknown Product',
        category: result.category || 'Elektronika',
        confidence: result.confidence || 50,
      }
    } catch (error: any) {
      console.error('Image analysis error:', error)
      throw new Error('Failed to analyze image')
    }
  }

  async searchProductDetails(productInfo: ProductIdentification): Promise<ProductDetails> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a product information expert. Provide detailed product information in JSON format.',
          },
          {
            role: 'user',
            content: `Provide detailed information for: ${productInfo.productName}

Include:
1. Detailed description (in Uzbek)
2. Key features (array)
3. Technical specifications (object)
4. Estimated market price in UZS

Respond in JSON format:
{
  "description": "detailed description",
  "features": ["feature1", "feature2"],
  "specifications": {"spec1": "value1"},
  "marketPrice": 1000000
}`,
          },
        ],
        max_tokens: 1000,
      })

      const content = response.choices[0].message.content || '{}'
      const result = JSON.parse(content)

      return {
        description: result.description || 'Mahsulot haqida ma\'lumot',
        features: result.features || [],
        specifications: result.specifications || {},
        marketPrice: result.marketPrice,
      }
    } catch (error: any) {
      console.error('Product search error:', error)
      return {
        description: `${productInfo.productName} - Sifatli mahsulot`,
        features: [],
        specifications: {},
      }
    }
  }

  async generateProductCard(
    details: ProductDetails,
    identification: ProductIdentification
  ): Promise<GeneratedProductCard> {
    return {
      name: identification.productName,
      description: details.description,
      category: identification.category,
      features: details.features,
      specifications: details.specifications,
    }
  }

  calculatePriceBreakdown(sellingPrice: number): PriceBreakdown {
    const basePrice = sellingPrice / 1.4
    const bloggerCommission = basePrice * 0.2
    const platformFee = basePrice * 0.2

    return {
      sellingPrice,
      basePrice,
      bloggerCommission,
      platformFee,
    }
  }
}

export const aiScanner = new AIProductScanner()
