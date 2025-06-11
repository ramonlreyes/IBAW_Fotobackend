import React from 'react';

const Input = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  required = false,
  autoComplete,
  icon: Icon,
  error,
  touched,
  className = '',
  ...props
}) => {
  const hasError = error && touched;
  
  const inputClasses = `
    w-full pl-10 pr-4 py-3 border rounded-lg transition-colors duration-200 text-sm
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
    ${hasError 
      ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400' 
      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 hover:border-gray-400'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon 
            className={`h-5 w-5 ${
              hasError ? 'text-red-400' : 'text-gray-400'
            }`}
          />
        </div>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className={inputClasses}
        {...props}
      />
    </div>
  );
};

export default Input;