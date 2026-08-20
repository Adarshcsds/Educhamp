import { useState } from 'react';
import InputField from './InputField.jsx';
import UserTypeTabs from './UserTypeTabs.jsx';
import { EmailIcon, EyeIcon, LockIcon } from './AuthIcons.jsx';

// Empty form values used when the page first loads or tabs change.
const initialForm = {
  email: '',
  password: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginForm({ navigate }) {
  // Keep the selected role in state so the same login form
  // can be used for students, teachers and parents.
  const [selectedRole, setSelectedRole] = useState('student');

  // This stores whatever the user types in the two input boxes.
  const [formData, setFormData] = useState(initialForm);

  // This stores validation messages for each input.
  const [errors, setErrors] = useState({});

  // This decides if the password should show as text or dots.
  const [showPassword, setShowPassword] = useState(false);

  // This is used to disable the login button while login is preparing.
  const [isLoading, setIsLoading] = useState(false);

  // This can show a message below the inputs.
  const [status, setStatus] = useState(null);

  const handleTabChange = (nextType) => {
    // When user changes tab, clear old form data and old errors.
    setSelectedRole(nextType);
    setFormData(initialForm);
    setErrors({});
    setStatus(null);
    setShowPassword(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Update only the input that the user is typing in.
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    // Remove the error for this field after the user starts fixing it.
    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    // This object collects errors before showing them on the page.
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

    // If there are no keys in the error object, the form is valid.
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    // Authentication is intentionally not implemented in this phase.
    // TODO: Connect this form to the real authentication API later.
    console.info('Frontend login validation passed', {
      selectedRole,
      email: formData.email.trim(),
    });

    // Small delay so the loading state is visible during the UI demo.
    await new Promise((resolve) => {
      window.setTimeout(resolve, 500);
    });
  };

  const handleSubmit = async (event) => {
    // Stop the page from refreshing when the form is submitted.
    event.preventDefault();
    setStatus(null);

    // Do not continue if required fields are empty.
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Only validate the form in Phase 1. Real login comes later.
      await handleLogin();
    } catch {
      setStatus({
        type: 'error',
        message: 'Something went wrong while checking the form. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (event) => {
    event.preventDefault();

    // TODO: Add OTP/password recovery in the future authentication phase.
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
          {isLoading ? 'Checking...' : 'Login'}
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
