package top.eridu.openchinesse;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/** Registro e inicio de sesion con correo y contrasena. */
@SpringBootTest
@AutoConfigureMockMvc
class LocalAuthTest {

  @Autowired private MockMvc mockMvc;

  private static String body(String email, String password, String name) {
    return "{\"email\":\""
        + email
        + "\",\"password\":\""
        + password
        + "\",\"displayName\":\""
        + name
        + "\"}";
  }

  private static String email() {
    return "test-" + UUID.randomUUID() + "@example.com";
  }

  @Test
  void registersAndLogsInWithTheSamePassword() throws Exception {
    String email = email();
    mockMvc
        .perform(
            post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body(email, "secreto123", "Ana")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value(email))
        .andExpect(jsonPath("$.displayName").value("Ana"));

    mockMvc
        .perform(
            post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body(email, "secreto123", "")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value(email));
  }

  @Test
  void rejectsDuplicateEmail() throws Exception {
    String email = email();
    mockMvc.perform(
        post("/api/auth/register")
            .with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(body(email, "secreto123", "Ana")));
    mockMvc
        .perform(
            post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body(email, "secreto123", "Otra")))
        .andExpect(status().isConflict());
  }

  @Test
  void rejectsShortPasswordAndBadEmail() throws Exception {
    mockMvc
        .perform(
            post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body(email(), "corta", "Ana")))
        .andExpect(status().isBadRequest());
    mockMvc
        .perform(
            post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body("sin-arroba", "secreto123", "Ana")))
        .andExpect(status().isBadRequest());
  }

  @Test
  void rejectsWrongPassword() throws Exception {
    String email = email();
    mockMvc.perform(
        post("/api/auth/register")
            .with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(body(email, "secreto123", "Ana")));
    mockMvc
        .perform(
            post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body(email, "otra-clave-1", "")))
        .andExpect(status().isUnauthorized());
  }
}
