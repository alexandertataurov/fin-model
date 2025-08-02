import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, type InputProps } from './input';
import { Button } from './button';
import { Progress } from './progress';
import { cn } from '@/utils/cn';

interface PasswordInputProps extends Omit<InputProps, 'type'> {
  showStrengthIndicator?: boolean;
  onPasswordStrengthChange?: (strength: number) => void;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      showStrengthIndicator = false,
      onPasswordStrengthChange,
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);

    const calculateStrength = (password: string): number => {
      let score = 0;
      if (password.length >= 8) score += 25;
      if (/[A-Z]/.test(password)) score += 25;
      if (/[0-9]/.test(password)) score += 25;
      if (/[^A-Za-z0-9]/.test(password)) score += 25;
      return score;
    };

    const getStrengthLabel = (strength: number): string => {
      if (strength < 25) return 'Very Weak';
      if (strength < 50) return 'Weak';
      if (strength < 75) return 'Good';
      return 'Strong';
    };

    const getStrengthColor = (strength: number): string => {
      if (strength < 50) return 'bg-destructive';
          if (strength < 75) return 'bg-amber-600';
    return 'bg-green-700';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStrength = calculateStrength(e.target.value);
      setStrength(newStrength);
      onPasswordStrengthChange?.(newStrength);
      props.onChange?.(e);
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            className={cn('pr-10', className)}
            ref={ref}
            onChange={handleChange}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {showStrengthIndicator && props.value && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Password strength</span>
              <span
                className={cn(
                  'font-medium',
                  strength < 50
                    ? 'text-destructive'
                    : strength < 75
                    ? 'text-yellow-600'
                    : 'text-green-600'
                )}
              >
                {getStrengthLabel(strength)}
              </span>
            </div>
            <Progress
              value={strength}
              className={cn('h-1', getStrengthColor(strength))}
            />
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
