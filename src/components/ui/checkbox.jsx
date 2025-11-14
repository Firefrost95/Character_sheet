export const Checkbox = ({ className = '', ...props }) => (
  <input
    type="checkbox"
    className={`w-4 h-4 accent-amber-400 ${className}`}
    {...props}
  />
);
