export const Label = ({ className = '', ...props }) => (
  <label className={`text-sm font-medium text-slate-300 ${className}`} {...props} />
);
