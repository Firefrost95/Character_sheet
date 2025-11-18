import React, { useState, createContext, useContext } from 'react'
import { ChevronDown } from 'lucide-react'

const SelectContext = createContext()

export const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false)

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = React.forwardRef(({ className = '', children, ...props }, ref) => {
  const { open, setOpen } = useContext(SelectContext)

  return (
    <button
      ref={ref}
      onClick={() => setOpen(!open)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent ${className}`}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
})
SelectTrigger.displayName = 'SelectTrigger'

export const SelectValue = ({ placeholder = 'Select...' }) => {
  const { value } = useContext(SelectContext)
  return <span>{value || placeholder}</span>
}

export const SelectContent = ({ children, className = '' }) => {
  const { open } = useContext(SelectContext)

  if (!open) return null

  return (
    <div
      className={`absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-slate-700 bg-slate-900 shadow-md ${className}`}
    >
      <div className="max-h-60 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

export const SelectItem = ({ value, children, className = '' }) => {
  const { value: selectedValue, onValueChange, setOpen } = useContext(SelectContext)
  const isSelected = selectedValue === value

  return (
    <button
      onClick={() => {
        onValueChange(value)
        setOpen(false)
      }}
      className={`w-full px-3 py-2 text-left text-sm hover:bg-amber-600/20 ${
        isSelected ? 'bg-amber-600 text-white' : 'text-slate-100'
      } ${className}`}
    >
      {children}
    </button>
  )
}
