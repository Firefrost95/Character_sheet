export const Button = ({ children, className = '', ...props }) => (
  <button
    className={`px-4 py-2 rounded transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);
