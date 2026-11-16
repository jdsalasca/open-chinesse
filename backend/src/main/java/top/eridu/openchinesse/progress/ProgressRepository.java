package top.eridu.openchinesse.progress;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/** Acceso a {@code learner_progress} con incremento atomico de la revision. */
@Repository
public class ProgressRepository {

  private static final String SELECT_PROGRESS =
      "select revision, updated_at, payload from learner_progress where user_id = ?";
  private static final String UPDATE_PROGRESS =
      "update learner_progress set payload = ?, revision = revision + 1, updated_at = ?"
          + " where user_id = ?";
  private static final String INSERT_PROGRESS =
      "insert into learner_progress (user_id, payload, revision, updated_at) values (?, ?, 1, ?)";

  private final JdbcTemplate jdbc;

  /** Crea el repositorio sobre el {@code JdbcTemplate} de la aplicacion. */
  public ProgressRepository(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  /** Devuelve el progreso guardado o vacio si el usuario aun no sincronizo nunca. */
  public Optional<Progress> find(String userId) {
    return jdbc.query(SELECT_PROGRESS, ProgressRepository::mapProgress, userId).stream()
        .findFirst();
  }

  /** Guarda el payload y sube la revision: 1 en el primer guardado y +1 despues. */
  @Transactional
  public Progress save(String userId, String payload, Instant updatedAt) {
    Timestamp stamp = Timestamp.from(updatedAt);
    if (update(userId, payload, stamp) == 0) {
      insert(userId, payload, stamp);
    }
    return find(userId).orElseThrow();
  }

  private int update(String userId, String payload, Timestamp stamp) {
    return jdbc.update(UPDATE_PROGRESS, payload, stamp, userId);
  }

  private void insert(String userId, String payload, Timestamp stamp) {
    try {
      jdbc.update(INSERT_PROGRESS, userId, payload, stamp);
    } catch (DuplicateKeyException concurrentSync) {
      // Otra peticion creo la fila primero: se actualiza y la revision sigue subiendo.
      update(userId, payload, stamp);
    }
  }

  private static Progress mapProgress(ResultSet rows, int rowNumber) throws SQLException {
    return new Progress(
        rows.getLong("revision"),
        rows.getTimestamp("updated_at").toInstant(),
        rows.getString("payload"));
  }
}
