import React from 'react';
import { Alert, AlertDescription } from '../Alert';
import { FormStatusAlertProps } from './FormStatusAlert.types'; // Import from types file

export const FormStatusAlert: React.FC<FormStatusAlertProps> = ({
  error,
  success,
  className = '',
}) => {
  if (!error && !success) {
    return null;
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert variant="success" className={className}>
        <AlertDescription>{success}</AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default FormStatusAlert;
