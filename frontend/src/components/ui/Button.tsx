import React, { forwardRef } from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
  Box,
} from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'size'> {
  loading?: boolean;
  loadingText?: string;
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      loading = false,
      loadingText,
      disabled,
      variant = 'contained',
      size = 'medium',
      icon,
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const sizeMap = {
      small: { height: 32, minWidth: 64 },
      medium: { height: 40, minWidth: 80 },
      large: { height: 48, minWidth: 96 },
    };

    const buttonStyles = {
      ...sizeMap[size],
      position: 'relative' as const,
      '&.Mui-disabled': {
        opacity: loading ? 0.7 : 0.5,
      },
    };

    const content = loading ? (loadingText || children) : children;

    return (
      <MuiButton
        ref={ref}
        variant={variant}
        disabled={isDisabled}
        startIcon={loading ? undefined : startIcon || icon}
        endIcon={loading ? undefined : endIcon}
        sx={buttonStyles}
        {...props}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CircularProgress
              size={16}
              color="inherit"
              sx={{
                color: variant === 'contained' ? 'white' : 'primary.main',
              }}
            />
          </Box>
        )}
        <Box
          sx={{
            opacity: loading ? 0 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {content}
        </Box>
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';

export default Button; 