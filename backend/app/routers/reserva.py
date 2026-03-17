from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.reserva import ReservaEmergencia, ReservaConfig
from app.schemas.reserva import (
    ReservaCreate,
    ReservaResponse,
    ReservaListResponse,
    ReservaMetaUpdate,
    ReservaStatus,
)

router = APIRouter()


def _get_or_create_config(db: Session) -> ReservaConfig:
    config = db.query(ReservaConfig).first()
    if not config:
        config = ReservaConfig(meta=12000, meses_meta=6)
        db.add(config)
        db.commit()
        db.refresh(config)
    return config


@router.get("", response_model=ReservaListResponse)
def listar_reserva(db: Session = Depends(get_db)):
    items = db.query(ReservaEmergencia).order_by(ReservaEmergencia.data.desc()).all()
    saldo_atual = float(
        db.query(func.coalesce(func.sum(ReservaEmergencia.valor), 0)).scalar()
    )
    return {"items": items, "saldo_atual": saldo_atual}


@router.post("", response_model=ReservaResponse, status_code=201)
def criar_aporte(data_in: ReservaCreate, db: Session = Depends(get_db)):
    aporte = ReservaEmergencia(
        data=data_in.data,
        descricao=data_in.descricao,
        valor=data_in.valor,
        observacoes=data_in.observacoes,
    )
    db.add(aporte)
    db.commit()
    db.refresh(aporte)
    return aporte


@router.put("/meta", response_model=dict)
def atualizar_meta(data_in: ReservaMetaUpdate, db: Session = Depends(get_db)):
    config = _get_or_create_config(db)
    config.meta = data_in.meta
    config.meses_meta = data_in.meses_meta
    db.commit()
    return {"meta": float(config.meta), "meses_meta": config.meses_meta}


@router.get("/status", response_model=ReservaStatus)
def status_reserva(db: Session = Depends(get_db)):
    config = _get_or_create_config(db)

    saldo_atual = float(
        db.query(func.coalesce(func.sum(ReservaEmergencia.valor), 0)).scalar()
    )
    total_aportes = db.query(func.count(ReservaEmergencia.id)).scalar()

    meta = float(config.meta)
    meses_meta = config.meses_meta

    falta = max(meta - saldo_atual, 0)
    progresso = (saldo_atual / meta * 100) if meta > 0 else 0
    aporte_necessario = falta / meses_meta if meses_meta > 0 else 0

    return {
        "saldo_atual": saldo_atual,
        "meta": meta,
        "meses_meta": meses_meta,
        "progresso_pct": min(progresso, 100),
        "falta": falta,
        "aporte_mensal_necessario": round(aporte_necessario, 2),
        "total_aportes": total_aportes,
    }
