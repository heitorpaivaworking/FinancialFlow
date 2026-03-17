from typing import Optional, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.dashboard import (
    KPIResponse,
    EvolucaoMensalItem,
    GastosCategoriaItem,
    FluxoCaixaItem,
    PatrimonioItem,
    SaudeFinanceira,
    TransacaoRecente,
)
from app.services import dashboard_service

router = APIRouter()


@router.get("/kpis", response_model=KPIResponse)
def get_kpis(mes: str, ano: int, db: Session = Depends(get_db)):
    return dashboard_service.get_kpis(db, mes, ano)


@router.get("/evolucao-mensal", response_model=List[EvolucaoMensalItem])
def get_evolucao_mensal(ano: int, db: Session = Depends(get_db)):
    return dashboard_service.get_evolucao_mensal(db, ano)


@router.get("/gastos-categorias", response_model=List[GastosCategoriaItem])
def get_gastos_categorias(
    mes: Optional[str] = None,
    ano: Optional[int] = None,
    db: Session = Depends(get_db),
):
    return dashboard_service.get_gastos_categorias(db, mes, ano)


@router.get("/fluxo-caixa", response_model=List[FluxoCaixaItem])
def get_fluxo_caixa(ano: int, db: Session = Depends(get_db)):
    return dashboard_service.get_fluxo_caixa(db, ano)


@router.get("/patrimonio", response_model=List[PatrimonioItem])
def get_patrimonio(ano: int, db: Session = Depends(get_db)):
    return dashboard_service.get_patrimonio(db, ano)


@router.get("/saude-financeira", response_model=SaudeFinanceira)
def get_saude_financeira(mes: str, ano: int, db: Session = Depends(get_db)):
    return dashboard_service.get_saude_financeira(db, mes, ano)


@router.get("/ultimas-transacoes", response_model=List[TransacaoRecente])
def get_ultimas_transacoes(
    limit: int = Query(10, ge=1, le=50), db: Session = Depends(get_db)
):
    return dashboard_service.get_ultimas_transacoes(db, limit)
