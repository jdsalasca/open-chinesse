import { useState, type FormEvent } from 'react';
import { ApiError, login, register, PROVIDER_LABELS, loginUrl } from '../lib/api';
import { navigate } from '../lib/router';
import { useSession } from '../store/session';
import '../styles/main.scss';

type Mode = 'login' | 'register';
type Providers = ReturnType<typeof useSession.getState>['providers'];

type AuthFormState = {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
};

function useAuthSubmit(mode: Mode, form: AuthFormState) {
  const setUser = useSession((s) => s.setUser);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const user =
        mode === 'login'
          ? await login(form.email, form.password)
          : await register(form.email, form.password, form.name);
      setUser(user);
      navigate('/');
    } catch (problem) {
      setError(problem instanceof ApiError ? problem.message : 'No se pudo conectar');
    } finally {
      setBusy(false);
    }
  };

  return { error, busy, submit, reset: () => setError(null) };
}

function AuthIntro({ mode }: { mode: Mode }) {
  const entering = mode === 'login';
  return (
    <>
      <p className="eyebrow">{entering ? 'Entrar' : 'Crear cuenta'}</p>
      <h1 className="auth__title">{entering ? 'Hola otra vez' : 'Empieza tu curso'}</h1>
      <p className="auth__lead">
        {entering
          ? 'Tu progreso se sincroniza entre dispositivos.'
          : 'Sin tarjetas ni suscripciones: solo tu correo.'}
      </p>
    </>
  );
}

function NameField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>Nombre</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="name"
        maxLength={60}
      />
    </label>
  );
}

function EmailField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>Correo</span>
      <input
        type="email"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="email"
        required
      />
    </label>
  );
}

function PasswordField({
  mode,
  value,
  onChange,
}: {
  mode: Mode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>Contraseña</span>
      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        minLength={8}
        required
      />
    </label>
  );
}

function AuthForm({
  mode,
  form,
  error,
  busy,
  onSubmit,
}: {
  mode: Mode;
  form: AuthFormState;
  error: string | null;
  busy: boolean;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <form className="auth__form" onSubmit={onSubmit}>
      {mode === 'register' && <NameField value={form.name} onChange={form.setName} />}
      <EmailField value={form.email} onChange={form.setEmail} />
      <PasswordField mode={mode} value={form.password} onChange={form.setPassword} />
      {error && (
        <p className="auth__error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="button button--primary is-block" disabled={busy}>
        {busy ? 'Un momento…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
      </button>
    </form>
  );
}

function ModeSwitch({ mode, onSwitch }: { mode: Mode; onSwitch: () => void }) {
  return (
    <button type="button" className="link auth__switch" onClick={onSwitch}>
      {mode === 'login' ? 'No tengo cuenta' : 'Ya tengo cuenta'}
    </button>
  );
}

function Providers({ providers }: { providers: Providers }) {
  if (providers.length === 0) return null;
  return (
    <div className="auth__providers">
      <span className="auth__divider">o entra con</span>
      {providers.map((provider) => (
        <a key={provider} className="button button--ghost" href={loginUrl(provider)}>
          {PROVIDER_LABELS[provider] ?? provider}
        </a>
      ))}
    </div>
  );
}

export function Login() {
  const providers = useSession((s) => s.providers);
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const form = { name, setName, email, setEmail, password, setPassword };
  const auth = useAuthSubmit(mode, form);

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    auth.reset();
  };

  return (
    <section className="auth">
      <div className="auth__card">
        <AuthIntro mode={mode} />
        <AuthForm
          mode={mode}
          form={form}
          error={auth.error}
          busy={auth.busy}
          onSubmit={auth.submit}
        />
        <ModeSwitch mode={mode} onSwitch={switchMode} />
        <Providers providers={providers} />
        <button type="button" className="link auth__skip" onClick={() => navigate('/')}>
          Seguir sin cuenta
        </button>
      </div>
    </section>
  );
}
