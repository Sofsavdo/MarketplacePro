'use client';

import React from 'react';
import Link from 'next/link';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon
} from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-blue-400">AFFILIMART</h3>
              <p className="text-gray-300 mt-2">
                O'zbekistondagi yetakchi marketplace va affiliate network platformasi
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <TwitterIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <LinkedinIcon className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tezkor havolalar</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-blue-400">
                  Mahsulotlar
                </Link>
              </li>
              <li>
                <Link href="/bloggers" className="text-gray-300 hover:text-blue-400">
                  Blogerlar
                </Link>
              </li>
              <li>
                <Link href="/merchants" className="text-gray-300 hover:text-blue-400">
                  Sotuvchilar
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-blue-400">
                  Biz haqida
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-blue-400">
                  Aloqa
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Xizmatlar</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/affiliate" className="text-gray-300 hover:text-blue-400">
                  Affiliate dastur
                </Link>
              </li>
              <li>
                <Link href="/advertising" className="text-gray-300 hover:text-blue-400">
                  Reklama xizmatlari
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-gray-300 hover:text-blue-400">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-blue-400">
                  Texnik yordam
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-gray-300 hover:text-blue-400">
                  API hujjatlari
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Aloqa ma'lumotlari</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">
                  Toshkent, O'zbekiston
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">
                  +998 71 123 45 67
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">
                  info@affilimart.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 AFFILIMART. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-blue-400 text-sm">
                Maxfiylik siyosati
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-blue-400 text-sm">
                Foydalanish shartlari
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-blue-400 text-sm">
                Cookie siyosati
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 