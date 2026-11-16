package top.eridu.openchinesse.config;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.ResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolverChain;

/** Sirve el SPA desde {@code static/} y cae en {@code index.html} para las rutas del cliente. */
@Configuration
public class SpaWebConfig implements WebMvcConfigurer {

  private static final String STATIC_LOCATION = "classpath:/static/";
  private static final String INDEX = "index.html";
  private static final String API_PREFIX = "api/";

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry
        .addResourceHandler("/**")
        .addResourceLocations(STATIC_LOCATION)
        .resourceChain(true)
        .addResolver(new SpaResourceResolver());
  }

  /** Resuelve archivos reales y, para cualquier otra ruta, el index del SPA. */
  static final class SpaResourceResolver implements ResourceResolver {

    @Override
    public Resource resolveResource(
        HttpServletRequest request,
        String requestPath,
        List<? extends Resource> locations,
        ResourceResolverChain chain) {
      if (requestPath.isEmpty()) {
        return findIndex(locations);
      }
      Resource resource = chain.resolveResource(request, requestPath, locations);
      if (resource != null || requestPath.startsWith(API_PREFIX)) {
        return resource;
      }
      return findIndex(locations);
    }

    @Override
    public String resolveUrlPath(
        String resourcePath, List<? extends Resource> locations, ResourceResolverChain chain) {
      return chain.resolveUrlPath(resourcePath, locations);
    }

    private static Resource findIndex(List<? extends Resource> locations) {
      for (Resource location : locations) {
        try {
          Resource index = location.createRelative(INDEX);
          if (index.isReadable()) {
            return index;
          }
        } catch (IOException unusableLocation) {
          // Ubicacion sin rutas relativas: se prueba la siguiente.
        }
      }
      return null;
    }
  }
}
