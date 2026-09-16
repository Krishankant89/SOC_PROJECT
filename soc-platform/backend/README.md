# SOC Platform API

FastAPI backend for the SOC Monitoring & Incident Response Platform.

This phase covers the API foundation only: configuration, PostgreSQL models, and REST endpoints for alerts, incidents, hosts, and audit logs. Wazuh, Suricata, authentication, and automated response are intentionally not included yet.

## Prerequisites

- Python 3.12+
- PostgreSQL 17 (local instance on port `5432`)

## Database

Create a role and database that match `.env`:

```sql
CREATE USER soc_user WITH PASSWORD 'soc_password';
CREATE DATABASE soc_db OWNER soc_user;
GRANT ALL PRIVILEGES ON DATABASE soc_db TO soc_user;
```

On PostgreSQL 15+, also grant schema rights after connecting to `soc_db`:

```sql
GRANT ALL ON SCHEMA public TO soc_user;
ALTER SCHEMA public OWNER TO soc_user;
```

## Setup

```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Copy values in `.env` if your Postgres credentials differ.

Create the database (requires a PostgreSQL superuser):

```powershell
psql -U postgres -h 127.0.0.1 -f init_db.sql
```

Or run the SQL in `init_db.sql` from pgAdmin.

## Run

From the `backend` directory:

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- API docs: http://127.0.0.1:8000/docs
- Health: http://127.0.0.1:8000/health

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | API + database health |
| GET | `/api/alerts` | List alerts |
| POST | `/api/alerts` | Create an alert |
| GET | `/api/alerts/{id}` | Get one alert |
| GET | `/api/incidents` | List incidents |
| POST | `/api/incidents` | Create an incident |
| PATCH | `/api/incidents/{id}` | Update an incident |
| GET | `/api/hosts` | List hosts |
| GET | `/api/audit-logs` | List audit logs |

CORS allows the Vite frontend at `http://localhost:5173`.

## Scope

This backend foundation deliberately does not include Wazuh, Suricata, authentication, automated response, ML, Docker, Redis, Kafka, or Kubernetes. Those integrations can be added in later phases.

## Verification

The API was syntax-checked and all required endpoints were exercised with FastAPI `TestClient` against a temporary SQLite database because the execution environment used for verification did not provide a running PostgreSQL server. The application itself remains configured for PostgreSQL via `DATABASE_URL` and includes the PostgreSQL driver in `requirements.txt`. Before local use, start PostgreSQL and verify `/health` against the configured PostgreSQL database.
