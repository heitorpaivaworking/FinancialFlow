from datetime import date, datetime
from typing import Optional, List

from pydantic import BaseModel, Field


class ReservaCreate(BaseModel):
    data: date
    descricao: str = Field(..., max_length=255)
    valor: float  # positivo=aporte, negativo=retirada
    observacoes: Optional[str] = None


class ReservaResponse(BaseModel):
    id: int
    data: date
    descricao: str
    valor: float
    observacoes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReservaListResponse(BaseModel):
    items: List[ReservaResponse]
    saldo_atual: float


class ReservaMetaUpdate(BaseModel):
    meta: float = Field(..., gt=0)
    meses_meta: int = Field(..., gt=0)


class ReservaStatus(BaseModel):
    saldo_atual: float
    meta: float
    meses_meta: int
    progresso_pct: float
    falta: float
    aporte_mensal_necessario: float
    total_aportes: int
