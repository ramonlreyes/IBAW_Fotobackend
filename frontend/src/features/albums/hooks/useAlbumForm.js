import { useState, useCallback } from "react";

const initialFormData = {
  title: '',
  description: '',
  category: ['all'],
  cover: null,
  images: []
};

export const useAlbumForm = (initialData = null) => {
  const [formData, setFormData] = useState(
    initialData ? { ...initialFormData, ...initialData }: initialFormData
  );
  const [errors, setErrors] = useState({});

  const handleInputChange = useCallback((e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'cover' ? files[0] : files
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'ALbum title is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback((newData = null) => {
    setFormData(newData ? { ... initialFormData, ...newData } : initialFormData);
    setErrors({});
  }, []);

  const getFormDataForSubmission = useCallback(() => {
    return {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      cover: formData.cover,
      images: formData.images ? Array.from(formData.images) : []
    };
  }, [formData]);

  return {
    formData,
    errors,
    handleInputChange,
    validateForm,
    resetForm,
    getFormDataForSubmission,
    isValid: Object.keys(errors).length === 0,
    hasChanges: JSON.stringify(formData) !== JSON.stringify(initialFormData)
  };
};