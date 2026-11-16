create table app_user (
  id varchar(36) primary key,
  provider varchar(32) not null,
  subject varchar(191) not null,
  email varchar(320),
  display_name varchar(200),
  picture_url varchar(1000),
  created_at timestamp not null,
  last_login_at timestamp not null,
  constraint uq_app_user_provider_subject unique (provider, subject)
);

create table learner_progress (
  user_id varchar(36) primary key,
  payload clob not null,
  revision bigint not null,
  updated_at timestamp not null,
  constraint fk_progress_user foreign key (user_id) references app_user (id)
);
