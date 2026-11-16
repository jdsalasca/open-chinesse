package top.eridu.openchinesse.auth;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/** Cuentas locales: alta, credenciales y perfil. */
@Repository
public class LocalAccountRepository {

  private final JdbcTemplate jdbc;

  /** Crea el repositorio sobre el {@code JdbcTemplate} de la aplicacion. */
  public LocalAccountRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  /** Devuelve el id y el hash BCrypt del correo, si la cuenta existe. */
  public Optional<LocalAccount> findAccount(String email) {
    return jdbc
        .query(
            "select id, password_hash from app_user where provider = 'local' and subject = ?",
            (rows, index) -> new LocalAccount(rows.getString(1), rows.getString(2)),
            email)
        .stream()
        .findFirst();
  }

  /** Crea una cuenta local y devuelve su perfil. */
  public AppUser create(String email, String displayName, String hash) {
    Instant now = Instant.now();
    String id = UUID.randomUUID().toString();
    try {
      jdbc.update(
          "insert into app_user (id, provider, subject, email, display_name, picture_url,"
              + " created_at, last_login_at, password_hash)"
              + " values (?, 'local', ?, ?, ?, null, ?, ?, ?)",
          id,
          email,
          email,
          displayName,
          Timestamp.from(now),
          Timestamp.from(now),
          hash);
    } catch (DuplicateKeyException duplicate) {
      throw new EmailTakenException(email);
    }
    return new AppUser(id, displayName, email, null);
  }

  /** Busca el perfil por id interno. */
  public Optional<AppUser> findById(String id) {
    return jdbc
        .query(
            "select id, display_name, email, picture_url from app_user where id = ?",
            LocalAccountRepository::mapUser,
            id)
        .stream()
        .findFirst();
  }

  /** Marca el ultimo acceso de la cuenta. */
  public void touch(String email) {
    jdbc.update(
        "update app_user set last_login_at = ? where provider = 'local' and subject = ?",
        Timestamp.from(Instant.now()),
        email);
  }

  private static AppUser mapUser(ResultSet rows, int rowNumber) throws SQLException {
    return new AppUser(
        rows.getString("id"),
        rows.getString("display_name"),
        rows.getString("email"),
        rows.getString("picture_url"));
  }

  /** El correo ya tiene cuenta local. */
  public static final class EmailTakenException extends RuntimeException {

    /** Crea la excepcion con el correo duplicado. */
    public EmailTakenException(String email) {
      super("email taken: " + email);
    }
  }
}
