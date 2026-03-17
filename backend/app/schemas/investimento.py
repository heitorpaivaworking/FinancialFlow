from datetime import date, datetime
from typing import Optional, List

from pydantic import BaseModel, Field


class InvestimentoBase(BaseModel):
    data: date
    tipo_investimento: str = Field(..., max_length=50)
    categoria: str = Field(..., max_length=100)
    ativo: str = Field(..., max_length=100)
    valor_investido: float = Field(..., gt=0)
    valor_atual: float = Field(..., ge=0)
    quantidade: Optional[float] = None
    corretora: Optional[str] = Field(None, max_length=100)
    mes: Optional[str] = None
    ano: Optional[int] = None
    observacoes: Optional[str] = None


class InvestimentoCreate(InvestimentoBase):
    pass


class InvestimentoUpdate(BaseModel):
    data: Optional[date] = None
    tipo_investimento: Optional[str] = Field(None, max_length=50)
    categoria: Optional[str] = Field(None, max_length=100)
    ativo: Optional[str] = Field(None, max_length=100)
    valor_investido: Optional[float] = Field(None, gt=0)
    valor_atual: Optional[float] = Field(None, ge=0)
    quantidade: Optional[float] = None
    corretora: Optional[str] = Field(None, max_length=100)
    mes: Optional[str] = None
    ano: Optional[int] = None
    observacoes: Optional[str] = None


class InvestimentoResponse(InvestimentoBase):
    id: int
    lucro: float
    rentabilidade_pct: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InvestimentoListResponse(BaseModel):
    items: List[InvestimentoResponse]
    total: int
    page: int
    per_page: int
    pages: int


class InvestimentoResumoTotal(BaseModel):
    total_investido: float
    total_atual: float
    lucro_total: float
    rentabilidade_media: float


class InvestimentoResumoPorTipo(BaseModel):
    tipo_investimento: str
    total_investido: float
    total_atual: float
    lucro: float
    percentual: float
