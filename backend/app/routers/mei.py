from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.mei import (
    MEICreate,
    MEIUpdate,
    MEIResponse,
    MEIListResponse,
    MEIResumoMensal,
    MEIResumoAnual,
)
from app.services import mei_service

router = APIRouter()


@router.get("", response_model=MEIListResponse)
def listar_mei(
    mes: Optional[str] = None,
    ano: Optional[int] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return mei_service.listar_mei(db, mes, ano, page, per_page)


@router.get("/resumo/mensal", response_model=List[MEIResumoMensal])
def resumo_mensal(ano: int, db: Session = Depends(get_db)):
    return mei_service.resumo_mensal(db, ano)


@router.get("/resumo/anual", response_model=MEIResumoAnual)
def resumo_anual(ano: int, db: Session = Depends(get_db)):
    return mei_service.resumo_anual(db, ano)


@router.get("/{mei_id}", response_model=MEIResponse)
def obter_mei(mei_id: int, db: Session = Depends(get_db)):
    lancamento = mei_service.obter_mei(db, mei_id)
    if not lancamento:
        raise HTTPException(status_code=404, detail="Lançamento MEI não encontrado")
    return lancamento


@router.post("", response_model=MEIResponse, status_code=201)
def criar_mei(data_in: MEICreate, db: Session = Depends(get_db)):
    return mei_service.criar_mei(db, data_in)


@router.put("/{mei_id}", response_model=MEIResponse)
def atualizar_mei(mei_id: int, data_in: MEIUpdate, db: Session = Depends(get_db)):
    lancamento = mei_service.atualizar_mei(db, mei_id, data_in)
    if not lancamento:
        raise HTTPException(status_code=404, detail="Lançamento MEI não encontrado")
    return lancamento


@router.delete("/{mei_id}", status_code=204)
def deletar_mei(mei_id: int, db: Session = Depends(get_db)):
    if not mei_service.deletar_mei(db, mei_id):
        raise HTTPException(status_code=404, detail="Lançamento MEI não encontrado")
