'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, AlertCircle, X } from 'lucide-react'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: string
  message: string
  timestamp: string
  read: boolean
}

interface ChatBoxProps {
  recipientId: string
  recipientName: string
  orderId?: string
  productId?: string
  onClose?: () => void
}

export default function ChatBox({ 
  recipientId, 
  recipientName, 
  orderId, 
  productId,
  onClose 
}: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [recipientId, orderId, productId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams()
      if (orderId) params.append('orderId', orderId)
      if (productId) params.append('productId', productId)
      
      const response = await fetch(`/api/chat/messages?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId,
          message: newMessage,
          orderId,
          productId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.blocked) {
          setError(data.error)
          // Show warning for 5 seconds
          setTimeout(() => setError(''), 5000)
        } else {
          throw new Error(data.error)
        }
      } else {
        setNewMessage('')
        fetchMessages()
      }
    } catch (error: any) {
      setError(error.message || 'Xabar yuborishda xatolik')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary-600 text-white rounded-t-lg">
        <div>
          <h3 className="font-semibold">{recipientName}</h3>
          <p className="text-xs text-primary-100">
            {orderId ? `Buyurtma: ${orderId}` : productId ? 'Mahsulot haqida' : 'Chat'}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-primary-700 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Warning */}
      <div className="p-3 bg-yellow-50 border-b border-yellow-200">
        <div className="flex items-start gap-2 text-xs text-yellow-800">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Ogohlantirish:</strong> Telefon raqam, ijtimoiy tarmoq havolalari yoki 
            tashqi aloqa ma'lumotlarini yuborish qat'iyan taqiqlanadi. Qoidabuzarlik 
            hisobingizni bloklashga olib kelishi mumkin.
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Xabarlar yo'q. Birinchi bo'lib yozing!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === recipientId ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.senderId === recipientId
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-primary-600 text-white'
                }`}
              >
                <div className="text-xs opacity-75 mb-1">
                  {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString('uz-UZ', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="text-sm">{msg.message}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2 text-sm text-red-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Xabar yozing..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
