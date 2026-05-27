import Link from 'next/link';
import React from 'react';
import { Color } from '../../utils/contants/Color';

// Universal Button Component (reused from previous)
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
  onKeyDown?: () => void;
  disabled?: boolean;
  href?: string;
  style?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled = false,
  href = '',
  style
}) => {
  const baseStyles =
    'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

  const variants = {
    primary:
      'bg-[#3E3F29] text-white hover:bg-[#1d1e12] active:bg-blue-800 disabled:bg-blue-300',
    secondary:
      'bg-slate-700 text-white hover:bg-slate-800 active:bg-slate-900 disabled:bg-slate-400',
    outline:
      'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 disabled:border-blue-300 disabled:text-blue-300',
    ghost:
      'text-slate-700 hover:bg-slate-100 active:bg-slate-200 disabled:text-slate-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  if (href.length > 0) {
    return (
      <Link
        href={href}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${style} ${
          fullWidth ? 'w-full' : ''
        }`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onKeyDown={onClick}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${style} ${
        fullWidth ? 'w-full' : ''
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
