import { useState } from 'react';
import InputField from '../components/InputField.jsx';
import UserTypeTabs from '../components/UserTypeTabs.jsx';
import { EmailIcon, EyeIcon, LockIcon, UserIcon } from '../components/AuthIcons.jsx';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register({ navigate }) {
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleRoleChange = (nextRole) => {
    setSelectedRole(nextRole);
    setStatus(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!fullName) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!email) {
      nextErrors.email = 'Email is required.';
    } else if (!emailPattern.test(email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!phone) {
      nextErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(phone)) {
      nextErrors.phone = 'Phone number must contain 10 digits.';
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Confirm password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async () => {
    const response = await fetch(
      'http://127.0.0.1:8000/api/auth/register/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          role: selectedRole,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail ||
          data.message ||
          Object.values(data).flat().join(' ') ||
          'Registration failed.',
      );
    }

    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await handleRegister();

      setStatus({
        type: 'success',
        message: data.message || 'Registration successful.',
      });

      setFormData(initialForm);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page register-page">
      <section className="login-layout" aria-label="EduChamp registration">
        <div className="brand-panel">
          <h1>EduChamp</h1>
          <p>Create a learning account for the right user role.</p>
        </div>

        <div className="login-card register-card">
          <div className="card-header">
            <span className="app-mark" aria-hidden="true">
              EC
            </span>
            <div>
              <p className="card-kicker">Join EduChamp</p>
              <h2>Register</h2>
            </div>
          </div>

          <UserTypeTabs
            activeType={selectedRole}
            onChange={handleRoleChange}
            label="Select registration type"
          />

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <InputField
              id="fullName"
              name="fullName"
              label="Full Name"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              icon={<UserIcon />}
              error={errors.fullName}
              autoComplete="name"
            />

            <InputField
              id="registerEmail"
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              icon={<EmailIcon />}
              error={errors.email}
              autoComplete="email"
            />

            <InputField
              id="registerPhone"
              name="phone"
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              icon={<UserIcon />}
              error={errors.phone}
              autoComplete="tel"
            />

            <InputField
              id="registerPassword"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
              icon={<LockIcon />}
              error={errors.password}
              autoComplete="new-password"
              action={
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => {
                    setShowPassword((currentValue) => !currentValue);
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon hidden={showPassword} />
                </button>
              }
            />

            <InputField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-enter your password"
              icon={<LockIcon />}
              error={errors.confirmPassword}
              autoComplete="new-password"
              action={
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => {
                    setShowConfirmPassword((currentValue) => !currentValue);
                  }}
                  aria-label={
                    showConfirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  <EyeIcon hidden={showConfirmPassword} />
                </button>
              }
            />

            {status && (
              <p className={`form-status ${status.type}`} role="status">
                {status.message}
              </p>
            )}

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>

        <div className="auth-switch">
          <p>Already have an account?</p>
          <a
            href="/login"
            onClick={(event) => {
              event.preventDefault();
              navigate('/login');
            }}
          >
            Login
          </a>
        </div>
      </section>
    </main>
  );
}

export default Register;