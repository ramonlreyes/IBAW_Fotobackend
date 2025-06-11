import { CodeSquare } from "lucide-react";
import { useState, useEffect } from "react";

export const useFormValidation = (initialValues, validationRules) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';

    for (const validation of rule) {
      const error = validation(value, formData);
      if (error) return error;
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({...prev, [name]: newValue}));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    if (touched[name] || formData[name]) {
      const error = validateField(name, formData[name]);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFormData,
    setErrors
  };
};