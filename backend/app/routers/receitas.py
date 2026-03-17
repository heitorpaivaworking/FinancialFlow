from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.receita import (
    ReceitaCreate,
    ReceitaUpdate,
    ReceitaResponse,
    ReceitaListResponse,
    ReceitaResumoMensal,
    ReceitaResumoPorFonte,
)
from app.services import receita_service

router = APIRouter()


@router.get("", response_model=ReceitaListResponse)
def listar_receitas(
    mes: Optional[str] = None,
    ano: Optional[int] = None,
    fonte: Optional[str] = None,
    tipo: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return receita_service.listar_receitas(db, mes, ano, fonte, tipo, page, per_page)


@router.get("/resumo/mensal", response_model=List[ReceitaResumoMensal])
def resumo_mensal(ano: int, db: Session = Depends(get_db)):
    return receita_service.resumo_mensal(db, ano)


@router.get("/resumo/por-fonte", response_model=List[ReceitaResumoPorFonte])
def resumo_por_fonte(
    mes: Optional[str] = None,
    ano: Optional[int] = None,
    db: Session = Depends(get_db),
):
    return receita_service.resumo_por_fonte(db, mes, ano)


@router.get("/{receita_id}", response_model=ReceitaResponse)
def obter_receita(receita_id: int, db: Session = Depends(get_db)):
    receita = receita_service.obter_receita(db, receita_id)
    if not receita:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    return receita


@router.post("", response_model=ReceitaResponse, status_code=201)
def criar_receita(data_in: ReceitaCreate, db: Session = Depends(get_db)):
    return receita_service.criar_receita(db, data_in)


@router.put("/{receita_id}", response_model=ReceitaResponse)
def atualizar_receita(
    receita_id: int, data_in: ReceitaUpdate, db: Session = Depends(get_db)
):
    receita = receita_service.atualizar_receita(db, receita_id, data_in)
    if not receita:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    return receita


@router.delete("/{receita_id}", status_code=204)
def deletar_receita(receita_id: int, db: Session = Depends(get_db)):
    if not receita_service.deletar_receita(db, receita_id):
        raise HTTPException(status_code=404, detail="Receita não encontrada")
