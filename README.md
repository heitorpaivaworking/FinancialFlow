# FinanceFlow

A complete personal finance management system with an interactive dashboard, income and expense tracking, investments, emergency fund, and MEI (micro-entrepreneur) management.

## Stack

- **Backend:** Python 3.11 + FastAPI + SQLAlchemy 2.0 + Alembic
- **Database:** PostgreSQL 16 (via Docker)
- **Frontend:** React 18 + Vite + TailwindCSS v3 + Recharts
- **Infra:** Docker + Docker Compose + Nginx

## Quick Start

### With Docker (recommended)

```bash
# Production
make prod
# Access: http://localhost (frontend) | http://localhost/api/docs (Swagger)

# Development (hot reload)
make dev
# Access: http://localhost:5173 (frontend) | http://localhost:9000/api/docs (Swagger)
```

### Without Docker

```bash
# Linux/Mac
./start.sh

# Windows
start.bat
```

### Prerequisites

- Docker Desktop (Docker mode) or:
  - Python 3.11+
  - Node.js 20+
  - PostgreSQL 16

## Useful Commands

```bash
make help          # List all commands
make dev           # Development with hot reload
make prod          # Production
make down          # Stop containers
make logs          # Real-time logs
make seed          # Reload sample data
make test          # Run backend tests
make db-shell      # PostgreSQL shell
make backup        # Database backup
make reset         # Reset everything with fresh data
```

## Modules

| Module | Description |
|--------|-------------|
| Dashboard | KPIs, trend charts, spending distribution, net worth |
| Income | Income tracking with sources and types |
| Expenses | Expense tracking by category and subcategory |
| Fixed Bills | Recurring bill management with payment status |
| Investments | Portfolio with profit and return calculations |
| Emergency Fund | Emergency fund with visual progress tracking |
| MEI | Revenue tracking with tax calculations and annual limit |

## API

Interactive docs: `http://localhost:9000/api/docs`

Base URL: `/api/v1`

Main endpoints:
- `/receitas` — Income CRUD + summaries
- `/despesas` — Expenses CRUD + category summaries
- `/contas-fixas` — Fixed bills CRUD + payment toggle + month replication
- `/investimentos` — Investments CRUD + type summary
- `/reserva` — Deposits + goal + status
- `/mei` — MEI CRUD + monthly/annual summary
- `/dashboard` — KPIs, trends, net worth, financial health

## Commit Convention

```
feat(income): add summary by source endpoint
fix(mei): fix tax calculation
chore(docker): update compose configuration
```

## License

Personal project. Free to use.
