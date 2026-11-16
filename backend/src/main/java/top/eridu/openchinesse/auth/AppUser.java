package top.eridu.openchinesse.auth;

/** Usuario registrado en {@code app_user}. */
public record AppUser(String id, String displayName, String email, String pictureUrl) {}
