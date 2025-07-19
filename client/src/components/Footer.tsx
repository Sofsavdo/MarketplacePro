import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Send } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    marketplace: [
      { name: 'Barcha mahsulotlar', href: '/marketplace' },
      { name: 'Kategoriyalar', href: '/categories' },
      { name: 'Chegirmalar', href: '/deals' },
      { name: 'Yangi mahsulotlar', href: '/new-products' }
    ],
    business: [
      { name: 'Sotuvchi bo\'ling', href: '/seller/onboarding' },
      { name: 'Blogger bo\'ling', href: '/affiliate/onboarding' },
      { name: 'API dokumentatsiya', href: '/docs' },
      { name: 'Biznes yechimlar', href: '/business' }
    ],
    support: [
      { name: 'Yordam markazi', href: '/help' },
      { name: 'Aloqa', href: '/contact' },
      { name: 'Buyurtma kuzatuvi', href: '/track-order' },
      { name: 'Qaytarish', href: '/returns' }
    ],
    legal: [
      { name: 'Foydalanish shartlari', href: '/terms' },
      { name: 'Maxfiylik siyosati', href: '/privacy' },
      { name: 'Cookie siyosati', href: '/cookies' },
      { name: 'Huquqiy ma\'lumotlar', href: '/legal' }
    ]
  };

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="h-10 w-10 marketplace-gradient rounded-lg flex items-center justify-center">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">O'zbek</h3>
                  <p className="text-sm text-brand-primary">Marketplace</p>
                </div>
              </Link>
              <p className="text-muted-foreground mb-6 max-w-md">
                O'zbekiston bozoriga moslashtirilgan eng yirik e-commerce platforma. 
                Sotuvchilar, blogerlar va xaridorlar uchun professional xizmatlar.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-brand-primary" />
                  <span>+998 (90) 123-45-67</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-brand-primary" />
                  <span>info@uzbek-marketplace.uz</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="h-4 w-4 text-brand-primary" />
                  <span>Toshkent, O'zbekiston</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                <a href="#" className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors">
                  <Send className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Footer Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Marketplace</h4>
              <ul className="space-y-3">
                {footerLinks.marketplace.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-brand-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Biznes</h4>
              <ul className="space-y-3">
                {footerLinks.business.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-brand-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Yordam</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-brand-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {currentYear} O'zbek Marketplace. Barcha huquqlar himoyalangan.
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.name}
                  to={link.href} 
                  className="text-xs text-muted-foreground hover:text-brand-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-border py-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Qabul qiladigan to'lov usullari:</p>
            <div className="flex justify-center items-center space-x-6">
              <div className="px-4 py-2 bg-white dark:bg-muted rounded-lg border text-sm font-medium">
                Click
              </div>
              <div className="px-4 py-2 bg-white dark:bg-muted rounded-lg border text-sm font-medium">
                Payme
              </div>
              <div className="px-4 py-2 bg-white dark:bg-muted rounded-lg border text-sm font-medium">
                Uzcard
              </div>
              <div className="px-4 py-2 bg-white dark:bg-muted rounded-lg border text-sm font-medium">
                Humo
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}