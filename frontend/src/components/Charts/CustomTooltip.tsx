import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';



interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number | string;
    name: string;
    color: string;
    dataKey: string;
    payload?: any;
  }>;
  label?: string;
  formatter?: (value: number | string, name: string) => [string, string];
  labelFormatter?: (label: string) => string;
  currency?: string;
  showTotal?: boolean;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  currency = '$',
  showTotal = false,
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return String(value);
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === '$' ? 'USD' : currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const formatPercentage = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return String(value);
    
    return `${numValue.toFixed(1)}%`;
  };

  const getFormattedValue = (value: number | string, name: string): string => {
    if (formatter) {
      return formatter(value, name)[0];
    }
    
    // Auto-detect formatting based on name or value
    if (name.toLowerCase().includes('percent') || name.toLowerCase().includes('rate') || name.toLowerCase().includes('margin')) {
      return formatPercentage(value);
    }
    
    if (typeof value === 'number' && Math.abs(value) > 100) {
      return formatCurrency(value);
    }
    
    return String(value);
  };

  const formattedLabel = labelFormatter ? labelFormatter(label || '') : label;
  
  const total = showTotal && payload.length > 1 
    ? payload.reduce((sum, item) => {
        const val = typeof item.value === 'number' ? item.value : parseFloat(String(item.value)) || 0;
        return sum + val;
      }, 0)
    : null;

  return (
    <Paper
      elevation={8}
      sx={{
        p: 2,
        minWidth: 200,
        maxWidth: 300,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        '& .MuiTypography-root': {
          fontSize: '0.875rem',
        },
      }}
    >
      {/* Label */}
      {formattedLabel && (
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: 'text.primary',
          }}
        >
          {formattedLabel}
        </Typography>
      )}

      {/* Data Items */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {payload.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color,
                  borderRadius: '50%',
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                {formatter ? formatter(item.value, item.name)[1] : item.name}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                textAlign: 'right',
              }}
            >
              {getFormattedValue(item.value, item.name)}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Total */}
      {total !== null && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              Total
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                textAlign: 'right',
              }}
            >
              {formatCurrency(total)}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default CustomTooltip; 