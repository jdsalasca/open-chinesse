package top.eridu.openchinesse.auth;

import java.util.Arrays;
import java.util.List;
import org.springframework.security.config.oauth2.client.CommonOAuth2Provider;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;

/** Proveedores OAuth2 soportados y sus credenciales de entorno. */
public enum OAuthProvider {
  /** Google mediante OpenID Connect. */
  GOOGLE("google", "openid,profile,email", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"),
  /** GitHub mediante su API OAuth2. */
  GITHUB("github", "read:user,user:email", "GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET");

  private final String registrationId;
  private final String scopes;
  private final String clientIdVariable;
  private final String clientSecretVariable;

  OAuthProvider(
      String registrationId, String scopes, String clientIdVariable, String clientSecretVariable) {
    this.registrationId = registrationId;
    this.scopes = scopes;
    this.clientIdVariable = clientIdVariable;
    this.clientSecretVariable = clientSecretVariable;
  }

  /** Id usado en las rutas de login y en {@code /api/auth/providers}. */
  public String registrationId() {
    return registrationId;
  }

  /** Variable de entorno con el client id. */
  public String clientIdVariable() {
    return clientIdVariable;
  }

  /** Variable de entorno con el client secret. */
  public String clientSecretVariable() {
    return clientSecretVariable;
  }

  /** Construye el registro del proveedor con los scopes y endpoints oficiales. */
  public ClientRegistration registration(String clientId, String clientSecret, String baseUrl) {
    CommonOAuth2Provider defaults =
        switch (this) {
          case GOOGLE -> CommonOAuth2Provider.GOOGLE;
          case GITHUB -> CommonOAuth2Provider.GITHUB;
        };
    return defaults
        .getBuilder(registrationId)
        .clientId(clientId)
        .clientSecret(clientSecret)
        .scope(scopes.split(","))
        .redirectUri(baseUrl + "/login/oauth2/code/" + registrationId)
        .build();
  }

  /** Ids de los proveedores que tienen credenciales configuradas. */
  public static List<String> enabledIn(ClientRegistrationRepository repository) {
    return Arrays.stream(values())
        .filter(provider -> repository.findByRegistrationId(provider.registrationId) != null)
        .map(OAuthProvider::registrationId)
        .toList();
  }
}
