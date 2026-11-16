package top.eridu.openchinesse;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.ObjectMapper;

/** El PUT exige el token CSRF entregado por {@code /api/csrf}. */
@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "user")
class CsrfTest {

  private static final ObjectMapper JSON = new ObjectMapper();

  @Autowired private MockMvc mockMvc;
  @Autowired private JdbcTemplate jdbc;

  @BeforeEach
  void seedUser() {
    TestUsers.seed(jdbc, "user");
  }

  @Test
  void rejectsPutWithoutToken() throws Exception {
    mockMvc
        .perform(put("/api/progress").contentType(MediaType.APPLICATION_JSON).content(body()))
        .andExpect(status().isForbidden());
  }

  @Test
  void acceptsPutWithTokenFromCsrfEndpoint() throws Exception {
    MvcResult handshake =
        mockMvc
            .perform(get("/api/csrf"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.headerName").value("X-XSRF-TOKEN"))
            .andReturn();
    Cookie cookie = handshake.getResponse().getCookie("XSRF-TOKEN");
    String token =
        JSON.readTree(handshake.getResponse().getContentAsString()).get("token").asText();
    mockMvc
        .perform(
            put("/api/progress")
                .cookie(cookie)
                .header("X-XSRF-TOKEN", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.revision").value(1));
  }

  private static String body() {
    return "{\"payload\":\"{\\\"unidades\\\":[]}\",\"updatedAt\":\"2026-11-15T10:00:00Z\"}";
  }
}
