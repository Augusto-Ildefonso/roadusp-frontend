import './App.css';
import GraphPage from './pages/GraphPage';
import HomePage from './pages/HomePage';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path='/graph' element={<GraphPage/>}/>
        </Routes>
      </Router>
      <Analytics />
    </div>
  );
}

export default App;
