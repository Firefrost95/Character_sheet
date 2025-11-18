import React from 'react'

export const Button = React.forwardRef(
  ({ className = '', variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

    const variants = {
      default: 'bg-primary text-white hover:bg-primary/90',
      outline: 'border border-input bg-background hover:bg-accent',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-8',
      icon: 'h-10 w-10',
    }

    const variantClass = variants[variant] || variants.default
    const sizeClass = sizes[size] || sizes.md

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
