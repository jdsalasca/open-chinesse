package top.eridu.openchinesse.config;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.util.StringUtils;
import top.eridu.openchinesse.auth.OAuthProvider;

/** Registra en codigo los clientes OAuth2 que tienen credenciales. */
@Configuration
public class OAuthClientConfig {

  /**
   * Construye el repositorio de clientes. Sin credenciales queda vacio y la app arranca en modo
   * invitado.
   */
  @Bean
  public ClientRegistrationRepository clientRegistrationRepository(
      @Value("${open-chinesse.base-url:http://localhost:8090}") String baseUrl,
      Environment environment) {
    Map<String, ClientRegistration> registrations = new LinkedHashMap<>();
    for (OAuthProvider provider : OAuthProvider.values()) {
      String clientId = environment.getProperty(provider.clientIdVariable());
      String clientSecret = environment.getProperty(provider.clientSecretVariable());
      if (StringUtils.hasText(clientId) && StringUtils.hasText(clientSecret)) {
        registrations.put(
            provider.registrationId(), provider.registration(clientId, clientSecret, baseUrl));
      }
    }
    return registrations::get;
  }
}
