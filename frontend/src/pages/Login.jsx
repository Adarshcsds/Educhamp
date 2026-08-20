import LoginForm from '../components/LoginForm.jsx';

function Login({ navigate }) {
  return (
    <main className="login-page">
      <section className="login-layout" aria-label="EduChamp login">
        <div className="brand-panel">
          <h1>EduChamp</h1>
        </div>

        <LoginForm navigate={navigate} />
      </section>

      <div className="admin-section" aria-label="Admin login section">
        <a
          href="/admin/login"
          onClick={(event) => {
            event.preventDefault();
            navigate('/admin/login');
          }}
        >
          Admin Login
        </a>
      </div>
    </main>
  );
}

export default Login;
