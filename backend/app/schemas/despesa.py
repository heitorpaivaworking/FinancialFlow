from datetime import date, datetime
from typing import Optional, List

from pydantic import BaseModel, Field


class DespesaBase(BaseModel):
    data: date
    categoria: str = Field(..., max_length=100)
    subcategoria: Optional[str] = Field(None, max_length=100)
    descricao: str = Field(..., max_length=255)
    tipo: str = Field(..., max_length=50)
    forma_pagamento: str = Field(..., max_length=50)
    valor: float = Field(..., gt=0)
    mes: Optional[str] = None
    ano: Optional[int] = None
    observacoes: Optional[str] = None


class DespesaCreate(DespesaBase):
    pass


class DespesaUpdate(BaseModel):
    data: Optional[date] = None
    categoria: Optional[str] = Field(None, max_length=100)
    subcategoria: Optional[str] = Field(None, max_length=100)
    descricao: Optional[str] = Field(None, max_length=255)
    tipo: Optional[str] = Field(None, max_length=50)
    forma_pagamento: Optional[str] = Field(None, max_length=50)
    valor: Optional[float] = Field(None, gt=0)
    mes: Optional[str] = None
    ano: Optional[int] = None
    observacoes: Optional[str] = None


class DespesaResponse(DespesaBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DespesaListResponse(BaseModel):
    items: List[DespesaResponse]
    total: int
    page: int
    per_page: int
    pages: int


class DespesaResumoMensal(BaseModel):
    mes: str
    ano: int
    total: float


class DespesaResumoPorCategoria(BaseModel):
    categoria: str
    total: float
    percentual: float
