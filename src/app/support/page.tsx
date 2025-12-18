'use client'

import { useState, useEffect, useRef } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Send, Paperclip, Smile, Phone, Video, MoreVertical, Search, User } from 'lucide-react'

interface Message {
  id: string
  sender: 'user' | 'support'
  text: string
  timestamp: string
  read: boolean
}

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'support',
      text: 'Assalomu alaykum! DUBAYMALL qo\'llab-quvvatlash xizmatiga xush kelibsiz. Sizga qanday yordam bera olaman?',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      read: true,
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    // Simulate support response
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'support',
        text: 'Rahmat! Sizning so\'rovingiz qabul qilindi. Tez orada javob beramiz.',
        timestamp: new Date().toISOString(),
        read: false,
      }
      setMessages(prev => [...prev, supportMessage])
      setIsTyping(false)
    }, 2000)
  }

  const quickReplies = [
    'Buyurtmam qayerda?',
    'To\'lov qanday amalga oshiriladi?',
    'Mahsulotni qaytarish',
    'Yetkazib berish narxi',
  ]

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="flex h-full">
              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b bg-gradient-to-r from-primary-600 to-primary-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Qo'llab-quvvatlash</h3>
                        <p className="text-sm text-primary-100">Onlayn</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-3 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString('uz-UZ', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                <div className="px-6 py-3 border-t bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Tez javoblar:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => setNewMessage(reply)}
                        className="px-3 py-1 bg-white border border-gray-300 text-sm text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="px-6 py-4 border-t">
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Smile className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Xabar yozing..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-80 border-l bg-gray-50 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Ko'p so'raladigan savollar</h3>
                <div className="space-y-3">
                  {[
                    {
                      question: 'Buyurtmani qanday kuzatish mumkin?',
                      answer: 'Buyurtmalar sahifasida buyurtma raqamingizni kiriting.'
                    },
                    {
                      question: 'Yetkazib berish qancha vaqt oladi?',
                      answer: 'Toshkent bo\'ylab 1-2 kun, viloyatlarga 2-3 kun.'
                    },
                    {
                      question: 'To\'lov usullari qanday?',
                      answer: 'Click, Payme va naqd pul qabul qilinadi.'
                    },
                    {
                      question: 'Mahsulotni qaytarish mumkinmi?',
                      answer: '14 kun ichida qaytarish mumkin.'
                    },
                  ].map((faq, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">{faq.question}</h4>
                      <p className="text-xs text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Telefon orqali aloqa</h4>
                  <p className="text-sm text-blue-700 mb-2">+998 90 123 45 67</p>
                  <p className="text-xs text-blue-600">Dushanba-Yakshanba: 09:00-22:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
