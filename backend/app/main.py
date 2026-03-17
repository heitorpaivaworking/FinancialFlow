from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.database import engine
from app.routers import (
    receitas,
    despesas,
    investimentos,
    contas_fixas,
    reserva,
    mei,
    dashboard,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: verifica conexão com o banco
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    yield
    # Shutdown
    engine.dispose()


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(receitas.router, prefix="/api/v1/receitas", tags=["Receitas"])
app.include_router(despesas.router, prefix="/api/v1/despesas", tags=["Despesas"])
app.include_router(
    investimentos.router, prefix="/api/v1/investimentos", tags=["Investimentos"]
)
app.include_router(
    contas_fixas.router, prefix="/api/v1/contas-fixas", tags=["Contas Fixas"]
)
app.include_router(reserva.router, prefix="/api/v1/reserva", tags=["Reserva"])
app.include_router(mei.router, prefix="/api/v1/mei", tags=["MEI"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])


@app.get("/health", tags=["Health"])
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception:
        db_status = "unhealthy"

    return {
        "status": "ok",
        "database": db_status,
        "version": settings.app_version,
    }
