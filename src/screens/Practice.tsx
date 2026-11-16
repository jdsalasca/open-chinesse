export function Practice() {
  return (
    <section className="practice">
      <h1>Practicar</h1>
      <p className="practice__lead">Tres formas de entrenar lo que ya viste.</p>
      <a className="practice__card" href="#/review">
        <h2>Repaso espaciado</h2>
        <p>Las tarjetas que tocan hoy, con notas de 1 a 4.</p>
        <span className="practice__cta">Empezar →</span>
      </a>
      <a className="practice__card" href="#/">
        <h2>Escucha</h2>
        <p>Dentro de cada unidad, la práctica te hace reconocer la palabra solo de oído.</p>
        <span className="practice__cta">Ver unidades →</span>
      </a>
      <a className="practice__card" href="#/review">
        <h2>Tonos</h2>
        <p>En el repaso escribes el pinyin sin tonos; la app comprueba las sílabas.</p>
        <span className="practice__cta">Cómo funciona →</span>
      </a>
    </section>
  );
}
