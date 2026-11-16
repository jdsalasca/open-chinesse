package top.eridu.openchinesse.auth;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

/** Servicio OAuth2 propio: persiste el usuario y usa el id interno como principal. */
@Service
public class OAuthUserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

  /** Clave del atributo donde viaja el id interno de {@code app_user}. */
  public static final String USER_ID_ATTRIBUTE = "open_chinesse_user_id";

  private final OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate =
      new DefaultOAuth2UserService();
  private final AppUserRepository users;

  /** Crea el servicio con el repositorio de usuarios. */
  public OAuthUserService(AppUserRepository users) {
    this.users = users;
  }

  @Override
  public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
    OAuth2User providerUser = delegate.loadUser(request);
    String provider = request.getClientRegistration().getRegistrationId();
    AppUser stored = users.saveOrUpdate(identity(provider, providerUser));
    Map<String, Object> attributes = new LinkedHashMap<>(providerUser.getAttributes());
    attributes.put(USER_ID_ATTRIBUTE, stored.id());
    // El nombre del principal es el id interno, asi la API resuelve el usuario sin otra consulta.
    return new DefaultOAuth2User(providerUser.getAuthorities(), attributes, USER_ID_ATTRIBUTE);
  }

  private static OAuthIdentity identity(String provider, OAuth2User user) {
    Map<String, Object> attributes = user.getAttributes();
    return new OAuthIdentity(
        provider,
        user.getName(),
        firstText(attributes, "email"),
        firstText(attributes, "name", "login"),
        firstText(attributes, "picture", "avatar_url"));
  }

  private static String firstText(Map<String, Object> attributes, String... keys) {
    for (String key : keys) {
      if (attributes.get(key) instanceof String value && !value.isBlank()) {
        return value;
      }
    }
    return null;
  }
}
