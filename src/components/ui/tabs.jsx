import { useState, createContext, useContext } from 'react';

const TabContext = createContext();

export const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const TabsList = ({ children, className = '' }) => (
  <div className={`flex border-b border-slate-700 ${className}`}>
    {children}
  </div>
);

export const TabsTrigger = ({ value, children, className = '' }) => {
  const { activeTab, setActiveTab } = useContext(TabContext);
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 transition-colors ${
        activeTab === value
          ? 'border-b-2 border-amber-400 text-amber-400'
          : 'text-slate-400 hover:text-slate-300'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className = '' }) => {
  const { activeTab } = useContext(TabContext);
  return activeTab === value ? <div className={className}>{children}</div> : null;
};
