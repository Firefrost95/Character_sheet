export const Select = ({ children }) => <>{children}</>;
export const SelectTrigger = ({ className = '', children }) => (
  <select className={`px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white ${className}`}>
    {children}
  </select>
);
export const SelectValue = ({ placeholder }) => <>{placeholder}</>;
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;
