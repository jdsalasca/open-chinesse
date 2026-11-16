package top.eridu.openchinesse.web;

import top.eridu.openchinesse.auth.AppUser;

/** Perfil publico del usuario autenticado. */
public record MeResponse(String id, String displayName, String email, String pictureUrl) {

  /** Adapta el usuario almacenado a la respuesta de {@code /api/me}. */
  public static MeResponse from(AppUser user) {
    return new MeResponse(user.id(), user.displayName(), user.email(), user.pictureUrl());
  }
}
