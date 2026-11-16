package top.eridu.openchinesse;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.test.web.servlet.MockMvc;

/** Con credenciales en el entorno se registran Google y GitHub. */
@SpringBootTest(
    properties = {
      "GOOGLE_CLIENT_ID=google-id",
      "GOOGLE_CLIENT_SECRET=google-secret",
      "GITHUB_CLIENT_ID=github-id",
      "GITHUB_CLIENT_SECRET=github-secret",
      "open-chinesse.base-url=https://open-chinesse.example"
    })
@AutoConfigureMockMvc
class OAuthProvidersTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ClientRegistrationRepository registrations;

  @Test
  void exposesConfiguredProviders() throws Exception {
    mockMvc
        .perform(get("/api/auth/providers"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.providers[0]").value("google"))
        .andExpect(jsonPath("$.providers[1]").value("github"));
  }

  @Test
  void buildsRegistrationsFromEnvironment() {
    ClientRegistration google = registrations.findByRegistrationId("google");
    assertThat(google.getScopes()).contains("openid", "profile", "email");
    assertThat(google.getRedirectUri())
        .isEqualTo("https://open-chinesse.example/login/oauth2/code/google");
    ClientRegistration github = registrations.findByRegistrationId("github");
    assertThat(github.getScopes()).contains("read:user", "user:email");
  }
}
