import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import { AuthProvider } from './components/authContext.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import ProjectRoutes from './Routes.jsx';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Router>
      <ProjectRoutes/>
    </Router>
  </AuthProvider>
)
