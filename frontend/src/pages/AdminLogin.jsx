import { useState } from 'react';
import InputField from '../components/InputField.jsx';
import { EmailIcon, EyeIcon, LockIcon } from '../components/AuthIcons.jsx';

const initialForm = {
  email: '',
  password: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AdminLogin({ navigate }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

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

  const handleAdminLogin = async () => {
    // TODO: Add real admin authentication in the backend phase.
    console.info('Frontend admin login validation passed', {
      email: formData.email.trim(),
    });

    await new Promise((resolve) => {
      window.setTimeout(resolve, 500);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await handleAdminLogin();
    } catch {
      setStatus({
        type: 'error',
        message: 'Something went wrong while checking the form. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page admin-login-page">
      <section className="login-layout" aria-label="EduChamp admin login">
        <div className="brand-panel">
          <h1>EduChamp</h1>
          <p>Admin access will be connected securely in the backend phase.</p>
        </div>

        <div className="login-card admin-card">
          <div className="card-header">
            <span className="app-mark admin-mark" aria-hidden="true">
              AD
            </span>
            <div>
              <p className="card-kicker">Admin area</p>
              <h2>Admin Login</h2>
            </div>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <InputField
              id="adminEmail"
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
              id="adminPassword"
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

            <button type="submit" className="login-button admin-button" disabled={isLoading}>
              {isLoading ? 'Checking...' : 'Login'}
            </button>
          </form>
        </div>

        <div className="auth-switch">
          <p>Return to normal login</p>
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

export default AdminLogin;
