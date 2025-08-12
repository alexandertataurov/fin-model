import { toast } from 'sonner';

interface LoginError {
  type: 'validation' | 'authentication' | 'network' | 'security';
  message: string;
  action?: string;
  retryable?: boolean;
}

export const useLoginErrorHandler = () => {
  const handleError = (error: LoginError) => {
    switch (error.type) {
      case 'security':
        toast.error(error.message);
        break;

      case 'authentication':
        toast.error(error.message);
        break;

      case 'network':
        toast.error('Please check your internet connection and try again.');
        break;

      default:
        toast.error(error.message);
    }
  };

  return { handleError };
};
