import React from 'react'
import { Check } from 'lucide-react'

export const Checkbox = React.forwardRef(({ className = '', ...props }, ref) => (
  <div className="flex items-center">
    <input
      ref={ref}
      type="checkbox"
      className={`h-4 w-4 rounded border border-slate-700 bg-slate-900 cursor-pointer appearance-none checked:bg-amber-600 checked:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-slate-900 ${className}`}
      {...props}
    />
  </div>
))
Checkbox.displayName = 'Checkbox'
