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
      <a className="practice__card" href="#/prueba">
        <h2>Prueba de retención</h2>
        <p>
          Diez palabras sin pistas, siete días después. Mide lo que recuerdas, no lo que repites.
        </p>
        <span className="practice__cta">Ver la prueba →</span>
      </a>
      <a className="practice__card" href="#/tonos">
        <h2>Tonos</h2>
        <p>Escucha la palabra y elige el pinyin con sus tonos. Diez por tanda.</p>
        <span className="practice__cta">Entrenar el oído →</span>
      </a>
    </section>
  );
}
