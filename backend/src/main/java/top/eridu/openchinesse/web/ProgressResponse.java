package top.eridu.openchinesse.web;

import java.time.Instant;
import top.eridu.openchinesse.progress.Progress;

/** Progreso completo de {@code GET /api/progress}. */
public record ProgressResponse(long revision, Instant updatedAt, String payload) {

  /** Adapta el progreso almacenado a la respuesta HTTP. */
  public static ProgressResponse from(Progress progress) {
    return new ProgressResponse(progress.revision(), progress.updatedAt(), progress.payload());
  }
}
