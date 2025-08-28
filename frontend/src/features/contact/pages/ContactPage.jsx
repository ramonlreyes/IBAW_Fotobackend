import { User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useFormValidation } from '../../authentication/hooks/useFormValidation'; 
import FormField from '../../../shared/components/FormField';
import Input from '../../../shared/components/Input';
import SocialMedia from '../../navigation/components/SocialMedia';
import { useNavigate } from 'react-router-dom';
import { validationRules } from '../../../shared/utils/validationRules';

const ContactPage = () => {

  const navigate = useNavigate();

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  };

  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm
  } = useFormValidation(initialValues, validationRules);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Handle form submission here
      console.log('Form submitted:', formData);
      alert('Message sent successfully!');
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back navigation */}
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 sm:mb-6 md:mb-8"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs sm:text-sm font-light tracking-wide">Back</span>
            </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with me for any questions or inquiries. I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information Card */}
          <div className="bg-gray-900 rounded-2xl p-8 text-white relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 border-4 border-white rounded-full"></div>
              <div className="absolute right-8 top-1/2 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute right-16 bottom-16 w-8 h-8 border border-white rounded-full"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Contact information</h2>
              <p className="text-gray-300 mb-8">
                If you have any questions, feel free to get in touch with me.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="w-5 h-5 text-gray-300" />
                  <span>+41 79 945 63 06</span>
                </div>

                <div className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-gray-300" />
                  <span>ramon.lorareyes@outlook.com</span>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-5 h-5 mt-0.5">
                    <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div>Sihlmatten 6 <br/> 8134 Adliswil</div>
                    <div className="mt-4 text-sm">
                      <div>Monday-Friday</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>9:00 Uhr - 18:00 Uhr </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <SocialMedia isMobile={false} />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm">
            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="First name"
                  error={errors.firstName}
                  touched={touched.firstName}
                  required
                >
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="First name"
                    icon={User}
                    error={errors.firstName}
                    touched={touched.firstName}
                    required
                  />
                </FormField>

                <FormField
                  label="Last name"
                  error={errors.lastName}
                  touched={touched.lastName}
                  required
                >
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Last name"
                    icon={User}
                    error={errors.lastName}
                    touched={touched.lastName}
                    required
                  />
                </FormField>
              </div>

              {/* Email Field */}
              <FormField
                label="Email"
                error={errors.email}
                touched={touched.email}
                required
              >
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="email@example.com"
                  icon={Mail}
                  error={errors.email}
                  touched={touched.email}
                  required
                  autoComplete="email"
                />
              </FormField>

              {/* Phone Field */}
              <FormField
                label="Phone number"
                error={errors.phoneNumber}
                touched={touched.phoneNumber}
              >
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+41 07* *** ** **"
                  icon={Phone}
                  error={errors.phoneNumber}
                  touched={touched.phoneNumber}
                  autoComplete="tel"
                />
              </FormField>

              {/* Message Field */}
              <FormField
                label="Message"
                error={errors.message}
                touched={touched.message}
                required
              >
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MessageSquare className={`h-5 w-5 ${
                      errors.message && touched.message ? 'text-red-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your message"
                    required
                    className={`
                      w-full pl-10 pr-4 py-3 border rounded-lg transition-colors duration-200 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                      resize-none
                      ${errors.message && touched.message
                        ? 'border-red-300 bg-red-50 text-red-900 placeholder-red-400' 
                        : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 hover:border-gray-400'
                      }
                    `.trim()}
                  />
                </div>
              </FormField>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Send message
                </button>
              </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;