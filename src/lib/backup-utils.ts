import { supabase } from './supabase-client'
import { logger } from './logger'

export interface BackupMetadata {
  id: string
  timestamp: string
  tables: string[]
  size: number
  status: 'completed' | 'failed' | 'in-progress'
}

// Export data to JSON
export async function exportTableToJson(tableName: string): Promise<{ data: any[] | null; error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode - get from localStorage
      const data = localStorage.getItem(tableName)
      return { data: data ? JSON.parse(data) : [], error: null }
    }

    const { data, error } = await supabase
      .from(tableName)
      .select('*')

    if (error) {
      logger.error(`Failed to export ${tableName}`, error, 'Backup')
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error: any) {
    logger.error(`Export error for ${tableName}`, error, 'Backup')
    return { data: null, error: error.message }
  }
}

// Export all tables
export async function exportAllTables(tables: string[]): Promise<{ backup: Record<string, any> | null; error: string | null }> {
  try {
    const backup: Record<string, any> = {
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        tables: tables,
      },
      data: {},
    }

    for (const table of tables) {
      const { data, error } = await exportTableToJson(table)
      
      if (error) {
        logger.error(`Failed to export ${table}`, new Error(error), 'Backup')
        continue
      }

      backup.data[table] = data
    }

    logger.info(`Backup completed for ${tables.length} tables`, 'Backup')
    return { backup, error: null }
  } catch (error: any) {
    logger.error('Backup failed', error, 'Backup')
    return { backup: null, error: error.message }
  }
}

// Download backup as JSON file
export function downloadBackup(backup: any, filename?: string): void {
  const json = JSON.stringify(backup, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `backup-${new Date().toISOString()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Import data from JSON
export async function importTableFromJson(
  tableName: string,
  data: any[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode - save to localStorage
      localStorage.setItem(tableName, JSON.stringify(data))
      return { success: true, error: null }
    }

    // Delete existing data (optional - be careful!)
    // await supabase.from(tableName).delete().neq('id', '')

    // Insert new data in batches
    const batchSize = 100
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)
      const { error } = await supabase
        .from(tableName)
        .insert(batch)

      if (error) {
        logger.error(`Failed to import batch for ${tableName}`, error, 'Backup')
        return { success: false, error: error.message }
      }
    }

    logger.info(`Imported ${data.length} records to ${tableName}`, 'Backup')
    return { success: true, error: null }
  } catch (error: any) {
    logger.error(`Import error for ${tableName}`, error, 'Backup')
    return { success: false, error: error.message }
  }
}

// Restore from backup
export async function restoreFromBackup(backup: any): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = []

  try {
    if (!backup.data || !backup.metadata) {
      return { success: false, errors: ['Invalid backup format'] }
    }

    for (const [tableName, tableData] of Object.entries(backup.data)) {
      if (!Array.isArray(tableData)) continue

      const { success, error } = await importTableFromJson(tableName, tableData)
      
      if (!success && error) {
        errors.push(`${tableName}: ${error}`)
      }
    }

    if (errors.length === 0) {
      logger.info('Restore completed successfully', 'Backup')
      return { success: true, errors: [] }
    } else {
      logger.warn(`Restore completed with ${errors.length} errors`, 'Backup', { errors })
      return { success: false, errors }
    }
  } catch (error: any) {
    logger.error('Restore failed', error, 'Backup')
    return { success: false, errors: [error.message] }
  }
}

// Schedule automatic backups
export function scheduleBackup(
  tables: string[],
  intervalHours: number = 24
): NodeJS.Timeout {
  const intervalMs = intervalHours * 60 * 60 * 1000

  return setInterval(async () => {
    logger.info('Starting scheduled backup', 'Backup')
    const { backup, error } = await exportAllTables(tables)
    
    if (error) {
      logger.error('Scheduled backup failed', new Error(error), 'Backup')
      return
    }

    // In production, upload to cloud storage (S3, etc.)
    logger.info('Scheduled backup completed', 'Backup')
  }, intervalMs)
}

// Get backup size estimate
export function getBackupSize(backup: any): number {
  const json = JSON.stringify(backup)
  return new Blob([json]).size
}

// Format backup size
export function formatBackupSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Verify backup integrity
export function verifyBackup(backup: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!backup.metadata) {
    errors.push('Missing metadata')
  }

  if (!backup.data) {
    errors.push('Missing data')
  }

  if (backup.metadata && !backup.metadata.timestamp) {
    errors.push('Missing timestamp')
  }

  if (backup.metadata && !Array.isArray(backup.metadata.tables)) {
    errors.push('Invalid tables list')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
