package top.eridu.openchinesse.auth;

/** Identificador interno y hash BCrypt de una cuenta local. */
public record LocalAccount(String id, String hash) {}
