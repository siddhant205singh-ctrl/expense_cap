import { forwardRef } from 'react';

const Select = forwardRef(({ label, error, options, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full rounded-lg border bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100
          focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
          disabled:cursor-not-allowed disabled:opacity-50 transition-colors
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'}
        `}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
