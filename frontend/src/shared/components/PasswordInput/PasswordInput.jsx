import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  required = false,
  autoComplete,
  error,
  touched,
  showStrength = false,
  strengthData,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = error && touched;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputClasses = `
    w-full pl-10 pr-12 py-3 border rounded-lg transition-colors duration-200 text-sm
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
    ${hasError 
      ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400' 
      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 hover:border-gray-400'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  const getStrengthColor = () => {
    if (!strengthData) return 'bg-gray-200';
    
    switch (strengthData.level) {
      case 'weak':
        return 'bg-red-500';
      case 'fair':
        return 'bg-orange-500';
      case 'good':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  const getStrengthWidth = () => {
    if (!strengthData) return '0%';
    return `${(strengthData.score / 4) * 100}%`;
  };

  return (
    <div className="w-full">
      <div className="relative">
        {/* Lock Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock 
            className={`h-5 w-5 ${
              hasError ? 'text-red-400' : 'text-gray-400'
            }`}
          />
        </div>

        {/* Password Input */}
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
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

        {/* Eye Icon */}
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff 
              className={`h-5 w-5 ${
                hasError ? 'text-red-400' : 'text-gray-400 hover:text-gray-600'
              } transition-colors`}
            />
          ) : (
            <Eye 
              className={`h-5 w-5 ${
                hasError ? 'text-red-400' : 'text-gray-400 hover:text-gray-600'
              } transition-colors`}
            />
          )}
        </button>
      </div>

      {/* Password Strength Indicator */}
      {showStrength && value && strengthData && (
        <div className="mt-2 space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
              style={{ width: getStrengthWidth() }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className={`font-medium ${
              strengthData.level === 'weak' ? 'text-red-600' :
              strengthData.level === 'fair' ? 'text-orange-600' :
              strengthData.level === 'good' ? 'text-yellow-600' :
              strengthData.level === 'strong' ? 'text-green-600' :
              'text-gray-600'
            }`}>
              Password Strength: {strengthData.level ? strengthData.level.charAt(0).toUpperCase() + strengthData.level.slice(1) : 'None'}
            </span>
          </div>
          {strengthData.suggestions && strengthData.suggestions.length > 0 && (
            <div className="text-xs text-gray-600">
              <p className="font-medium mb-1">Suggestions:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {strengthData.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;