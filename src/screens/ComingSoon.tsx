import { navigate } from '../lib/router';

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <section className="soon">
      <p className="eyebrow">Próximamente</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <p className="soon__note">Preferimos decírtelo a enseñarte una pantalla vacía.</p>
      <button type="button" onClick={() => navigate('/')}>
        Volver al inicio
      </button>
    </section>
  );
}
