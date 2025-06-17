import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
);
