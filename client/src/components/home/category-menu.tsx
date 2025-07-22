import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/use-language';
import { Link } from 'wouter';
import { 
  Smartphone, 
  Laptop, 
  Home, 
  Dumbbell, 
  Sparkles, 
  Book, 
  Car, 
  Gamepad2, 
  Baby, 
  MoreHorizontal 
} from 'lucide-react';

interface Category {
  id: number;
  nameUz: string;
  nameRu: string;
  slug: string;
  icon?: string;
}

const iconMap: { [key: string]: any } = {
  device: Smartphone,
  laptop: Laptop,
  home: Home,
  sport: Dumbbell,
  beauty: Sparkles,
  book: Book,
  car: Car,
  game: Gamepad2,
  baby: Baby,
  more: MoreHorizontal,
};

export function CategoryMenu() {
  const { language, t } = useLanguage();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Default categories if none from API
  const defaultCategories: Category[] = [
    { id: 1, nameUz: "Elektronika", nameRu: "Электроника", slug: "electronics", icon: "device" },
    { id: 2, nameUz: "Kiyim", nameRu: "Одежда", slug: "clothing", icon: "shirt" },
    { id: 3, nameUz: "Uy-joy", nameRu: "Дом", slug: "home", icon: "home" },
    { id: 4, nameUz: "Sport", nameRu: "Спорт", slug: "sports", icon: "sport" },
    { id: 5, nameUz: "Go'zallik", nameRu: "Красота", slug: "beauty", icon: "beauty" },
    { id: 6, nameUz: "Kitoblar", nameRu: "Книги", slug: "books", icon: "book" },
    { id: 7, nameUz: "Avtotovarlar", nameRu: "Автотовары", slug: "auto", icon: "car" },
    { id: 8, nameUz: "O'yinlar", nameRu: "Игры", slug: "games", icon: "game" },
    { id: 9, nameUz: "Bolalar", nameRu: "Дети", slug: "kids", icon: "baby" },
    { id: 10, nameUz: "Boshqa", nameRu: "Другое", slug: "other", icon: "more" },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">{t('home.categories')}</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-4">
          {displayCategories.map((category) => {
            const IconComponent = iconMap[category.icon || 'more'] || MoreHorizontal;
            const name = language === 'uz' ? category.nameUz : category.nameRu;
            
            return (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <div className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-[#2A6BFF] group-hover:text-white transition-all">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-gray-600 group-hover:text-[#2A6BFF] transition-colors">
                    {name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
