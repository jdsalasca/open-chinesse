package top.eridu.openchinesse;

import java.sql.Timestamp;
import java.time.Instant;
import org.springframework.jdbc.core.JdbcTemplate;

/** Datos de usuario compartidos por los tests de controlador. */
final class TestUsers {

  private TestUsers() {}

  /** Crea (o reemplaza) el usuario con el id que usan los tests como principal. */
  static void seed(JdbcTemplate jdbc, String id) {
    Timestamp now = Timestamp.from(Instant.parse("2026-11-15T00:00:00Z"));
    jdbc.update("delete from learner_progress where user_id = ?", id);
    jdbc.update("delete from app_user where id = ?", id);
    jdbc.update(
        "insert into app_user (id, provider, subject, email, display_name, picture_url,"
            + " created_at, last_login_at) values (?, 'test', ?, ?, ?, ?, ?, ?)",
        id,
        id,
        id + "@example.com",
        "Usuario " + id,
        null,
        now,
        now);
  }
}
