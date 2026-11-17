import { Component, type ErrorInfo, type ReactNode } from 'react';
import { navigate } from '../lib/router';

type Props = { children: ReactNode };
type State = { hasError: boolean };

/** Evita que un fallo de una pantalla deje la aplicación en blanco. */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[open-chinesse] pantalla rota', error, info.componentStack);
  }

  private retry = (): void => {
    this.setState({ hasError: false });
    navigate('/');
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    return (
      <section className="empty" role="alert">
        <p className="eyebrow">Algo se rompió</p>
        <h1>Esta pantalla no cargó</h1>
        <p>Tu progreso está guardado. Vuelve al inicio y prueba otra actividad.</p>
        <div className="empty__actions">
          <button type="button" className="button button--primary" onClick={this.retry}>
            Volver al inicio
          </button>
        </div>
      </section>
    );
  }
}
