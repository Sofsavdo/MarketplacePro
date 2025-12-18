'use client'

import { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Gift, Star, Award, TrendingUp, ShoppingBag, Users, Zap } from 'lucide-react'

export default function RewardsPage() {
  const [userPoints, setUserPoints] = useState(2450)
  const userLevel = userPoints >= 5000 ? 'Platinum' : userPoints >= 2000 ? 'Gold' : userPoints >= 500 ? 'Silver' : 'Bronze'

  const rewards = [
    {
      id: 1,
      title: '50,000 so\'m chegirma',
      points: 500,
      description: 'Keyingi xaridingizda 50,000 so\'m chegirma',
      icon: Gift,
      color: 'blue',
    },
    {
      id: 2,
      title: 'Bepul yetkazib berish',
      points: 300,
      description: '1 oylik bepul yetkazib berish',
      icon: TrendingUp,
      color: 'green',
    },
    {
      id: 3,
      title: '100,000 so\'m chegirma',
      points: 1000,
      description: 'Keyingi xaridingizda 100,000 so\'m chegirma',
      icon: Award,
      color: 'purple',
    },
    {
      id: 4,
      title: 'VIP dostup',
      points: 2000,
      description: '3 oylik VIP a\'zolik',
      icon: Star,
      color: 'yellow',
    },
  ]

  const pointsHistory = [
    { date: '15 Dek 2024', action: 'Xarid', points: +150, order: '#DM12345' },
    { date: '12 Dek 2024', action: 'Sharh', points: +50, order: '-' },
    { date: '10 Dek 2024', action: 'Xarid', points: +200, order: '#DM12340' },
    { date: '08 Dek 2024', action: 'Chegirma ishlatildi', points: -500, order: '-' },
    { date: '05 Dek 2024', action: 'Xarid', points: +300, order: '#DM12335' },
  ]

  const levels = [
    { name: 'Bronze', min: 0, max: 499, color: 'orange', benefits: ['5% cashback', 'Maxsus takliflar'] },
    { name: 'Silver', min: 500, max: 1999, color: 'gray', benefits: ['7% cashback', 'Bepul yetkazib berish', 'Maxsus takliflar'] },
    { name: 'Gold', min: 2000, max: 4999, color: 'yellow', benefits: ['10% cashback', 'Bepul yetkazib berish', 'VIP qo\'llab-quvvatlash', 'Erta dostup'] },
    { name: 'Platinum', min: 5000, max: Infinity, color: 'purple', benefits: ['15% cashback', 'Bepul yetkazib berish', 'VIP qo\'llab-quvvatlash', 'Erta dostup', 'Shaxsiy menejer'] },
  ]

  const currentLevelIndex = levels.findIndex(l => userPoints >= l.min && userPoints <= l.max)
  const nextLevel = levels[currentLevelIndex + 1]
  const progressToNext = nextLevel ? ((userPoints - levels[currentLevelIndex].min) / (nextLevel.min - levels[currentLevelIndex].min)) * 100 : 100

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mukofotlar Dasturi</h1>
            <p className="text-gray-600">Xarid qiling va ball to'plang!</p>
          </div>

          {/* User Points Card */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-lg p-8 mb-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-primary-100 mb-2">Sizning ballingiz</p>
                <p className="text-5xl font-bold">{userPoints}</p>
              </div>
              <div className="text-right">
                <p className="text-primary-100 mb-2">Daraja</p>
                <p className="text-3xl font-bold">{userLevel}</p>
              </div>
            </div>

            {nextLevel && (
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Keyingi daraja: {nextLevel.name}</span>
                  <span>{nextLevel.min - userPoints} ball kerak</span>
                </div>
                <div className="w-full bg-primary-800 rounded-full h-3">
                  <div
                    className="bg-white h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Rewards */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Mukofotlar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rewards.map(reward => {
                  const Icon = reward.icon
                  const canRedeem = userPoints >= reward.points
                  return (
                    <div key={reward.id} className="bg-white rounded-xl shadow-lg p-6">
                      <div className={`w-12 h-12 bg-${reward.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 text-${reward.color}-600`} />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{reward.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">{reward.points} ball</span>
                        <button
                          disabled={!canRedeem}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            canRedeem
                              ? 'bg-primary-600 text-white hover:bg-primary-700'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {canRedeem ? 'Olish' : 'Yetarli emas'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Levels */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Darajalar</h2>
              <div className="space-y-4">
                {levels.map((level, index) => {
                  const isCurrentLevel = index === currentLevelIndex
                  return (
                    <div
                      key={level.name}
                      className={`bg-white rounded-xl shadow-lg p-6 ${
                        isCurrentLevel ? 'ring-2 ring-primary-600' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900">{level.name}</h3>
                        {isCurrentLevel && (
                          <span className="px-3 py-1 bg-primary-100 text-primary-600 text-xs font-medium rounded-full">
                            Joriy
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {level.min} - {level.max === Infinity ? '∞' : level.max} ball
                      </p>
                      <ul className="space-y-2">
                        {level.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center space-x-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-primary-600 rounded-full" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Points History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ballar tarixi</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Sana</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Harakat</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Buyurtma</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Ballar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pointsHistory.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.action}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.order}</td>
                      <td className={`px-6 py-4 text-sm font-medium text-right ${
                        item.points > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.points > 0 ? '+' : ''}{item.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How it Works */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Qanday ishlaydi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: ShoppingBag, title: 'Xarid qiling', desc: 'Har 1000 so\'mdan 1 ball' },
                { icon: Star, title: 'Sharh qoldiring', desc: 'Har bir sharh uchun 50 ball' },
                { icon: Users, title: 'Do\'stlarni taklif qiling', desc: 'Har bir do\'st uchun 200 ball' },
                { icon: Gift, title: 'Mukofot oling', desc: 'Ballarni mukofotlarga almashtiring' },
              ].map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
