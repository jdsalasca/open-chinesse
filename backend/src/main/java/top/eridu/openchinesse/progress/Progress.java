package top.eridu.openchinesse.progress;

import java.time.Instant;

/** Progreso guardado de un usuario: JSON opaco y revision monotona. */
public record Progress(long revision, Instant updatedAt, String payload) {}
