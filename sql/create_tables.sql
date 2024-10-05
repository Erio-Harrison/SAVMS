-- users 
create table if not exists user (
    id bigint(20) not null auto_increment primary key,
    registration_number varchar(20) default null,
    registration_date date default null,
    battery_level float default 0.0,
    current_location varchar(255) default null,
    status int default 0,
    vehicle_damage varchar(255) default null, -- null means no damage
    last_update date not null,
    model varchar(255) default null,
    manufacturer varchar(255) default null,
    key idx_number (registration_number)
);

-- chargers
create table if not exists charger (
    id bigint(20) not null auto_increment primary key,
    station_id bigint(20) not null,
    name varchar(50) default null,
    location varchar(255) default null,
    type int default 0,
    max_power float default 0.0,
    connector_type int default 0 -- e.g., Type1, CCS, CHAdeMO
);

-- accounts
create table if not exists account (
    id bigint(20) not null auto_increment primary key,
    password varchar(50) not null,
    account varchar(100),
    role int default 0
)