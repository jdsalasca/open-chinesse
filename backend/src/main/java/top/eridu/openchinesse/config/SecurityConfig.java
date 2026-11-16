package top.eridu.openchinesse.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import top.eridu.openchinesse.auth.OAuthProvider;
import top.eridu.openchinesse.auth.OAuthUserService;

/** Seguridad: sesion por cookie, CSRF por cabecera y OAuth2 opcional. */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

  private static final String SESSION_COOKIE = "JSESSIONID";

  /** Cadena unica: API autenticada, SPA publica y login OAuth2 solo si hay credenciales. */
  @Bean
  public SecurityFilterChain securityFilterChain(
      HttpSecurity http, ClientRegistrationRepository registrations, OAuthUserService oauthUsers)
      throws Exception {
    http.authorizeHttpRequests(
            auth ->
                auth.requestMatchers("/api/auth/providers", "/api/csrf", "/actuator/health")
                    .permitAll()
                    .requestMatchers("/api/**")
                    .authenticated()
                    .anyRequest()
                    .permitAll())
        .csrf(
            csrf ->
                csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                    .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
        .exceptionHandling(
            handling ->
                handling.authenticationEntryPoint(
                    new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
        .logout(
            logout ->
                logout
                    .logoutUrl("/logout")
                    .logoutSuccessUrl("/")
                    .invalidateHttpSession(true)
                    .deleteCookies(SESSION_COOKIE));
    if (!OAuthProvider.enabledIn(registrations).isEmpty()) {
      http.oauth2Login(
          login ->
              login
                  .defaultSuccessUrl("/", true)
                  .userInfoEndpoint(endpoint -> endpoint.userService(oauthUsers)));
    }
    return http.build();
  }
}
