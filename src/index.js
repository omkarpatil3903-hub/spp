import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Add React Router

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/:mobileNumber" element={<App />} />
        <Route path="/" element={
          <div style={{ padding: '40px', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Welcome to Business Website Builder</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>To view a business website, add a mobile number to the URL:</p>
            <p style={{ fontSize: '1rem', color: '#666' }}>Example: <a href="/9370329233" style={{ color: '#4F46E5', textDecoration: 'underline' }}>http://localhost:3000/9370329233</a></p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();