package top.eridu.openchinesse.web;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** Entrega el index del SPA en la raiz del sitio. */
@RestController
public class SpaIndexController {

  private static final Resource INDEX = new ClassPathResource("static/index.html");

  /** Devuelve el HTML del SPA, o 404 si el build no se copio a {@code static/}. */
  @GetMapping("/")
  public ResponseEntity<Resource> index() {
    if (!INDEX.exists()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "SPA build missing");
    }
    return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(INDEX);
  }
}
