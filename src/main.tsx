import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './context/AppContext';
import { App } from './App';
import './styles/tokens.css';
import './styles/global.css';
import './styles/utilities.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
