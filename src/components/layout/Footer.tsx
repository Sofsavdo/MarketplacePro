import Link from 'next/link'
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Instagram, Send } from 'lucide-react'

export default function Footer() {
  const footerLinks = {
    company: [
      { name: 'Biz haqimizda', href: '/about' },
      { name: 'Aloqa', href: '/contact' },
      { name: 'Yangiliklar', href: '/news' },
      { name: 'Karyera', href: '/careers' },
    ],
    customer: [
      { name: 'Yordam markazi', href: '/help' },
      { name: 'Yetkazib berish', href: '/shipping' },
      { name: 'Qaytarish', href: '/returns' },
      { name: 'FAQ', href: '/faq' },
    ],
    seller: [
      { name: 'Sotuvchi bo\'lish', href: '/become-seller' },
      { name: 'Sotuvchi markazi', href: '/seller/dashboard' },
      { name: 'Qo\'llanma', href: '/seller-guide' },
    ],
    blogger: [
      { name: 'Bloger bo\'lish', href: '/become-blogger' },
      { name: 'Bloger markazi', href: '/blogger/dashboard' },
      { name: 'Hamkorlik', href: '/partnership' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                DUBAYMALL
              </span>
            </Link>
            <p className="text-sm mb-4">
              O'zbekistondagi eng yirik premium e-commerce platformasi
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kompaniya</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-primary-400 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Xizmatlar</h3>
            <ul className="space-y-2">
              {footerLinks.customer.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-primary-400 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seller */}
          <div>
            <h3 className="text-white font-semibold mb-4">Sotuvchilar</h3>
            <ul className="space-y-2">
              {footerLinks.seller.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-primary-400 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blogger */}
          <div>
            <h3 className="text-white font-semibold mb-4">Blogerlar</h3>
            <ul className="space-y-2">
              {footerLinks.blogger.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-primary-400 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary-400 mt-1" />
              <div>
                <div className="text-white font-semibold mb-1">Telefon</div>
                <a href="tel:+998712000000" className="text-sm hover:text-primary-400 transition">
                  +998 71 200 00 00
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary-400 mt-1" />
              <div>
                <div className="text-white font-semibold mb-1">Email</div>
                <a href="mailto:info@dubaymall.uz" className="text-sm hover:text-primary-400 transition">
                  info@dubaymall.uz
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary-400 mt-1" />
              <div>
                <div className="text-white font-semibold mb-1">Manzil</div>
                <p className="text-sm">
                  Toshkent sh., Chilonzor tumani
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-4">To'lov usullari</h3>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">Click</div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">Payme</div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">Uzum</div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">Visa</div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">Mastercard</div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">Humo</div>
              <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm">Uzcard</div>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-800">
            <p className="text-sm">
              © 2024 DUBAYMALL. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="hover:text-primary-400 transition">
                Maxfiylik siyosati
              </Link>
              <Link href="/terms" className="hover:text-primary-400 transition">
                Foydalanish shartlari
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
