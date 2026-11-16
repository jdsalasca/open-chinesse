package top.eridu.openchinesse;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

/** Sin credenciales la lista de proveedores queda vacia. */
@SpringBootTest(
    properties = {
      "GOOGLE_CLIENT_ID=",
      "GOOGLE_CLIENT_SECRET=",
      "GITHUB_CLIENT_ID=",
      "GITHUB_CLIENT_SECRET="
    })
@AutoConfigureMockMvc
class ProvidersTest {

  @Autowired private MockMvc mockMvc;

  @Test
  void returnsNoProvidersWithoutCredentials() throws Exception {
    mockMvc
        .perform(get("/api/auth/providers"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.providers").isArray())
        .andExpect(jsonPath("$.providers").isEmpty());
  }
}
