import { useLanguage } from '@/hooks/use-language';
import { Link } from 'wouter';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-[#2A6BFF] mb-4">TexnoGrand</h3>
            <p className="text-gray-600 mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-[#2A6BFF] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
              <button className="text-gray-400 hover:text-[#2A6BFF] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </button>
              <button className="text-gray-400 hover:text-[#2A6BFF] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.2 0H1.8C.8 0 0 .8 0 1.8v20.4C0 23.2.8 24 1.8 24h20.4c1 0 1.8-.8 1.8-1.8V1.8C24 .8 23.2 0 22.2 0zM7.1 20.4H3.6V9h3.5v11.4zM5.3 7.4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20.4 20.4h-3.5v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.5V9h3.4v1.6h.1c.5-.9 1.7-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.1z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-[#2A6BFF] transition-colors">{t('footer.about')}</Link></li>
              <li><Link href="/delivery" className="text-gray-600 hover:text-[#2A6BFF] transition-colors">{t('footer.delivery')}</Link></li>
              <li><Link href="/payment" className="text-gray-600 hover:text-[#2A6BFF] transition-colors">{t('footer.paymentMethods')}</Link></li>
              <li><Link href="/warranty" className="text-gray-600 hover:text-[#2A6BFF] transition-colors">{t('footer.warranty')}</Link></li>
              <li><Link href="/returns" className="text-gray-600 hover:text-[#2A6BFF] transition-colors">{t('footer.returns')}</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">{t('footer.customerService')}</h4>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-600 hover:text-[#2A6BFF] transition-colors">{t('footer.helpCenter')}</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-[#2A6BFF] transition-colors">{t('footer.contact')}</Link></li>
              <li><Link href="/complaint" className="text-gray-600 hover:text-[#2A6BFF] transition-colors">{t('footer.complaint')}</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-[#2A6BFF] transition-colors">{t('footer.faq')}</Link></li>
              <li><Link href="/chat" className="text-gray-600 hover:text-[#2A6BFF] transition-colors">{t('footer.liveChat')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">{t('footer.contactInfo')}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">+998 71 200-00-00</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">info@texnogrand.uz</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <span className="text-gray-600">Toshkent sh., Chilonzor tumani</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="text-gray-600 font-medium">{t('footer.paymentMethodsLabel')}</span>
              <div className="flex space-x-3">
                <div className="w-12 h-8 bg-[#2A6BFF] rounded flex items-center justify-center text-white text-xs font-bold">
                  Click
                </div>
                <div className="w-12 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">
                  Payme
                </div>
                <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold">
                  UzCard
                </div>
                <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                  Humo
                </div>
              </div>
            </div>
            <div className="text-center text-gray-500 text-sm">
              <p>{t('footer.copyright')}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
