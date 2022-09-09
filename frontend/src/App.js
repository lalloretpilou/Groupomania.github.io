import React from 'react';
import logo from './Assets/icon-left-font.png';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';
import { useNavigate } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="Groupomanie" onClick={<HomePage />}/>
        <p className="titlePage">Votre nouvelle plateforme</p>
      </header>
      <div className="App-body">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="*" element={<Navigate to={'/login'} />} />
          </Routes>
        </BrowserRouter>
      </div>
      <footer className='App-footer'>
        <p className="bodyFooter">Groupomania, © 2022 tout droits réservés</p>
      </footer>
    </div>
  );
}

export default App;
