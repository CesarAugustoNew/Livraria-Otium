import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, FacebookIcon, GoogleIcon } from '../components/ui/Icons';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ApiError } from '../services/api';

export function Login() {
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      notify('Bem-vindo(a) de volta!');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível entrar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container section auth">
      <form className="auth-card" onSubmit={submit} noValidate>
        <h1 className="auth-card__title">Entrar com e-mail e senha</h1>

        {error && (
          <p className="auth-card__error" role="alert">
            {error}
          </p>
        )}

        <label className="field">
          <span className="sr-only">E-mail</span>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="Ex.: exemplo@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="field field--password">
          <span className="sr-only">Senha</span>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            placeholder="Adicione sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="field__toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOffIcon width={20} height={20} /> : <EyeIcon width={20} height={20} />}
          </button>
        </label>

        <Link to="/" className="auth-card__forgot">
          Esqueci minha senha
        </Link>

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>

        <p className="auth-card__register">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>

        <div className="auth-card__divider">
          <span>ou</span>
        </div>

        <button
          type="button"
          className="btn btn--outline btn--block"
          onClick={() => notify('Login por código em breve.')}
        >
          Receber código de acesso por e-mail
        </button>
        <button
          type="button"
          className="btn btn--social btn--block"
          onClick={() => notify('Login com Google em breve.')}
        >
          <GoogleIcon width={20} height={20} /> Entrar com Google
        </button>
        <button
          type="button"
          className="btn btn--social btn--block"
          onClick={() => notify('Login com Facebook em breve.')}
        >
          <FacebookIcon width={20} height={20} /> Entrar com Facebook
        </button>
      </form>
    </div>
  );
}
