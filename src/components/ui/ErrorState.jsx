import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Unable to load project data',
  message = 'An unexpected error occurred while communicating with the server.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      
      <h3 className="text-sm font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-md mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Retry Loading
        </Button>
      )}
    </div>
  );
};
