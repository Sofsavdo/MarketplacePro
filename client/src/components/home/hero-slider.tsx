import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';

interface Banner {
  id: number;
  titleUz: string;
  titleRu: string;
  descriptionUz?: string;
  descriptionRu?: string;
  image: string;
  link?: string;
}

export function HeroSlider() {
  const { language, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ['/api/banners'],
  });

  // Default banners if none from API
  const defaultBanners: Banner[] = [
    {
      id: 1,
      titleUz: "Premium Elektronika",
      titleRu: "Премиум Электроника",
      descriptionUz: "50% gacha chegirma - cheklangan vaqt!",
      descriptionRu: "Скидки до 50% - ограниченное время!",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      link: "/category/electronics",
    },
    {
      id: 2,
      titleUz: "Yangi Smartfonlar",
      titleRu: "Новые Смартфоны",
      descriptionUz: "Eng so'ngi modellar - tez yetkazib berish",
      descriptionRu: "Новейшие модели - быстрая доставка",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      link: "/category/smartphones",
    },
    {
      id: 3,
      titleUz: "Bepul Yetkazib Berish",
      titleRu: "Бесплатная Доставка",
      descriptionUz: "100,000 so'm dan yuqori xaridlarga",
      descriptionRu: "При покупке свыше 100,000 сум",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      link: "/delivery",
    },
  ];

  const slides = banners.length > 0 ? banners : defaultBanners;

  useEffect(() => {
    if (slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (slides.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-[#2A6BFF] to-blue-600 rounded-xl h-96 flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4">{t('home.heroTitle')}</h2>
            <p className="text-xl">{t('home.heroSubtitle')}</p>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = slides[currentSlide];
  const title = language === 'uz' ? currentBanner.titleUz : currentBanner.titleRu;
  const description = language === 'uz' ? currentBanner.descriptionUz : currentBanner.descriptionRu;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative rounded-xl overflow-hidden">
        <div className="relative h-96 flex transition-transform duration-500 ease-in-out"
             style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((banner, index) => (
            <div key={banner.id} className="w-full flex-shrink-0 relative">
              <div 
                className="w-full h-96 bg-gradient-to-r from-[#2A6BFF] to-blue-600 flex items-center bg-cover bg-center"
                style={{ 
                  backgroundImage: banner.image.startsWith('http') ? `url(${banner.image})` : undefined,
                  backgroundColor: banner.image.startsWith('http') ? undefined : '#2A6BFF'
                }}
              >
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-8 text-white">
                  <h2 className="text-4xl font-bold mb-4">
                    {language === 'uz' ? banner.titleUz : banner.titleRu}
                  </h2>
                  {(banner.descriptionUz || banner.descriptionRu) && (
                    <p className="text-xl mb-6">
                      {language === 'uz' ? banner.descriptionUz : banner.descriptionRu}
                    </p>
                  )}
                  <Button 
                    className="btn-texno-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                    onClick={() => banner.link && (window.location.href = banner.link)}
                  >
                    {t('home.shopNow')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#2A6BFF] rounded-full"
          onClick={goToPrevious}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#2A6BFF] rounded-full"
          onClick={goToNext}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-[#2A6BFF]' : 'bg-white/50'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
