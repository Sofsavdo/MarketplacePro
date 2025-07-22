import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { language, switchLanguage, t } = useLanguage();

  return (
    <div className="lang-switcher flex space-x-1">
      <Button
        variant="ghost"
        size="sm"
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          language === 'uz' 
            ? 'active bg-[#2A6BFF] text-white' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
        onClick={() => switchLanguage('uz')}
      >
        UZ
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          language === 'ru' 
            ? 'active bg-[#2A6BFF] text-white' 
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
        onClick={() => switchLanguage('ru')}
      >
        RU
      </Button>
    </div>
  );
}
