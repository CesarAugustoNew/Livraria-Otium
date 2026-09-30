import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/layout.css';
import './styles/banner.css';
import './styles/books.css';
import './styles/filters.css';
import './styles/cart.css';
<<<<<<< HEAD
import './styles/book-detail.css';
=======
>>>>>>> eef4721feea8c8fd2831a9eb36cc6284c65b2096
import './styles/auth.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
