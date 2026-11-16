# Backend — contrato de implementación

Lee primero `docs/plan-v2.md` y `C:\Users\jdsal\Documents\Programming-personal\teachers\Java-teacher\AGENTS.md`.

## Stack

- **Java 25 LTS** (Temurin ya instalado), **Maven 3.9**, **Spring Boot 4.1.2**.
- Paquete raíz `top.eridu.openchinesse`. Artefacto `open-chinesse`. Jar ejecutable.
- Dependencias: `web`, `security`, `oauth2-client`, `jdbc`, `validation`, `actuator`,
  `flyway-core`, `h2`, y test (`spring-boot-starter-test`, `spring-security-test`).
- Puerto **8090**. Perfil por defecto listo para producción.

## Persistencia

H2 en archivo: `jdbc:h2:file:${OPEN_CHINESSE_DB:./data/open-chinesse};DB_CLOSE_DELAY=-1`.

Flyway `V1__init.sql`:

```sql
create table app_user (
  id varchar(36) primary key,
  provider varchar(32) not null,
  subject varchar(191) not null,
  email varchar(320),
  display_name varchar(200),
  picture_url varchar(1000),
  created_at timestamp not null,
  last_login_at timestamp not null,
  constraint uq_app_user_provider_subject unique (provider, subject)
);

create table learner_progress (
  user_id varchar(36) primary key,
  payload clob not null,
  revision bigint not null,
  updated_at timestamp not null,
  constraint fk_progress_user foreign key (user_id) references app_user (id)
);
```

## API (JSON, misma origen que el SPA)

| Método | Ruta                  | Respuesta                                                                       |
| ------ | --------------------- | ------------------------------------------------------------------------------- |
| GET    | `/api/auth/providers` | `{ "providers": ["google","github"] }` (público)                                |
| GET    | `/api/csrf`           | `{ "token": "...", "headerName": "X-XSRF-TOKEN" }`                              |
| GET    | `/api/me`             | `200 { id, displayName, email, pictureUrl }` · `401` sin sesión                 |
| GET    | `/api/progress`       | `200 { revision, updatedAt, payload }` · `404` si no existe                     |
| PUT    | `/api/progress`       | body `{ payload: string, updatedAt: ISO-8601 }` → `200 { revision, updatedAt }` |

Reglas:

- `payload`: JSON serializado, máximo **2 MB**, debe ser un objeto JSON; si no, `400`.
  Si excede el tamaño, `413`.
- `revision` empieza en 1 y sube +1 en cada `PUT`, atómico (`update ... set revision = revision + 1`
  o bloqueo de fila). No se acepta `revision` del cliente.
- `updatedAt` se guarda como `timestamp` UTC.
- Todo `/api/**` exige autenticación salvo `providers`, `csrf` y `actuator/health`.
- Sesión: cookie `JSESSIONID`, `SameSite=Lax`, 30 días, sin JWT.
- CSRF: `CookieCsrfTokenRepository.withHttpOnlyFalse()`, header `X-XSRF-TOKEN`.
  `PUT /api/**` sin token → `403`.
- `favicon.ico`, `/assets/**` y las rutas del SPA son públicas; cualquier ruta que no
  empiece por `/api` ni `/oauth2` ni `/login` devuelve `index.html`.

## OAuth2

- Registros `google` y `github` construidos **en código** desde variables de entorno:
  `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`.
- Google: scope `openid,profile,email`, redirect `{baseUrl}/login/oauth2/code/google`.
- GitHub: scope `read:user,user:email`.
- Si ninguna credencial está presente, **la app arranca igual**: no se registran
  clientes, `/api/auth/providers` devuelve `[]` y `/api/me` responde `401`.
- `OAuth2UserService` propio: crea o actualiza `app_user` con `(provider, subject)`.
- Tras el login, redirigir a `/`.
- Logout por `POST /logout`, redirige a `/` y borra la sesión.

## Calidad (obligatorio)

- Checkstyle 10.26 con las reglas de `teachers/Java-teacher/config/checkstyle/checkstyle.xml`
  copiadas a `backend/config/checkstyle/checkstyle.xml` (o equivalentes: línea ≤100,
  ≤4 parámetros, ≤40 líneas por método, complejidad ≤8, `DeclarationOrder`, Javadoc en
  tipos y métodos públicos, sin imports estrella ni sin usar).
- Spotless con `google-java-format` (AOSP no: Google, 100 columnas).
- `mvn -q verify` debe pasar: compila, checkstyle, spotless:check y tests.

## Tests exigidos

1. `ApplicationContextTest`: el contexto carga sin variables de OAuth.
2. `ProvidersTest`: `/api/auth/providers` → `{"providers":[]}` sin credenciales.
3. `ProgressControllerTest` (con `@WithMockUser`):
   - `GET` sin fila → 404.
   - `PUT` crea → revision 1; segundo `PUT` → revision 2.
   - payload que no es objeto JSON → 400.
   - payload > 2 MB → 413.
4. `CsrfTest`: `PUT` sin token → 403; con token → 200.
5. `SpaFallbackTest`: `GET /` y `GET /review` devuelven 200 con el HTML del SPA
   (usa un `src/test/resources/static/index.html` de prueba si el build real no está).

## Entrega

Todo en `C:\Users\jdsal\Documents\Programming-personal\HelloChinesse-web\backend`.
No toques `src/` del frontend ni hagas commits. Deja el árbol listo para `mvn verify`.
