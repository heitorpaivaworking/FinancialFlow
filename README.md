# FinanceFlow

Sistema completo de controle financeiro pessoal com dashboard interativo, controle de receitas, despesas, investimentos, reserva de emergência e gestão MEI.

## Stack

- **Backend:** Python 3.11 + FastAPI + SQLAlchemy 2.0 + Alembic
- **Banco:** PostgreSQL 16 (via Docker)
- **Frontend:** React 18 + Vite + TailwindCSS v3 + Recharts
- **Infra:** Docker + Docker Compose + Nginx

## Início Rápido

### Com Docker (recomendado)

```bash
# Produção
make prod
# Acesse: http://localhost (frontend) | http://localhost/api/docs (Swagger)

# Desenvolvimento (hot reload)
make dev
# Acesse: http://localhost:5173 (frontend) | http://localhost:9000/api/docs (Swagger)
```

### Sem Docker

```bash
# Linux/Mac
./start.sh

# Windows
start.bat
```

### Pré-requisitos

- Docker Desktop (modo Docker) ou:
  - Python 3.11+
  - Node.js 20+
  - PostgreSQL 16

## Comandos Úteis

```bash
make help          # Lista todos os comandos
make dev           # Desenvolvimento com hot reload
make prod          # Produção
make down          # Para containers
make logs          # Logs em tempo real
make seed          # Recarrega dados de exemplo
make test          # Roda testes do backend
make db-shell      # Shell do PostgreSQL
make backup        # Backup do banco
make reset         # Reinicia tudo com dados frescos
```

## Módulos

| Módulo | Descrição |
|--------|-----------|
| Dashboard | KPIs, gráficos de evolução, distribuição de gastos, patrimônio |
| Receitas | Controle de entradas com fontes e tipos |
| Despesas | Controle de saídas por categoria e subcategoria |
| Contas Fixas | Gestão de contas recorrentes com status de pagamento |
| Investimentos | Carteira com cálculo de lucro e rentabilidade |
| Reserva | Fundo de emergência com progresso visual |
| MEI | Controle de faturamento com cálculo de impostos e limite anual |

## API

Documentação interativa: `http://localhost:9000/api/docs`

Base URL: `/api/v1`

Endpoints principais:
- `/receitas` — CRUD + resumos
- `/despesas` — CRUD + resumos por categoria
- `/contas-fixas` — CRUD + toggle pagamento + replicar mês
- `/investimentos` — CRUD + resumo por tipo
- `/reserva` — aportes + meta + status
- `/mei` — CRUD + resumo mensal/anual
- `/dashboard` — KPIs, evolução, patrimônio, saúde financeira

## Estrutura de Commits

```
feat(receitas): adiciona endpoint de resumo por fonte
fix(mei): corrige cálculo de imposto
chore(docker): atualiza configuração do compose
```

## Licença

Projeto pessoal. Uso livre.
