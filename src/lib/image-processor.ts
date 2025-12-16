export interface ImageProcessingOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

export class ImageProcessor {
  static async compressImage(
    base64Image: string,
    options: ImageProcessingOptions = {}
  ): Promise<string> {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.85,
      format = 'jpeg'
    } = options

    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        let { width, height } = img

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }

        canvas.width = width
        canvas.height = height

        ctx.drawImage(img, 0, 0, width, height)

        const mimeType = `image/${format}`
        const compressed = canvas.toDataURL(mimeType, quality)
        
        resolve(compressed)
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = base64Image
    })
  }

  static async cropToSquare(base64Image: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        const size = Math.min(img.width, img.height)
        const x = (img.width - size) / 2
        const y = (img.height - size) / 2

        canvas.width = size
        canvas.height = size

        ctx.drawImage(img, x, y, size, size, 0, 0, size, size)

        resolve(canvas.toDataURL('image/jpeg', 0.9))
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = base64Image
    })
  }

  static async enhanceImage(base64Image: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.1)
          data[i + 1] = Math.min(255, data[i + 1] * 1.1)
          data[i + 2] = Math.min(255, data[i + 2] * 1.1)
        }

        ctx.putImageData(imageData, 0, 0)

        resolve(canvas.toDataURL('image/jpeg', 0.9))
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = base64Image
    })
  }

  static getImageSize(base64Image: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = base64Image
    })
  }

  static async validateImage(base64Image: string): Promise<boolean> {
    try {
      const size = await this.getImageSize(base64Image)
      return size.width >= 200 && size.height >= 200
    } catch {
      return false
    }
  }

  static getBase64Size(base64Image: string): number {
    const base64Length = base64Image.length - (base64Image.indexOf(',') + 1)
    return Math.floor((base64Length * 3) / 4)
  }

  static async processForAI(base64Image: string): Promise<string> {
    let processed = base64Image

    processed = await this.compressImage(processed, {
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.9,
      format: 'jpeg'
    })

    const size = this.getBase64Size(processed)
    const maxSize = 4 * 1024 * 1024

    if (size > maxSize) {
      processed = await this.compressImage(processed, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
        format: 'jpeg'
      })
    }

    return processed
  }
}

export const imageProcessor = new ImageProcessor()
