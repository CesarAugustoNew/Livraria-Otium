import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/layout.css';
import './styles/banner.css';
import './styles/books.css';
import './styles/filters.css';
import './styles/cart.css';
import './styles/book-detail.css';
import './styles/auth.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
