package top.eridu.openchinesse.auth;

import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/** Alta y verificacion de cuentas locales con BCrypt. */
@Service
public class PasswordAuthService {

  private static final Pattern EMAIL = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[a-z]{2,}$");
  private static final int MIN_PASSWORD = 8;

  private final LocalAccountRepository accounts;
  private final PasswordEncoder encoder = new BCryptPasswordEncoder();

  /** Crea el servicio con el repositorio de cuentas. */
  public PasswordAuthService(LocalAccountRepository accounts) {
    this.accounts = accounts;
  }

  /** Valida el formato de las credenciales; lanza {@link InvalidCredentialsException}. */
  public void validate(Credentials credentials) {
    if (!EMAIL.matcher(normalized(credentials.email())).matches()) {
      throw new InvalidCredentialsException("correo no válido");
    }
    if (credentials.password() == null || credentials.password().length() < MIN_PASSWORD) {
      throw new InvalidCredentialsException("la contraseña necesita 8 caracteres");
    }
  }

  /** Registra la cuenta y devuelve el perfil creado. */
  public AppUser register(Credentials credentials) {
    validate(credentials);
    String email = normalized(credentials.email());
    String name =
        credentials.displayName() == null || credentials.displayName().isBlank()
            ? email.split("@")[0]
            : credentials.displayName().trim();
    return accounts.create(email, name, encoder.encode(credentials.password()));
  }

  /** Verifica correo y contrasena; vacio si no coinciden. */
  public Optional<AppUser> authenticate(Credentials credentials) {
    String email = normalized(credentials.email());
    if (credentials.password() == null) {
      return Optional.empty();
    }
    return accounts
        .findAccount(email)
        .filter((account) -> encoder.matches(credentials.password(), account.hash()))
        .flatMap(
            (account) -> {
              accounts.touch(email);
              return accounts.findById(account.id());
            });
  }

  /** Correo ya registrado. */
  public static final class InvalidCredentialsException extends RuntimeException {

    /** Crea la excepcion con el motivo. */
    public InvalidCredentialsException(String message) {
      super(message);
    }
  }

  private static String normalized(String email) {
    return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
  }
}
