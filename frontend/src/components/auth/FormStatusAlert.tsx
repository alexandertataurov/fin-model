import React from 'react';
import { Alert, AlertDescription } from '@/design-system/components/Alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormStatusAlertProps {
  error?: string | null;
  success?: string | null;
}

const FormStatusAlert: React.FC<FormStatusAlertProps> = ({ error, success }) => (
  <>
    {error && (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
    {success && (
      <Alert
        variant="default"
        className="border-green-200 bg-green-50 text-green-800"
      >
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>{success}</AlertDescription>
      </Alert>
    )}
  </>
);

export default FormStatusAlert;
