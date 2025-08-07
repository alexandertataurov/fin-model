// import { useToast } from '@/components/ui/ErrorHandling';

interface LoginError {
  type: 'validation' | 'authentication' | 'network' | 'security';
  message: string;
  action?: string;
  retryable?: boolean;
}

export const useLoginErrorHandler = () => {
  const { showToast } = useToast();

  const handleError = (error: LoginError) => {
    switch (error.type) {
      case 'security':
        showToast(error.message, 'error');
        break;

      case 'authentication':
        showToast(error.message, 'error');
        break;

      case 'network':
        showToast(
          'Please check your internet connection and try again.',
          'error'
        );
        break;

      default:
        showToast(error.message, 'error');
    }
  };

  return { handleError };
};
