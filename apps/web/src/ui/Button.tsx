import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'bg-white text-brand border border-brand hover:bg-gray-50',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded px-4 py-2 font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
