import { useState } from 'react';
import { ApiError, login, register, PROVIDER_LABELS, loginUrl } from '../lib/api';
import { navigate } from '../lib/router';
import { useSession } from '../store/session';
import '../styles/main.scss';

type Mode = 'login' | 'register';

export function Login() {
  const providers = useSession((s) => s.providers);
  const setUser = useSession((s) => s.setUser);
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const user =
        mode === 'login' ? await login(email, password) : await register(email, password, name);
      setUser(user);
      navigate('/');
    } catch (problem) {
      setError(problem instanceof ApiError ? problem.message : 'No se pudo conectar');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth">
      <div className="auth__card">
        <p className="eyebrow">{mode === 'login' ? 'Entrar' : 'Crear cuenta'}</p>
        <h1 className="auth__title">{mode === 'login' ? 'Hola otra vez' : 'Empieza tu curso'}</h1>
        <p className="auth__lead">
          {mode === 'login'
            ? 'Tu progreso se sincroniza entre dispositivos.'
            : 'Sin tarjetas ni suscripciones: solo tu correo.'}
        </p>

        <form className="auth__form" onSubmit={submit}>
          {mode === 'register' && (
            <label className="field">
              <span>Nombre</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                maxLength={60}
              />
            </label>
          )}
          <label className="field">
            <span>Correo</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="field">
            <span>Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={8}
              required
            />
          </label>

          {error && (
            <p className="auth__error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="button button--primary is-block" disabled={busy}>
            {busy ? 'Un momento…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <button
          type="button"
          className="link auth__switch"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError(null);
          }}
        >
          {mode === 'login' ? 'No tengo cuenta' : 'Ya tengo cuenta'}
        </button>

        {providers.length > 0 && (
          <div className="auth__providers">
            <span className="auth__divider">o entra con</span>
            {providers.map((provider) => (
              <a key={provider} className="button button--ghost" href={loginUrl(provider)}>
                {PROVIDER_LABELS[provider] ?? provider}
              </a>
            ))}
          </div>
        )}

        <button type="button" className="link auth__skip" onClick={() => navigate('/')}>
          Seguir sin cuenta
        </button>
      </div>
    </section>
  );
}
