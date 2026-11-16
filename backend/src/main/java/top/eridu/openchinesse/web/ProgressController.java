package top.eridu.openchinesse.web;

import jakarta.validation.Valid;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import top.eridu.openchinesse.progress.Progress;
import top.eridu.openchinesse.progress.ProgressRepository;

/** Sincronizacion del progreso opaco del SPA. */
@RestController
public class ProgressController {

  private static final int MAX_PAYLOAD_BYTES = 2 * 1024 * 1024;

  private final ProgressRepository progress;
  private final ObjectMapper json;

  /** Crea el controlador con el repositorio de progreso y el lector de JSON. */
  public ProgressController(ProgressRepository progress, ObjectMapper json) {
    this.progress = progress;
    this.json = json;
  }

  /** Devuelve el progreso guardado o 404 si el usuario nunca sincronizo. */
  @GetMapping("/api/progress")
  public ProgressResponse get(Authentication authentication) {
    return progress
        .find(authentication.getName())
        .map(ProgressResponse::from)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  /** Guarda el progreso y devuelve la revision asignada por el servidor. */
  @PutMapping("/api/progress")
  public ProgressMetaResponse put(
      Authentication authentication, @Valid @RequestBody ProgressRequest request) {
    requireJsonObject(request.payload());
    Progress saved =
        progress.save(authentication.getName(), request.payload(), request.updatedAt());
    return ProgressMetaResponse.from(saved);
  }

  private void requireJsonObject(String payload) {
    if (payload.getBytes(StandardCharsets.UTF_8).length > MAX_PAYLOAD_BYTES) {
      throw new ResponseStatusException(HttpStatus.CONTENT_TOO_LARGE);
    }
    if (!isJsonObject(payload)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "payload must be a JSON object");
    }
  }

  private boolean isJsonObject(String payload) {
    try {
      JsonNode node = json.readTree(payload);
      return node != null && node.isObject();
    } catch (JacksonException malformed) {
      return false;
    }
  }
}
