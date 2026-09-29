import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useShop } from '../../contexts/ShopContext';
import { useAsync } from '../../hooks/useAsync';
import { categoryService } from '../../services/categoryService';
import { FREE_SHIPPING_THRESHOLD, formatPrice } from '../../utils/format';
import { BagIcon, CloseIcon, MenuIcon, StarIcon, UserIcon } from '../ui/Icons';
import { SearchBar } from './SearchBar';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, favoriteIds } = useShop();
  const { user, logout } = useAuth();
  const { data: categories } = useAsync((signal) => categoryService.list(signal), []);
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  // fecha o menu ao navegar
  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);

  const nav = (
    <>
      <NavLink to="/livros" end>Todos os livros</NavLink>
      {categories?.map((c) => (
        <NavLink key={c.id} to={`/livros?categoria=${c.id}`}>{c.name}</NavLink>
      ))}
    </>
  );

  return (
    <header className="header">
      <div className="topbar">
        <div className="container">
          <span><strong>Frete grátis</strong> em compras acima de {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
        </div>
      </div>

      <div className="container header__main">
        <button
          type="button"
          className="icon-btn header__menu-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link to="/" className="logo" aria-label="Otium, página inicial">
          <span className="logo__name">Otium</span>
          <span className="logo__tag">livraria</span>
        </Link>

        <div className="header__search"><SearchBar /></div>

        <div className="header__actions">
          {user ? (
            <button type="button" className="header__action header__action--login" onClick={handleLogout}>
              <UserIcon />
              <span className="header__action-label">Sair ({user.name.split(' ')[0]})</span>
            </button>
          ) : (
            <Link to="/entrar" className="header__action header__action--login">
              <UserIcon />
              <span className="header__action-label">Entrar</span>
            </Link>
          )}
          <Link to="/favoritos" className="header__action header__action--favorites" aria-label={`Favoritos (${favoriteIds.size})`}>
            <StarIcon />
          </Link>
          <Link to="/carrinho" className="header__action" aria-label={`Carrinho (${cartCount} itens)`}>
            <BagIcon />
            {cartCount > 0 && <span className="cart-badge" aria-hidden="true">{cartCount}</span>}
          </Link>
        </div>
      </div>

      <nav className="nav nav--desktop container" aria-label="Categorias">{nav}</nav>

      {menuOpen && (
        <nav id="mobile-menu" className="nav nav--mobile" aria-label="Menu principal">
          {nav}
          {user ? (
            <button type="button" onClick={handleLogout}>Sair ({user.name.split(' ')[0]})</button>
          ) : (
            <NavLink to="/entrar">Entrar</NavLink>
          )}
          <NavLink to="/favoritos">Favoritos</NavLink>
        </nav>
      )}
    </header>
  );
}
