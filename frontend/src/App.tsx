import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import UrlForm from './components/UrlForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    navigate('/');
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container">
      <header>
        <h1>URL Shortener</h1>
        <nav>
          <Link to="/">Shorten URL</Link>
          {}
          {!token && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          <Link to="/dashboard">Dashboard</Link>
          {token && <button onClick={handleLogout}>Logout</button>}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<UrlForm token={token} />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterForm onRegister={handleLogin} />} />
          <Route
            path="/dashboard"
            element={token ? <Dashboard token={token} /> : <p>Please log in to view your URLs.</p>}
          />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
