import './App.css';
import GraphPage from './pages/GraphPage';
import HomePage from './pages/HomePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path='/graph' element={<GraphPage/>}/>
            <Route path='/redefinir-senha' element={<ResetPasswordPage/>}/>
          </Routes>
        </AuthProvider>
      </Router>
      <Analytics />
    </div>
  );
}

export default App;
