import { useState } from 'react'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage/loginPage';

function App() {
  return (
    <div>
      <AuthProvider>
        <Router>
          <div className='App'>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/login' element={<LoginPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App
