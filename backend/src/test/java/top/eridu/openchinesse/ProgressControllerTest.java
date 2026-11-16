package top.eridu.openchinesse;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

/** Contrato de {@code GET} y {@code PUT /api/progress}. */
@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "user")
class ProgressControllerTest {

  private static final ObjectMapper JSON = new ObjectMapper();
  private static final String PAYLOAD = "{\"unidades\":[]}";

  @Autowired private MockMvc mockMvc;
  @Autowired private JdbcTemplate jdbc;

  @BeforeEach
  void seedUser() {
    TestUsers.seed(jdbc, "user");
  }

  @Test
  void returnsNotFoundWhenThereIsNoProgress() throws Exception {
    mockMvc.perform(get("/api/progress")).andExpect(status().isNotFound());
  }

  @Test
  void createsProgressWithRevisionOneAndThenIncrements() throws Exception {
    mockMvc
        .perform(putProgress(PAYLOAD))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.revision").value(1))
        .andExpect(jsonPath("$.updatedAt").exists());
    mockMvc
        .perform(putProgress(PAYLOAD))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.revision").value(2));
    mockMvc
        .perform(get("/api/progress"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.revision").value(2))
        .andExpect(jsonPath("$.payload").value(PAYLOAD));
  }

  @Test
  void rejectsPayloadThatIsNotAJsonObject() throws Exception {
    mockMvc.perform(putProgress("[1,2,3]")).andExpect(status().isBadRequest());
    mockMvc.perform(putProgress("no es json")).andExpect(status().isBadRequest());
  }

  @Test
  void rejectsPayloadLargerThanTwoMegabytes() throws Exception {
    String huge = "{\"datos\":\"" + "a".repeat(2 * 1024 * 1024) + "\"}";
    mockMvc.perform(putProgress(huge)).andExpect(status().is(413));
  }

  private static MockHttpServletRequestBuilder putProgress(String payload) {
    ObjectNode body = JSON.createObjectNode();
    body.put("payload", payload);
    body.put("updatedAt", "2026-11-15T10:00:00Z");
    return put("/api/progress")
        .with(csrf())
        .contentType(MediaType.APPLICATION_JSON)
        .content(body.toString());
  }
}
