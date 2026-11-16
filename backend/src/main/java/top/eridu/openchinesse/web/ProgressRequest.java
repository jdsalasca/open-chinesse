package top.eridu.openchinesse.web;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

/** Cuerpo de {@code PUT /api/progress}: JSON serializado y fecha del cliente. */
public record ProgressRequest(@NotBlank String payload, @NotNull Instant updatedAt) {}
