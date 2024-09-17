import './index.css';  // or wherever your main CSS file is located

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SuperheroDashboard from './Pages/SuperheroDashboard'
import AdminLogin from './Pages/AdminLogin';



function App() {

  return (
    <>
      <Router>

        <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<SuperheroDashboard/>} />

        </Routes>

      </Router>
    </>
  )
}

export default App
