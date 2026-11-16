package top.eridu.openchinesse.web;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import top.eridu.openchinesse.auth.AppUserRepository;
import top.eridu.openchinesse.auth.OAuthProvider;

/** Endpoints publicos de autenticacion y perfil del usuario. */
@RestController
public class AuthController {

  private final ClientRegistrationRepository registrations;
  private final AppUserRepository users;

  /** Crea el controlador con el catalogo de proveedores y los usuarios. */
  public AuthController(ClientRegistrationRepository registrations, AppUserRepository users) {
    this.registrations = registrations;
    this.users = users;
  }

  /** Lista los proveedores OAuth2 con credenciales; vacia en modo invitado. */
  @GetMapping("/api/auth/providers")
  public ProvidersResponse providers() {
    return new ProvidersResponse(OAuthProvider.enabledIn(registrations));
  }

  /** Entrega el token CSRF y el nombre de la cabecera donde enviarlo. */
  @GetMapping("/api/csrf")
  public CsrfResponse csrf(CsrfToken token) {
    return new CsrfResponse(token.getToken(), token.getHeaderName());
  }

  /** Devuelve el perfil del usuario en sesion; 401 si no hay usuario asociado. */
  @GetMapping("/api/me")
  public MeResponse me(Authentication authentication) {
    return users
        .findById(authentication.getName())
        .map(MeResponse::from)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
  }
}
