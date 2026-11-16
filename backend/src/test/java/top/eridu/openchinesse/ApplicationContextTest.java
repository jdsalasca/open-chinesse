package top.eridu.openchinesse;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import top.eridu.openchinesse.auth.OAuthProvider;

/** El contexto debe cargar sin credenciales OAuth2 (modo invitado). */
@SpringBootTest(
    properties = {
      "GOOGLE_CLIENT_ID=",
      "GOOGLE_CLIENT_SECRET=",
      "GITHUB_CLIENT_ID=",
      "GITHUB_CLIENT_SECRET="
    })
class ApplicationContextTest {

  @Autowired private ApplicationContext context;

  @Test
  void loadsWithoutOAuthCredentials() {
    ClientRegistrationRepository registrations =
        context.getBean(ClientRegistrationRepository.class);
    assertThat(context.getBean(OpenChinesseApplication.class)).isNotNull();
    assertThat(OAuthProvider.enabledIn(registrations)).isEmpty();
  }
}
