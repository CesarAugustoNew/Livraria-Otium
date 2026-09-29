import { Link, Outlet } from 'react-router-dom';
import { LockIcon } from '../ui/Icons';

/** Layout enxuto para carrinho e checkout: sem busca/menu, para reduzir distração até a compra. */
export function CheckoutLayout() {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Ir para o conteúdo
      </a>
      <header className="checkout-header">
        <div className="container checkout-header__row">
          <Link to="/" className="logo" aria-label="Otium, página inicial">
            <span className="logo__name">Otium</span>
            <span className="logo__tag">livraria</span>
          </Link>
          <span className="checkout-header__secure">
            <LockIcon width={18} height={18} /> Compra 100% segura
          </span>
        </div>
      </header>
      <main id="conteudo">
        <Outlet />
      </main>
      <footer className="checkout-footer">
        <div className="container">© {new Date().getFullYear()} Livraria Otium. Todos os direitos reservados.</div>
      </footer>
    </>
  );
}
