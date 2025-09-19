import './App.css';
import GraphPage from './pages/GraphPage';
import HomePage from './pages/HomePage';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path='/graph' element={<GraphPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
