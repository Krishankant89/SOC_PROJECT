-- Run as a PostgreSQL superuser to provision the SOC API database.
CREATE USER soc_user WITH PASSWORD 'soc_password';
CREATE DATABASE soc_db OWNER soc_user;
GRANT ALL PRIVILEGES ON DATABASE soc_db TO soc_user;

\connect soc_db
GRANT ALL ON SCHEMA public TO soc_user;
ALTER SCHEMA public OWNER TO soc_user;
