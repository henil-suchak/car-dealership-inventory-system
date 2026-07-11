import React from 'react';

const Input = React.forwardRef(({
  label,
  id,
  type = 'text',
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        aria-invalid={error ? 'true' : 'false'}
        className={`block w-full rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border transition-colors ${
          error 
            ? 'border-red-300 dark:border-red-500/50 text-red-900 dark:text-red-400 focus:border-red-500 focus:ring-red-500' 
            : 'border-slate-300 dark:border-slate-700'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
