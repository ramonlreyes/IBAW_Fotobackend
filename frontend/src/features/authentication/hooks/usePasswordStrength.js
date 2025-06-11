import { useState, useEffect } from "react";

export const usePasswordStrength = (password) => {
  const [strength, setStrength] = useState({ score: 0, feedback: [] });

  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, feedback: [] });
      return;
    }

    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    setStrength({ score, feedback });
  }, [password]);

  const getStrengthColor = () => {
    if (strength.score <= 1) return 'bg-red-500';
    if (strength.score <= 2) return 'bg-orange-500';
    if (strength.score <= 3) return 'bg-yellow-500';
    if (strength.score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength.score <= 1) return 'Very Weak';
    if (strength.score <= 2) return 'Weak';
    if (strength.score <= 3) return 'Fair';
    if (strength.score <= 4) return 'Good';
    return 'Strong';
  };

  return {
    ...strength,
    getStrengthColor,
    getStrengthText
  };
};