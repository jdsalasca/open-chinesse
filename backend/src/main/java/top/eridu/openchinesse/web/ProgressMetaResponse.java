package top.eridu.openchinesse.web;

import java.time.Instant;
import top.eridu.openchinesse.progress.Progress;

/** Metadatos que devuelve {@code PUT /api/progress}. */
public record ProgressMetaResponse(long revision, Instant updatedAt) {

  /** Adapta el progreso guardado a la respuesta del guardado. */
  public static ProgressMetaResponse from(Progress progress) {
    return new ProgressMetaResponse(progress.revision(), progress.updatedAt());
  }
}
