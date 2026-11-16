package top.eridu.openchinesse.auth;

/** Credenciales de una cuenta local. */
public record Credentials(String email, String password, String displayName) {}
