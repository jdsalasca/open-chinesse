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

/** Acceso a {@code app_user}: alta, actualizacion en cada login y consulta. */
@Repository
public class AppUserRepository {

  private static final String SELECT_USER =
      "select id, display_name, email, picture_url from app_user";
  private static final String UPDATE_USER =
      "update app_user set email = ?, display_name = ?, picture_url = ?, last_login_at = ?"
          + " where provider = ? and subject = ?";

  private final JdbcTemplate jdbc;

  /** Crea el repositorio sobre el {@code JdbcTemplate} de la aplicacion. */
  public AppUserRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  /** Crea el usuario si no existe y refresca sus datos de perfil y ultimo login. */
  public AppUser saveOrUpdate(OAuthIdentity identity) {
    Instant now = Instant.now();
    if (touch(identity, now) == 0) {
      insert(identity, now);
    }
    return findByIdentity(identity).orElseThrow();
  }

  /** Busca el usuario por su id interno. */
  public Optional<AppUser> findById(String id) {
    return jdbc.query(SELECT_USER + " where id = ?", AppUserRepository::mapUser, id).stream()
        .findFirst();
  }

  private Optional<AppUser> findByIdentity(OAuthIdentity identity) {
    return jdbc
        .query(
            SELECT_USER + " where provider = ? and subject = ?",
            AppUserRepository::mapUser,
            identity.provider(),
            identity.subject())
        .stream()
        .findFirst();
  }

  private int touch(OAuthIdentity identity, Instant now) {
    return jdbc.update(
        UPDATE_USER,
        identity.email(),
        identity.displayName(),
        identity.pictureUrl(),
        Timestamp.from(now),
        identity.provider(),
        identity.subject());
  }

  private void insert(OAuthIdentity identity, Instant now) {
    Timestamp stamp = Timestamp.from(now);
    try {
      jdbc.update(
          "insert into app_user"
              + " (id, provider, subject, email, display_name, picture_url, created_at,"
              + " last_login_at) values (?, ?, ?, ?, ?, ?, ?, ?)",
          UUID.randomUUID().toString(),
          identity.provider(),
          identity.subject(),
          identity.email(),
          identity.displayName(),
          identity.pictureUrl(),
          stamp,
          stamp);
    } catch (DuplicateKeyException concurrentLogin) {
      touch(identity, now);
    }
  }

  private static AppUser mapUser(ResultSet rows, int rowNumber) throws SQLException {
    return new AppUser(
        rows.getString("id"),
        rows.getString("display_name"),
        rows.getString("email"),
        rows.getString("picture_url"));
  }
}
