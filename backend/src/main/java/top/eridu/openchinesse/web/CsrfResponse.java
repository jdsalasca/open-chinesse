package top.eridu.openchinesse.web;

/** Token CSRF que el SPA debe reenviar en la cabecera indicada. */
public record CsrfResponse(String token, String headerName) {}
