# Open Chinesse v1 — HSK 1 y 2, login y servidor

Objetivo: curso completo HSK 1 (150) + HSK 2 (150), login OAuth2 y despliegue en
`open-chinesse.eridu.top`.

## Alcance

| Pieza      | Entregable                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| Contenido  | 300 palabras, 30 unidades (15 por nivel), pinyin con tonos, significado en español, frase de ejemplo traducida |
| Frontend   | Selector HSK 1 / HSK 2, login, sincronización de progreso                                                      |
| Backend    | Spring Boot 4.1.2 · Java 25 · H2 archivo · Flyway · OAuth2 (Google + GitHub)                                   |
| Despliegue | Docker en `atopnuc@192.168.1.100:~/sitios/open-chinesse`, túnel propio `open-chinesse`                         |

## Decisiones

1. **El backend sirve el SPA** desde `static/`: un proceso, un puerto (8090), un túnel.
2. **Progreso como JSON opaco** (`payload`) con `revision` monotónica. El servidor no
   conoce FSRS; así el modelo del cliente evoluciona sin migraciones.
3. **Conflicto = gana el `updatedAt` más reciente.** Sin merges complejos en v1.
4. **OAuth2 opcional**: sin credenciales la app arranca en modo invitado (progreso
   local). Con credenciales aparecen los botones de Google/GitHub.
5. **CSRF activo** con cookie `XSRF-TOKEN`; la sesión es cookie `JSESSIONID` (30 días).
6. **Túnel dedicado** para no tocar `topnuc`, `hotel.eridu.top` ni `library.eridu.top`.

## Rondas

### R1 — Contenido HSK 1 + 2

- [x] 30 unidades de 10 palabras con ejemplos.
- [x] Cursos separados por nivel en la UI.
- [x] Test: 300 palabras, ids únicos, pinyin con tono válido, 4 opciones por pregunta.

### R2 — Backend

- [x] Spring Boot 4.1.2 / Java 25 con checkstyle + spotless.
- [x] `GET /api/me`, `GET/PUT /api/progress`, `GET /api/auth/providers`, `GET /api/csrf`.
- [x] Flyway V1 (`app_user`, `learner_progress`), H2 archivo persistente.
- [x] Tests de controlador y de arranque con y sin OAuth.

### R3 — Integración

- [x] Vite proxy `/api` a `localhost:8090`.
- [x] `useSession` + UI de login/logout.
- [x] Sync: hidratar al entrar, empujar con debounce, gana el más reciente.
- [x] Build del SPA copiado a `backend/src/main/resources/static`.

### R4 — Despliegue

- [x] `docker compose` en `~/sitios/open-chinesse` con volumen para H2.
- [x] Túnel `open-chinesse` + DNS `open-chinesse.eridu.top`.
- [x] Verificación: 200 en `/`, 401 en `/api/me` sin sesión, health del backend.
- [x] Documentar las variables de OAuth que faltan.

## Criterios de éxito

- `pnpm test` y `mvn verify` verdes.
- 300 palabras visibles y repasables; una unidad se completa y persiste.
- El sitio responde por HTTPS con el túnel nuevo.
- Sin credenciales OAuth la app es usable; con ellas, el login aparece sin cambios de código.
