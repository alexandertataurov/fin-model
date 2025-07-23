import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  Paper,
  ClickAwayListener,
  Popper,
  Typography,
  Button,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  DateRange as DateRangeIcon,
  ChevronLeft,
  ChevronRight,
  Today as TodayIcon,
} from '@mui/icons-material';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  minDate?: Date;
  maxDate?: Date;
  presets?: { label: string; range: DateRange }[];
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DEFAULT_PRESETS = [
  {
    label: 'Today',
    range: { startDate: new Date(), endDate: new Date() }
  },
  {
    label: 'Yesterday',
    range: {
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  },
  {
    label: 'Last 7 days',
    range: {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date()
    }
  },
  {
    label: 'Last 30 days',
    range: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date()
    }
  },
  {
    label: 'This month',
    range: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date()
    }
  },
  {
    label: 'Last month',
    range: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0)
    }
  },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value = { startDate: null, endDate: null },
  onChange,
  label,
  placeholder = 'Select date range',
  disabled = false,
  error = false,
  helperText,
  size = 'medium',
  fullWidth = true,
  minDate,
  maxDate,
  presets = DEFAULT_PRESETS,
}) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);
  const anchorRef = useRef<HTMLDivElement>(null);

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDisplayValue = (): string => {
    if (!value.startDate && !value.endDate) return '';
    if (value.startDate && !value.endDate) return formatDate(value.startDate);
    if (!value.startDate && value.endDate) return formatDate(value.endDate);
    return `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`;
  };

  const handleToggle = () => {
    if (!disabled) {
      setOpen(prev => !prev);
      setSelectingStart(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateClick = (date: Date) => {
    if (disabled) return;

    if (selectingStart || !value.startDate) {
      // Selecting start date
      onChange?.({ startDate: date, endDate: null });
      setSelectingStart(false);
    } else {
      // Selecting end date
      if (date >= value.startDate) {
        onChange?.({ ...value, endDate: date });
        setOpen(false);
      } else {
        // If end date is before start date, make it the new start date
        onChange?.({ startDate: date, endDate: null });
        setSelectingStart(false);
      }
    }
  };

  const handlePresetClick = (preset: { label: string; range: DateRange }) => {
    onChange?.(preset.range);
    setOpen(false);
  };

  const handlePrevMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isDateInRange = (date: Date): boolean => {
    if (!value.startDate || !value.endDate) return false;
    return date >= value.startDate && date <= value.endDate;
  };

  const isDateSelected = (date: Date): boolean => {
    return (value.startDate && date.toDateString() === value.startDate.toDateString()) ||
           (value.endDate && date.toDateString() === value.endDate.toDateString());
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return (
      <Box sx={{ width: 280, p: 2 }}>
        {/* Month navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <IconButton size="small" onClick={handlePrevMonth}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="subtitle1" fontWeight="bold">
            {MONTHS[month]} {year}
          </Typography>
          <IconButton size="small" onClick={handleNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Day headers */}
        <Grid container spacing={0} sx={{ mb: 1 }}>
          {DAYS.map(day => (
            <Grid item xs key={day} sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar days */}
        <Grid container spacing={0}>
          {days.map((date, index) => {
            const isCurrentMonth = date.getMonth() === month;
            const isSelected = isDateSelected(date);
            const isInRange = isDateInRange(date);
            const isDisabled = isDateDisabled(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <Grid item xs key={index}>
                <Button
                  size="small"
                  onClick={() => handleDateClick(date)}
                  disabled={isDisabled}
                  sx={{
                    minWidth: 32,
                    height: 32,
                    p: 0,
                    color: isCurrentMonth ? 'text.primary' : 'text.disabled',
                    backgroundColor: isSelected ? 'primary.main' : isInRange ? 'primary.light' : 'transparent',
                    color: isSelected ? 'primary.contrastText' : isInRange ? 'primary.dark' : undefined,
                    border: isToday && !isSelected ? 1 : 0,
                    borderColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  {date.getDate()}
                </Button>
              </Grid>
            );
          })}
        </Grid>

        {/* Selection hint */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {selectingStart ? 'Select start date' : 'Select end date'}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        ref={anchorRef}
        label={label}
        value={getDisplayValue()}
        placeholder={placeholder}
        onClick={handleToggle}
        error={error}
        helperText={helperText}
        disabled={disabled}
        size={size}
        fullWidth={fullWidth}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <DateRangeIcon color={disabled ? 'disabled' : 'action'} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiInputBase-input': {
            cursor: 'pointer',
          },
        }}
      />

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper elevation={8} sx={{ display: 'flex' }}>
            {/* Presets */}
            {presets.length > 0 && (
              <Box sx={{ width: 200, p: 2, borderRight: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Quick Select
                </Typography>
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    fullWidth
                    size="small"
                    variant="text"
                    onClick={() => handlePresetClick(preset)}
                    sx={{
                      justifyContent: 'flex-start',
                      mb: 0.5,
                      textTransform: 'none',
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
                
                <Divider sx={{ my: 1 }} />
                
                <Button
                  fullWidth
                  size="small"
                  variant="text"
                  startIcon={<TodayIcon />}
                  onClick={() => handlePresetClick({
                    label: 'Clear',
                    range: { startDate: null, endDate: null }
                  })}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                  }}
                >
                  Clear Selection
                </Button>
              </Box>
            )}

            {/* Calendar */}
            {renderCalendar()}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default DateRangePicker; 