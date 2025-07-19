import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uzbekLocale } from '@/components/ui/uzbek-locale';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ 
  title = uzbekLocale.error, 
  message = uzbekLocale.networkError,
  onRetry 
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Qayta urinish
        </Button>
      )}
    </div>
  );
}