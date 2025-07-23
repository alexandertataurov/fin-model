import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  Chip,
  Paper,
  MenuItem,
  MenuList,
  ClickAwayListener,
  Popper,
  Checkbox,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

export interface MultiSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: (string | number)[];
  onChange?: (values: (string | number)[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  maxItems?: number;
  searchable?: boolean;
  clearable?: boolean;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = 'Select items...',
  label,
  disabled = false,
  error = false,
  helperText,
  maxItems,
  searchable = true,
  clearable = true,
  size = 'medium',
  fullWidth = true,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const anchorRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group options if they have groups
  const groupedOptions = filteredOptions.reduce((groups, option) => {
    const group = option.group || 'ungrouped';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(option);
    return groups;
  }, {} as Record<string, MultiSelectOption[]>);

  const handleToggle = () => {
    if (!disabled) {
      setOpen(prev => !prev);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSearchTerm('');
  };

  const handleOptionClick = (optionValue: string | number) => {
    if (disabled) return;

    let newValue: (string | number)[];
    
    if (value.includes(optionValue)) {
      // Remove item
      newValue = value.filter(v => v !== optionValue);
    } else {
      // Add item (check max limit)
      if (maxItems && value.length >= maxItems) {
        return; // Don't add if max reached
      }
      newValue = [...value, optionValue];
    }

    onChange?.(newValue);
  };

  const handleRemoveChip = (optionValue: string | number) => {
    if (disabled) return;
    const newValue = value.filter(v => v !== optionValue);
    onChange?.(newValue);
  };

  const handleClearAll = () => {
    if (disabled) return;
    onChange?.([]);
  };

  const getSelectedLabels = () => {
    return value.map(val => {
      const option = options.find(opt => opt.value === val);
      return option?.label || String(val);
    });
  };

  const renderChips = () => {
    const selectedLabels = getSelectedLabels();
    
    if (selectedLabels.length === 0) {
      return (
        <Typography variant="body1" color="text.secondary">
          {placeholder}
        </Typography>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selectedLabels.map((label, index) => (
          <Chip
            key={`${value[index]}-${index}`}
            label={label}
            size={size}
            onDelete={disabled ? undefined : () => handleRemoveChip(value[index])}
            sx={{ maxWidth: 200 }}
          />
        ))}
      </Box>
    );
  };

  const renderOptions = () => {
    if (Object.keys(groupedOptions).length === 0) {
      return (
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">
            No options available
          </Typography>
        </MenuItem>
      );
    }

    return Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
      <React.Fragment key={groupName}>
        {groupName !== 'ungrouped' && (
          <MenuItem disabled sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
            {groupName}
          </MenuItem>
        )}
        {groupOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            disabled={option.disabled}
            sx={{ pl: groupName !== 'ungrouped' ? 4 : 2 }}
          >
            <Checkbox
              checked={value.includes(option.value)}
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2">{option.label}</Typography>
          </MenuItem>
        ))}
      </React.Fragment>
    ));
  };

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        ref={anchorRef}
        label={label}
        value="" // Always empty for display
        onClick={handleToggle}
        error={error}
        helperText={helperText}
        disabled={disabled}
        size={size}
        fullWidth={fullWidth}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <Box sx={{ width: '100%', minHeight: size === 'small' ? 32 : 40 }}>
              {renderChips()}
            </Box>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {clearable && value.length > 0 && !disabled && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearAll();
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton size="small" disabled={disabled}>
                <ExpandMoreIcon 
                  fontSize="small"
                  sx={{
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
              </IconButton>
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
        style={{ width: anchorRef.current?.offsetWidth, zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper elevation={8} sx={{ maxHeight: 300, overflow: 'auto' }}>
            {searchable && (
              <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                <TextField
                  size="small"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  autoFocus
                />
              </Box>
            )}
            
            <MenuList dense>
              {renderOptions()}
            </MenuList>
            
            {maxItems && (
              <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {value.length} of {maxItems} selected
                </Typography>
              </Box>
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default MultiSelect; 