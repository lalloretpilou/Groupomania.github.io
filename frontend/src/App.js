import React from 'react';
import logo from './Assets/icon-left-font.png';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';

// Fichier principal. Il permet de relier les routes (pages) du site.
// J'ai créer un header et footer dans ce fichier afin qu'il soit présent sur toutes les pages sans devoir les réecrire.

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="Groupomanie"/>
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
