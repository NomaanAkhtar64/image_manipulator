import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './tailwind.css';
import './reset.css';
import './main.css';
import { BrowserRouter } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

export const CLIENT_ID = uuid();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

