# Despliegue — 2026-11-16

Sitio: **https://open-chinesse.eridu.top**

## Infraestructura

| Pieza         | Valor                                                                   |
| ------------- | ----------------------------------------------------------------------- |
| Servidor      | `atopnuc@192.168.1.100` · `/home/atopnuc/sitios/open-chinesse`          |
| Proceso       | Docker `open-chinesse` (Temurin 25 JRE, `-Xms192m -Xmx448m`)            |
| Puerto local  | `127.0.0.1:8091` (el 8090 lo ocupa `oh-server.py`)                      |
| Túnel         | `open-chinesse` · `f909162f-f8d2-4e39-ba9c-05118b14b354`                |
| Servicio      | `cloudflared-open-chinesse.service` (systemd, propio; no toca `topnuc`) |
| Base de datos | H2 archivo en `~/sitios/open-chinesse/data`                             |

El túnel y el servicio son nuevos y aislados: `hotel.eridu.top` y `library.eridu.top`
siguen servidos por `topnuc`, que no se modificó.

## Verificación pública

```text
/                     200
/review               200
/api/auth/providers   200  {"providers":[]}
/api/me               401
/actuator/health      200  {"status":"UP"}
PUT /api/progress     403  (sin token CSRF)
```

Navegador real (Playwright, 1280×1000):

- `0 / 301` palabras, 2 pestañas (HSK 1 · HSK 2), 15 unidades por nivel.
- Lección `h1-01` carga con `你好`.
- Único mensaje de consola: el 401 esperado de `/api/me` cuando no hay sesión.

## OAuth2

La app está en **modo invitado**: el backend no tiene credenciales, así que
`/api/auth/providers` devuelve `[]` y no aparece el botón de entrar. Para activarlo:

1. Crear credenciales en Google y/o GitHub con el redirect
   `https://open-chinesse.eridu.top/login/oauth2/code/{google|github}`.
2. Rellenar `~/sitios/open-chinesse/.env`.
3. `sudo docker compose up -d --force-recreate`.

Verificado en local con credenciales falsas: `/api/auth/providers` →
`{"providers":["google"]}` y `/oauth2/authorization/google` → 302 a
`accounts.google.com` con `redirect_uri=https://open-chinesse.eridu.top/login/oauth2/code/google`.

## Repetir el despliegue

```bash
./deploy.sh
```

Compila el SPA dentro del jar, empaqueta con Maven, copia por `scp` y recrea el
contenedor. Requiere `sudo` para Docker (el usuario `atopnuc` no está en el grupo).
