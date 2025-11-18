import React, { useState, createContext, useContext } from 'react'

const TabsContext = createContext()

export const Tabs = ({ defaultValue, className = '', children, ...props }) => {
  const [value, setValue] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export const TabsList = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-900 p-1 text-slate-400 ${className}`}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

export const TabsTrigger = React.forwardRef(({ value, className = '', ...props }, ref) => {
  const { value: activeValue, setValue } = useContext(TabsContext)
  const isActive = activeValue === value

  return (
    <button
      ref={ref}
      onClick={() => setValue(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-slate-900 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? 'bg-amber-600 text-white shadow-sm'
          : 'text-slate-400 hover:text-slate-300'
      } ${className}`}
      {...props}
    />
  )
})
TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = React.forwardRef(({ value, className = '', ...props }, ref) => {
  const { value: activeValue } = useContext(TabsContext)

  if (activeValue !== value) return null

  return (
    <div
      ref={ref}
      className={`mt-2 ring-offset-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 ${className}`}
      {...props}
    />
  )
})
TabsContent.displayName = 'TabsContent'
