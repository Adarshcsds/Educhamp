import { useEffect, useState } from 'react';
import AdminLogin from './pages/AdminLogin.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

const routes = {
  '/login': Login,
  '/register': Register,
  '/admin/login': AdminLogin,
};

function getCurrentRoute() {
  if (window.location.pathname === '/') {
    return '/login';
  }

  return routes[window.location.pathname] ? window.location.pathname : '/login';
}

function App() {
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute);
  const Page = routes[currentRoute];

  const navigate = (nextRoute) => {
    window.history.pushState({}, '', nextRoute);
    setCurrentRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (window.location.pathname === '/') {
      window.history.replaceState({}, '', '/login');
    }

    const handlePopState = () => {
      setCurrentRoute(getCurrentRoute());
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return <Page navigate={navigate} />;
}

export default App;
