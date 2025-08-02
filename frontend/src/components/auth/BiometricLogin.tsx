import React, { useState, useEffect } from 'react';
import { Fingerprint, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface BiometricLoginProps {
  onBiometricLogin: () => Promise<void>;
  isLoading?: boolean;
}

export const BiometricLogin: React.FC<BiometricLoginProps> = ({
  onBiometricLogin,
  isLoading = false,
}) => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if WebAuthn is supported
    setIsSupported(!!window.PublicKeyCredential);
  }, []);

  if (!isSupported) return null;

  return (
    <div className="space-y-4">
      <Separator className="my-4" />
      <Button
        variant="outline"
        className="w-full"
        onClick={onBiometricLogin}
        disabled={isLoading}
        type="button"
      >
        <Fingerprint className="mr-2 h-4 w-4" />
        Sign in with biometrics
      </Button>
    </div>
  );
};
