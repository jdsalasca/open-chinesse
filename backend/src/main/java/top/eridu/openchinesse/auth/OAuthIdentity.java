package top.eridu.openchinesse.auth;

/** Datos de identidad que un proveedor OAuth2 entrega al iniciar sesion. */
public record OAuthIdentity(
    String provider, String subject, String email, String displayName, String pictureUrl) {}
