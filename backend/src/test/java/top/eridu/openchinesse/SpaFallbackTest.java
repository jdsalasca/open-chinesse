package top.eridu.openchinesse;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/** Las rutas del cliente devuelven el index del SPA. */
@SpringBootTest
@AutoConfigureMockMvc
class SpaFallbackTest {

  @Autowired private MockMvc mockMvc;

  @Test
  void servesIndexAtRoot() throws Exception {
    mockMvc
        .perform(get("/"))
        .andExpect(status().isOk())
        .andExpect(content().string(containsString("id=\"spa-root\"")));
  }

  @Test
  void servesIndexForClientRoutes() throws Exception {
    mockMvc
        .perform(get("/review"))
        .andExpect(status().isOk())
        .andExpect(content().string(containsString("id=\"spa-root\"")));
  }

  @Test
  @WithMockUser
  void doesNotServeSpaForUnknownApiRoutes() throws Exception {
    mockMvc.perform(get("/api/desconocido")).andExpect(status().isNotFound());
  }
}
