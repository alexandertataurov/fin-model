import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { Checkbox } from './checkbox';
import { Label } from './label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { ChevronDown, X, Search, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface MultiSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
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

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOptions = options.filter(option =>
    value.includes(option.value)
  );

  const handleToggleOption = (optionValue: string | number) => {
    if (disabled) return;

    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : maxItems && value.length >= maxItems
      ? value
      : [...value, optionValue];

    onChange?.(newValue);
  };

  const handleClear = () => {
    if (disabled) return;
    onChange?.([]);
  };

  const getDisplayValue = () => {
    if (selectedOptions.length === 0) return placeholder;
    if (selectedOptions.length === 1) return selectedOptions[0].label;
    return `${selectedOptions.length} items selected`;
  };

  return (
    <div className={cn('w-full', !fullWidth && 'w-auto')}>
      {label && (
        <Label
          className={cn(
            'text-sm font-medium mb-2 block',
            error && 'text-destructive'
          )}
        >
          {label}
        </Label>
      )}

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between',
              size === 'small' && 'h-8 text-sm',
              size === 'medium' && 'h-9',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
          >
            <span className="truncate">{getDisplayValue()}</span>
            <div className="flex items-center gap-1">
              {clearable && selectedOptions.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={e => {
                    e.stopPropagation();
                    handleClear();
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] p-0"
          align="start"
        >
          {searchable && (
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 h-8"
                />
              </div>
            </div>
          )}

          <div className="max-h-[300px] overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">
                No options available
              </div>
            ) : (
              filteredOptions.map(option => {
                const isSelected = value.includes(option.value);
                const isDisabled = option.disabled || disabled;
                const canSelect =
                  !maxItems || value.length < maxItems || isSelected;

                return (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() =>
                      canSelect && handleToggleOption(option.value)
                    }
                    disabled={isDisabled || !canSelect}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={isDisabled || !canSelect}
                      onChange={() =>
                        canSelect && handleToggleOption(option.value)
                      }
                      onClick={e => e.stopPropagation()}
                    />
                    <span className="flex-1">{option.label}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                );
              })
            )}
          </div>

          {selectedOptions.length > 0 && (
            <div className="p-2 border-t">
              <div className="flex flex-wrap gap-1">
                {selectedOptions.map(option => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="text-xs"
                  >
                    {option.label}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1 hover:bg-transparent"
                      onClick={() => handleToggleOption(option.value)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {helperText && (
        <p
          className={cn(
            'text-sm mt-1',
            error ? 'text-destructive' : 'text-muted-foreground'
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default MultiSelect;
