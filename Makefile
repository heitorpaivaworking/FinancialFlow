.PHONY: help dev prod down logs db-shell api-shell seed migrate backup restore

help: ## Mostra esta ajuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Inicia em modo desenvolvimento (hot reload)
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

prod: ## Inicia em modo produção
	docker compose up --build -d
	@echo "✅ FinanceFlow rodando em http://localhost"
	@echo "📚 API Docs: http://localhost/api/docs"

down: ## Para todos os containers
	docker compose down

down-v: ## Para containers e apaga volumes (PERDA DE DADOS!)
	docker compose down -v

logs: ## Mostra logs em tempo real
	docker compose logs -f

logs-api: ## Logs apenas do backend
	docker compose logs -f backend

db-shell: ## Abre shell do PostgreSQL
	docker compose exec postgres psql -U financeflow -d financeflow

api-shell: ## Abre shell do container backend
	docker compose exec backend bash

seed: ## Reexecuta o seed de dados
	docker compose exec backend python seed_data.py --force

migrate: ## Cria e aplica nova migration
	docker compose exec backend alembic revision --autogenerate -m "$(MSG)"
	docker compose exec backend alembic upgrade head

migrate-up: ## Aplica migrations pendentes
	docker compose exec backend alembic upgrade head

migrate-down: ## Reverte última migration
	docker compose exec backend alembic downgrade -1

backup: ## Faz backup do banco de dados
	mkdir -p backups
	docker compose exec postgres pg_dump -U financeflow financeflow | gzip > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql.gz
	@echo "✅ Backup salvo em backups/"

restore: ## Restaura backup (uso: make restore FILE=backups/arquivo.sql.gz)
	gunzip -c $(FILE) | docker compose exec -T postgres psql -U financeflow -d financeflow
	@echo "✅ Banco restaurado de $(FILE)"

test: ## Roda os testes do backend
	docker compose exec backend pytest tests/ -v --tb=short

lint-front: ## Linta o frontend
	cd frontend && npm run lint

format: ## Formata código (black + prettier)
	docker compose exec backend black app/
	cd frontend && npm run format

ps: ## Status dos containers
	docker compose ps

reset: ## Reinicia tudo com dados frescos
	docker compose down -v
	docker compose up --build -d
	@echo "✅ Sistema reiniciado com dados frescos"
