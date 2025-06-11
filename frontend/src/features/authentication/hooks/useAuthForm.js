import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export const useAuthForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, error, clearError } = useAuth();

  const handleLogin = async (formData, onSuccess) => {
    setIsSubmitting(true);

    try {
      clearError();
      const userData = await login(formData.email, formData.password);
      console.log('Login Successfull:', userData);
      onSuccess?.(userData);
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (formData, onSuccess) => {
    setIsSubmitting(true);

    try {
      clearError();
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      const userData = await register(registrationData);
      console.log('Registration Successful:', userData);
      onSuccess?.(userData);
      return userData;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    console.log('We dont have the capacity for that big man :( ');
  };

  return {
    isSubmitting,
    handleLogin,
    handleRegister,
    handleGoogleAuth,
    authError: error,
    clearAuthError: clearError
  };
};