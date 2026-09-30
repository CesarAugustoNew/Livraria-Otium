import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { PaymentIcons } from '../ui/PaymentIcons';

export function Footer() {
  const { notify } = useToast();
  const [email, setEmail] = useState('');

  function subscribe(e: FormEvent) {
    e.preventDefault();
    // TODO: POST /api/newsletter quando existir
    notify('Obrigado! Em breve você recebe nossas novidades.');
    setEmail('');
  }

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <p className="logo__name">Otium</p>
          <p className="footer__muted">Tempo para ler.</p>
        </div>
        <nav aria-label="Institucional">
          <h2 className="footer__title">Institucional</h2>
          <ul>
            <li><Link to="/">Quem somos</Link></li>
            <li><Link to="/">Política de privacidade</Link></li>
            <li><Link to="/">Troca e devolução</Link></li>
          </ul>
        </nav>
        <nav aria-label="Minha conta">
          <h2 className="footer__title">Minha conta</h2>
          <ul>
            <li><Link to="/entrar">Entrar</Link></li>
            <li><Link to="/favoritos">Favoritos</Link></li>
            <li><Link to="/carrinho">Carrinho</Link></li>
          </ul>
        </nav>
        <form onSubmit={subscribe} className="footer__newsletter">
          <label htmlFor="newsletter" className="footer__title">Newsletter</label>
          <p className="footer__muted">Receba nossas promoções.</p>
          <div className="newsletter-field">
            <input
              id="newsletter"
              type="email"
              required
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn btn--primary">Assinar</button>
          </div>
        </form>
      </div>

      <div className="container footer__payment">
        <h2 className="footer__title">Formas de pagamento</h2>
        <PaymentIcons />
      </div>

      <div className="footer__bottom container">© {new Date().getFullYear()} Livraria Otium. Todos os direitos reservados.</div>
    </footer>
  );
}
