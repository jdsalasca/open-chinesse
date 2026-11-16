-- Cuentas locales con correo y contrasena (BCrypt), ademas de OAuth2.
alter table app_user add column password_hash varchar(100);

create index idx_app_user_email on app_user (email);
