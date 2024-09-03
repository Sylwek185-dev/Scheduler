import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';


// import { StrictMode } from 'react';  // Dodaj ten import

createRoot(document.getElementById('root')).render(
	// <StrictMode>
	<App />
	// </StrictMode>
);
