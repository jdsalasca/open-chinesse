package top.eridu.openchinesse.web;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.eridu.openchinesse.auth.AppUser;
import top.eridu.openchinesse.auth.Credentials;
import top.eridu.openchinesse.auth.LocalAccountRepository;
import top.eridu.openchinesse.auth.PasswordAuthService;

/** Registro e inicio de sesion con correo y contrasena. */
@RestController
@RequestMapping("/api/auth")
public class LocalAuthController {

  private final PasswordAuthService auth;

  /** Crea el controlador con el servicio de credenciales. */
  public LocalAuthController(PasswordAuthService auth) {
    this.auth = auth;
  }

  /** Crea la cuenta e inicia sesion. */
  @PostMapping("/register")
  public ResponseEntity<?> register(
      @RequestBody Credentials body, HttpServletRequest request, HttpServletResponse response) {
    try {
      AppUser user = auth.register(body);
      bindSession(user, request, response);
      return ResponseEntity.ok(MeResponse.from(user));
    } catch (LocalAccountRepository.EmailTakenException taken) {
      return error(HttpStatus.CONFLICT, "Ese correo ya tiene cuenta");
    } catch (PasswordAuthService.InvalidCredentialsException invalid) {
      return error(HttpStatus.BAD_REQUEST, invalid.getMessage());
    }
  }

  /** Verifica credenciales e inicia sesion. */
  @PostMapping("/login")
  public ResponseEntity<?> login(
      @RequestBody Credentials body, HttpServletRequest request, HttpServletResponse response) {
    return auth.authenticate(body)
        .<ResponseEntity<?>>map(
            (user) -> {
              bindSession(user, request, response);
              return ResponseEntity.ok(MeResponse.from(user));
            })
        .orElseGet(() -> error(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos"));
  }

  private static ResponseEntity<?> error(HttpStatus status, String message) {
    return ResponseEntity.status(status).body(Map.of("error", message));
  }

  private static void bindSession(
      AppUser user, HttpServletRequest request, HttpServletResponse response) {
    var authentication =
        UsernamePasswordAuthenticationToken.authenticated(
            user.id(), null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
    SecurityContext context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(authentication);
    SecurityContextHolder.setContext(context);
    new HttpSessionSecurityContextRepository().saveContext(context, request, response);
    request.getSession(true);
  }
}
