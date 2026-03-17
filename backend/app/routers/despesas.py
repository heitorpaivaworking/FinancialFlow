from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.despesa import (
    DespesaCreate,
    DespesaUpdate,
    DespesaResponse,
    DespesaListResponse,
    DespesaResumoMensal,
    DespesaResumoPorCategoria,
)
from app.services import despesa_service

router = APIRouter()


@router.get("", response_model=DespesaListResponse)
def listar_despesas(
    mes: Optional[str] = None,
    ano: Optional[int] = None,
    categoria: Optional[str] = None,
    tipo: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return despesa_service.listar_despesas(db, mes, ano, categoria, tipo, page, per_page)


@router.get("/resumo/mensal", response_model=List[DespesaResumoMensal])
def resumo_mensal(ano: int, db: Session = Depends(get_db)):
    return despesa_service.resumo_mensal(db, ano)


@router.get("/resumo/categorias", response_model=List[DespesaResumoPorCategoria])
def resumo_categorias(
    mes: Optional[str] = None,
    ano: Optional[int] = None,
    db: Session = Depends(get_db),
):
    return despesa_service.resumo_categorias(db, mes, ano)


@router.get("/{despesa_id}", response_model=DespesaResponse)
def obter_despesa(despesa_id: int, db: Session = Depends(get_db)):
    despesa = despesa_service.obter_despesa(db, despesa_id)
    if not despesa:
        raise HTTPException(status_code=404, detail="Despesa não encontrada")
    return despesa


@router.post("", response_model=DespesaResponse, status_code=201)
def criar_despesa(data_in: DespesaCreate, db: Session = Depends(get_db)):
    return despesa_service.criar_despesa(db, data_in)


@router.put("/{despesa_id}", response_model=DespesaResponse)
def atualizar_despesa(
    despesa_id: int, data_in: DespesaUpdate, db: Session = Depends(get_db)
):
    despesa = despesa_service.atualizar_despesa(db, despesa_id, data_in)
    if not despesa:
        raise HTTPException(status_code=404, detail="Despesa não encontrada")
    return despesa


@router.delete("/{despesa_id}", status_code=204)
def deletar_despesa(despesa_id: int, db: Session = Depends(get_db)):
    if not despesa_service.deletar_despesa(db, despesa_id):
        raise HTTPException(status_code=404, detail="Despesa não encontrada")
