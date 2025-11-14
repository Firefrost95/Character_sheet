export const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 ${className}`}
    {...props}
  />
);
