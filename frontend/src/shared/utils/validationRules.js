export const validationRules = {

  email: [
    (value) => !value?.trim() ? 'Email is required' : '',
    (value) => !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) 
      ? 'Please enter a valid email address' : ''
  ],
  
  password: [
    (value) => !value ? 'Password is required' : '',
    (value) => value && value.length < 6 ? 'Password must be at least 6 characters long' : ''
  ],
  
  name: [
    (value) => !value?.trim() ? 'Full name is required' : '',
    (value) => value?.trim() && value.trim().length < 2 ? 'Name must be at least 2 characters long' : ''
  ],
  
  confirmPassword: [
    (value) => !value ? 'Please confirm your password' : '',
    (value, formData) => value !== formData.password ? 'Passwords do not match' : ''
  ],
  
  agreeToTerms: [
    (value) => !value ? 'You must agree to the terms and conditions' : ''
  ],

  firstName: [
    (value) => !value?.trim() ? 'First name is required' : '',
    (value) => value?.length < 2 ? 'First name must be at least 2 characters' : ''
  ],

  lastName: [
    (value) => !value?.trim() ? 'Last name is required' : '',
    (value) => value?.length < 2 ? 'Last name must be at least 2 characters' : ''
  ],

  phoneNumber: [
    (value) => value && !/^[\d\s\-\+\(\)]+$/.test(value) ? 'Please enter a valid phone number' : ''
  ],
  
  message: [
    (value) => !value?.trim() ? 'Message is required' : '',
    (value) => value?.length < 10 ? 'Message must be at least 10 characters' : ''
  ]
};