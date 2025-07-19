import { uzbekLocale } from '@/components/ui/uzbek-locale';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ message = uzbekLocale.loading, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-2 border-brand-primary ${sizeClasses[size]} mb-4`}></div>
      <p className="text-muted-foreground text-center">{message}</p>
    </div>
  );
}