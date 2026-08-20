import { useState } from 'react';
import InputField from './InputField.jsx';
import UserTypeTabs from './UserTypeTabs.jsx';
import { EmailIcon, EyeIcon, LockIcon } from './AuthIcons.jsx';

const initialForm = {
  email: '',
  password: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginForm({ navigate }) {
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleTabChange = (nextType) => {
    setSelectedRole(nextType);
    setFormData(initialForm);
    setErrors({});
    setStatus(null);
    setShowPassword(false);
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
    const email = formData.email.trim();

    if (!email) {
      nextErrors.email = 'Email is required.';
    } else if (!emailPattern.test(email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    const response = await fetch(
      'http://127.0.0.1:8000/api/auth/login/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      },
    );

    const data = await response.json();
    console.log('LOGIN RESPONSE:', data);

    if (!response.ok) {
      throw new Error(
        data.detail ||
          data.message ||
          Object.values(data).flat().join(' ') ||
          'Invalid email or password.',
      );
    }

    if (data.user.role !== selectedRole) {
      throw new Error(
        `This account is registered as ${data.user.role}, not ${selectedRole}.`,
      );
    }

    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));

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
      const data = await handleLogin();

      setStatus({
        type: 'success',
        message: `Welcome, ${data.user.name || data.user.email}!`,
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (event) => {
    event.preventDefault();

    setStatus({
      type: 'info',
      message: 'Forgot password will be added in the next authentication phase.',
    });
  };

  return (
    <div className="login-card">
      <UserTypeTabs activeType={selectedRole} onChange={handleTabChange} />

      <div className="card-header">
        <span className="app-mark" aria-hidden="true">
          EC
        </span>
        <div>
          <h2>Login</h2>
        </div>
      </div>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <InputField
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          icon={<EmailIcon />}
          error={errors.email}
          autoComplete="username"
        />

        <InputField
          id="password"
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          icon={<LockIcon />}
          error={errors.password}
          autoComplete="current-password"
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

        {status && (
          <p className={`form-status ${status.type}`} role="status">
            {status.message}
          </p>
        )}

        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="form-links">
        <a href="#forgot-password" onClick={handleForgotPassword}>
          Forgot Password?
        </a>
        <a
          href="/register"
          onClick={(event) => {
            event.preventDefault();
            navigate('/register');
          }}
        >
          Register
        </a>
      </div>
    </div>
  );
}

export default LoginForm;