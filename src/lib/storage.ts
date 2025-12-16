// File Upload Service - Supabase Storage
import { supabase } from './supabase-client'

const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true'
const BUCKET_NAME = 'products'

export class StorageService {
  async uploadImage(file: File, path: string): Promise<string> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw new Error(error.message)

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path)

      return publicUrl
    }

    // Mock: Convert to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async uploadMultipleImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map((file, index) => {
      const path = `${Date.now()}-${index}-${file.name}`
      return this.uploadImage(file, path)
    })

    return Promise.all(uploadPromises)
  }

  async deleteImage(url: string): Promise<void> {
    if (USE_SUPABASE) {
      const path = url.split('/').pop()
      if (!path) return

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path])

      if (error) throw new Error(error.message)
    }
  }

  getImageUrl(path: string): string {
    if (USE_SUPABASE) {
      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path)

      return data.publicUrl
    }

    return path
  }
}

export const storage = new StorageService()
