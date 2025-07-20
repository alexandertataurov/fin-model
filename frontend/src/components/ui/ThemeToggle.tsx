import type { ButtonHTMLAttributes } from 'react';
import Button from './Button';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme: 'light' | 'dark';
  onToggle: () => void;
  className?: string;
}

function ThemeToggle({ theme, onToggle, className = '', ...rest }: Props) {
  return (
    <Button className={className} onClick={onToggle} {...rest}>
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </Button>
  );
}

export default ThemeToggle;
