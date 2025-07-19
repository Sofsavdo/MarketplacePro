import { ReactNode } from 'react';
import { uzbekLocale } from '@/components/ui/uzbek-locale';

interface UzbekLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function UzbekLayout({ children, title, description }: UzbekLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground" dir="ltr">
      {title && (
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}