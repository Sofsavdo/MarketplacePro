import { supabase } from './supabase-client'

export interface Transaction {
  id: string
  user_id: string
  type: 'sale' | 'commission' | 'refund' | 'withdrawal'
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'on_hold'
  order_id?: string
  promo_code?: string
  description: string
  hold_until?: string
  created_at: string
  completed_at?: string
}

export interface WithdrawalRequest {
  id: string
  user_id: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  payment_method: 'bank_transfer' | 'click' | 'payme'
  bank_account?: string
  phone_number?: string
  requested_at: string
  approved_at?: string
  completed_at?: string
  rejected_reason?: string
}

const HOLD_PERIOD_DAYS = 14

// Calculate hold period end date
export function calculateHoldUntil(date: Date = new Date()): string {
  const holdUntil = new Date(date)
  holdUntil.setDate(holdUntil.getDate() + HOLD_PERIOD_DAYS)
  return holdUntil.toISOString()
}

// Check if hold period has passed
export function isHoldPeriodPassed(holdUntil: string): boolean {
  return new Date() >= new Date(holdUntil)
}

// Get days remaining in hold period
export function getDaysRemaining(holdUntil: string): number {
  const now = new Date()
  const holdDate = new Date(holdUntil)
  const diff = holdDate.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return Math.max(0, days)
}

// Create transaction (sale or commission)
export async function createTransaction(data: {
  user_id: string
  type: 'sale' | 'commission'
  amount: number
  order_id?: string
  promo_code?: string
  description: string
}): Promise<{ transaction: Transaction | null; error: string | null }> {
  try {
    const holdUntil = calculateHoldUntil()

    if (!supabase) {
      // Mock mode
      const mockTransaction: Transaction = {
        id: Date.now().toString(),
        ...data,
        status: 'on_hold',
        hold_until: holdUntil,
        created_at: new Date().toISOString(),
      }

      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
      transactions.push(mockTransaction)
      localStorage.setItem('transactions', JSON.stringify(transactions))

      return { transaction: mockTransaction, error: null }
    }

    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        ...data,
        status: 'on_hold',
        hold_until: holdUntil,
      })
      .select()
      .single()

    if (error) {
      return { transaction: null, error: error.message }
    }

    return { transaction: transaction as Transaction, error: null }
  } catch (error: any) {
    return { transaction: null, error: error.message || 'Xatolik yuz berdi' }
  }
}

// Get user transactions
export async function getUserTransactions(
  userId: string,
  filters?: {
    type?: string
    status?: string
    from_date?: string
    to_date?: string
  }
): Promise<{ transactions: Transaction[]; error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      let transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
      transactions = transactions.filter((t: Transaction) => t.user_id === userId)

      if (filters?.type) {
        transactions = transactions.filter((t: Transaction) => t.type === filters.type)
      }
      if (filters?.status) {
        transactions = transactions.filter((t: Transaction) => t.status === filters.status)
      }

      return { transactions, error: null }
    }

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (filters?.type) {
      query = query.eq('type', filters.type)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.from_date) {
      query = query.gte('created_at', filters.from_date)
    }
    if (filters?.to_date) {
      query = query.lte('created_at', filters.to_date)
    }

    const { data: transactions, error } = await query

    if (error) {
      return { transactions: [], error: error.message }
    }

    return { transactions: transactions as Transaction[], error: null }
  } catch (error: any) {
    return { transactions: [], error: error.message || 'Xatolik yuz berdi' }
  }
}

// Get available balance (transactions with passed hold period)
export async function getAvailableBalance(userId: string): Promise<{
  available: number
  on_hold: number
  total: number
  error: string | null
}> {
  try {
    const { transactions, error } = await getUserTransactions(userId, {
      type: undefined, // All types
      status: undefined, // All statuses
    })

    if (error) {
      return { available: 0, on_hold: 0, total: 0, error }
    }

    let available = 0
    let on_hold = 0

    transactions.forEach((transaction) => {
      if (transaction.status === 'completed') {
        // Already withdrawn
        return
      }

      if (transaction.type === 'withdrawal') {
        // Deduct withdrawals
        available -= transaction.amount
        return
      }

      if (transaction.type === 'refund') {
        // Deduct refunds
        available -= transaction.amount
        return
      }

      // Sale or commission
      if (transaction.hold_until && isHoldPeriodPassed(transaction.hold_until)) {
        available += transaction.amount
      } else {
        on_hold += transaction.amount
      }
    })

    const total = available + on_hold

    return { available, on_hold, total, error: null }
  } catch (error: any) {
    return { available: 0, on_hold: 0, total: 0, error: error.message }
  }
}

// Get transactions on hold
export async function getTransactionsOnHold(userId: string): Promise<{
  transactions: Transaction[]
  total_amount: number
  error: string | null
}> {
  try {
    const { transactions, error } = await getUserTransactions(userId, {
      status: 'on_hold',
    })

    if (error) {
      return { transactions: [], total_amount: 0, error }
    }

    const total_amount = transactions.reduce((sum, t) => sum + t.amount, 0)

    return { transactions, total_amount, error: null }
  } catch (error: any) {
    return { transactions: [], total_amount: 0, error: error.message }
  }
}

// Request withdrawal
export async function requestWithdrawal(data: {
  user_id: string
  amount: number
  payment_method: 'bank_transfer' | 'click' | 'payme'
  bank_account?: string
  phone_number?: string
}): Promise<{ request: WithdrawalRequest | null; error: string | null }> {
  try {
    // Check available balance
    const { available, error: balanceError } = await getAvailableBalance(data.user_id)

    if (balanceError) {
      return { request: null, error: balanceError }
    }

    if (available < data.amount) {
      return {
        request: null,
        error: `Yetarli mablag' yo'q. Mavjud: ${available.toLocaleString()} so'm`,
      }
    }

    if (data.amount < 50000) {
      return { request: null, error: 'Minimal yechish summasi: 50,000 so\'m' }
    }

    if (!supabase) {
      // Mock mode
      const mockRequest: WithdrawalRequest = {
        id: Date.now().toString(),
        ...data,
        status: 'pending',
        requested_at: new Date().toISOString(),
      }

      const requests = JSON.parse(localStorage.getItem('withdrawal_requests') || '[]')
      requests.push(mockRequest)
      localStorage.setItem('withdrawal_requests', JSON.stringify(requests))

      // Create withdrawal transaction
      await createTransaction({
        user_id: data.user_id,
        type: 'sale', // Will be changed to withdrawal
        amount: -data.amount, // Negative amount
        description: 'Pul yechish so\'rovi',
      })

      return { request: mockRequest, error: null }
    }

    const { data: request, error } = await supabase
      .from('withdrawal_requests')
      .insert({
        ...data,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return { request: null, error: error.message }
    }

    // Create withdrawal transaction
    await createTransaction({
      user_id: data.user_id,
      type: 'sale',
      amount: -data.amount,
      description: 'Pul yechish so\'rovi',
    })

    return { request: request as WithdrawalRequest, error: null }
  } catch (error: any) {
    return { request: null, error: error.message || 'Xatolik yuz berdi' }
  }
}

// Get user withdrawal requests
export async function getUserWithdrawalRequests(userId: string): Promise<{
  requests: WithdrawalRequest[]
  error: string | null
}> {
  try {
    if (!supabase) {
      // Mock mode
      let requests = JSON.parse(localStorage.getItem('withdrawal_requests') || '[]')
      requests = requests.filter((r: WithdrawalRequest) => r.user_id === userId)
      return { requests, error: null }
    }

    const { data: requests, error } = await supabase
      .from('withdrawal_requests')
      .select('*')
      .eq('user_id', userId)
      .order('requested_at', { ascending: false })

    if (error) {
      return { requests: [], error: error.message }
    }

    return { requests: requests as WithdrawalRequest[], error: null }
  } catch (error: any) {
    return { requests: [], error: error.message || 'Xatolik yuz berdi' }
  }
}

// Admin: Approve withdrawal
export async function approveWithdrawal(requestId: string): Promise<{ error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      const requests = JSON.parse(localStorage.getItem('withdrawal_requests') || '[]')
      const index = requests.findIndex((r: WithdrawalRequest) => r.id === requestId)

      if (index !== -1) {
        requests[index].status = 'approved'
        requests[index].approved_at = new Date().toISOString()
        localStorage.setItem('withdrawal_requests', JSON.stringify(requests))
      }

      return { error: null }
    }

    const { error } = await supabase
      .from('withdrawal_requests')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Xatolik yuz berdi' }
  }
}

// Admin: Reject withdrawal
export async function rejectWithdrawal(
  requestId: string,
  reason: string
): Promise<{ error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      const requests = JSON.parse(localStorage.getItem('withdrawal_requests') || '[]')
      const index = requests.findIndex((r: WithdrawalRequest) => r.id === requestId)

      if (index !== -1) {
        requests[index].status = 'rejected'
        requests[index].rejected_reason = reason
        localStorage.setItem('withdrawal_requests', JSON.stringify(requests))
      }

      return { error: null }
    }

    const { error } = await supabase
      .from('withdrawal_requests')
      .update({
        status: 'rejected',
        rejected_reason: reason,
      })
      .eq('id', requestId)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Xatolik yuz berdi' }
  }
}

// Complete withdrawal (mark as paid)
export async function completeWithdrawal(requestId: string): Promise<{ error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      const requests = JSON.parse(localStorage.getItem('withdrawal_requests') || '[]')
      const index = requests.findIndex((r: WithdrawalRequest) => r.id === requestId)

      if (index !== -1) {
        requests[index].status = 'completed'
        requests[index].completed_at = new Date().toISOString()
        localStorage.setItem('withdrawal_requests', JSON.stringify(requests))
      }

      return { error: null }
    }

    const { error } = await supabase
      .from('withdrawal_requests')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Xatolik yuz berdi' }
  }
}
