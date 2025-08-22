import * as React from 'react';
import { cn } from '../../../utils/cn';
// No need for getToken here, as CVA will generate Tailwind classes directly

import { SearchInputProps, SearchInputRef } from './SearchInput.types';
import { Input } from '../../atoms/Input';
import { Icon } from '../../atoms/Icon';
import { Button } from '../../atoms/Button';
import { Loader2 } from 'lucide-react';

import {
  searchInputContainerVariants,
  searchInputWrapperVariants,
  searchInputIconContainerVariants,
  searchInputButtonVariants,
} from './SearchInput.variants';

const SearchInput = React.forwardRef<SearchInputRef, SearchInputProps>(
  (
    {
      placeholder = 'Search...',
      value = '',
      onChange,
      onSearch,
      onClear,
      loading = false,
      disabled = false,
      size = 'md',
      clearable = true,
      className,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState(value);

    React.useEffect(() => {
      setInputValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange?.(newValue);
    };

    const handleSearch = () => {
      onSearch?.(inputValue);
    };

    const handleClear = () => {
      setInputValue('');
      onChange?.('');
      onClear?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    return (
      <div className={cn(searchInputContainerVariants(), className)}>
        <div className={cn(searchInputWrapperVariants())}>
          <Input
            ref={ref}
            type="search"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled || loading}
            size={size}
            className="pr-20" // Keep this for now, as Input atom might not have a paddingRight prop
            {...props}
          />

          {/* Search Icon */}
          <div
            className={cn(
              searchInputIconContainerVariants({ position: 'left' })
            )}
          >
            {loading ? (
              <Icon
                icon={Loader2}
                size="sm"
                className="animate-spin text-muted-foreground"
              />
            ) : (
              <Icon name="Search" size="sm" className="text-muted-foreground" />
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={cn(
              searchInputIconContainerVariants({ position: 'right' })
            )}
          >
            {/* Clear Button */}
            {clearable && inputValue && !loading && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                disabled={disabled}
                className={cn(searchInputButtonVariants())}
              >
                <Icon name="X" size="xs" />
              </Button>
            )}

            {/* Search Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleSearch}
              disabled={disabled || loading || !inputValue}
              className={cn(searchInputButtonVariants())}
            >
              <Icon name="Search" size="xs" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
