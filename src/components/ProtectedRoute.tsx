import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { APIAuthenticated } from '../http';

// Guards dashboard routes: only an authenticated user with role "admin" may
// pass through. Verifies the token against the backend /profile endpoint
// rather than trusting whatever is cached in localStorage.
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setChecking(false);
      setAllowed(false);
      return;
    }
    APIAuthenticated.get('profile')
      .then((res) => {
        const role = res.data?.data?.role;
        if (role === 'admin') {
          localStorage.setItem('user', JSON.stringify(res.data.data));
          setAllowed(true);
        } else {
          localStorage.clear();
          setAllowed(false);
        }
      })
      .catch(() => {
        localStorage.clear();
        setAllowed(false);
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return null;
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
