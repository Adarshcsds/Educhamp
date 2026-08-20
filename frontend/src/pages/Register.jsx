import { useState } from 'react';
import InputField from '../components/InputField.jsx';
import UserTypeTabs from '../components/UserTypeTabs.jsx';
import { EmailIcon, EyeIcon, LockIcon, UserIcon } from '../components/AuthIcons.jsx';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register({ navigate }) {
  // Admin registration is intentionally excluded from the normal user flow.
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

    if (!fullName) {
      nextErrors.fullName = 'Full name is required.';
    }

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

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Confirm password is required.';
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async () => {
    // TODO: Connect registration to the backend when authentication is implemented.
    console.info('Frontend registration validation passed', {
      selectedRole,
      fullName: formData.fullName.trim(),
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
      await handleRegister();
      setStatus({
        type: 'success',
        message: 'Registration details look valid. Backend signup will be added later.',
      });
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
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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
              {isLoading ? 'Checking...' : 'Register'}
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
