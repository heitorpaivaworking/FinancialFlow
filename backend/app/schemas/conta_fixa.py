from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field


class ContaFixaBase(BaseModel):
    nome: str = Field(..., max_length=100)
    categoria: str = Field(..., max_length=100)
    valor: float = Field(..., gt=0)
    dia_vencimento: int = Field(..., ge=1, le=31)
    status: str = Field(default="Pendente", max_length=20)
    mes_ref: str = Field(..., max_length=20)
    ano_ref: int
    observacao: Optional[str] = None


class ContaFixaCreate(ContaFixaBase):
    pass


class ContaFixaUpdate(BaseModel):
    nome: Optional[str] = Field(None, max_length=100)
    categoria: Optional[str] = Field(None, max_length=100)
    valor: Optional[float] = Field(None, gt=0)
    dia_vencimento: Optional[int] = Field(None, ge=1, le=31)
    status: Optional[str] = Field(None, max_length=20)
    mes_ref: Optional[str] = Field(None, max_length=20)
    ano_ref: Optional[int] = None
    observacao: Optional[str] = None


class ContaFixaResponse(ContaFixaBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ContaFixaListResponse(BaseModel):
    items: List[ContaFixaResponse]
    total: int
    total_valor: float
    total_pago: float
    total_pendente: float


class ReplicarContasRequest(BaseModel):
    mes_origem: str
    ano_origem: int
    mes_destino: str
    ano_destino: int
