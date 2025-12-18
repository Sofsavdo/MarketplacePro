import { supabase } from './supabase-client'

export interface UploadResult {
  url: string | null
  error: string | null
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export async function uploadImage(file: File, bucket: string = 'products'): Promise<UploadResult> {
  try {
    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { url: null, error: 'Faqat rasm fayllari (JPEG, PNG, WebP, GIF) qabul qilinadi' }
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return { url: null, error: 'Fayl hajmi 5MB dan oshmasligi kerak' }
    }

    // Check if Supabase is configured
    if (!supabase) {
      // Mock mode - return a placeholder URL
      const mockUrl = URL.createObjectURL(file)
      return { url: mockUrl, error: null }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${bucket}/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      return { url: null, error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return { url: publicUrl, error: null }
  } catch (error: any) {
    return { url: null, error: error.message || 'Fayl yuklashda xatolik' }
  }
}

export async function uploadMultipleImages(files: File[], bucket: string = 'products'): Promise<{ urls: string[]; errors: string[] }> {
  const urls: string[] = []
  const errors: string[] = []

  for (const file of files) {
    const { url, error } = await uploadImage(file, bucket)
    if (url) {
      urls.push(url)
    }
    if (error) {
      errors.push(error)
    }
  }

  return { urls, errors }
}

export async function uploadDocument(file: File, bucket: string = 'documents'): Promise<UploadResult> {
  try {
    // Validate file type
    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      return { url: null, error: 'Faqat PDF va Word fayllari qabul qilinadi' }
    }

    // Validate file size (10MB for documents)
    if (file.size > 10 * 1024 * 1024) {
      return { url: null, error: 'Fayl hajmi 10MB dan oshmasligi kerak' }
    }

    // Check if Supabase is configured
    if (!supabase) {
      // Mock mode
      const mockUrl = URL.createObjectURL(file)
      return { url: mockUrl, error: null }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${bucket}/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      return { url: null, error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return { url: publicUrl, error: null }
  } catch (error: any) {
    return { url: null, error: error.message || 'Fayl yuklashda xatolik' }
  }
}

export async function deleteFile(filePath: string, bucket: string = 'products'): Promise<{ error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      return { error: null }
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Fayl o\'chirishda xatolik' }
  }
}

export function validateImageFile(file: File): { valid: boolean; error: string | null } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Faqat rasm fayllari (JPEG, PNG, WebP, GIF) qabul qilinadi' }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'Fayl hajmi 5MB dan oshmasligi kerak' }
  }

  return { valid: true, error: null }
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop() || ''
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
