from datetime import date, datetime
from typing import Optional, List

from pydantic import BaseModel, Field, field_validator


class ReceitaBase(BaseModel):
    data: date
    fonte: str = Field(..., max_length=100)
    tipo: str = Field(..., max_length=50)
    descricao: str = Field(..., max_length=255)
    valor: float = Field(..., gt=0)
    forma_pagamento: str = Field(..., max_length=50)
    mes: Optional[str] = None
    ano: Optional[int] = None
    observacoes: Optional[str] = None


class ReceitaCreate(ReceitaBase):
    pass


class ReceitaUpdate(BaseModel):
    data: Optional[date] = None
    fonte: Optional[str] = Field(None, max_length=100)
    tipo: Optional[str] = Field(None, max_length=50)
    descricao: Optional[str] = Field(None, max_length=255)
    valor: Optional[float] = Field(None, gt=0)
    forma_pagamento: Optional[str] = Field(None, max_length=50)
    mes: Optional[str] = None
    ano: Optional[int] = None
    observacoes: Optional[str] = None


class ReceitaResponse(ReceitaBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReceitaListResponse(BaseModel):
    items: List[ReceitaResponse]
    total: int
    page: int
    per_page: int
    pages: int


class ReceitaResumoMensal(BaseModel):
    mes: str
    ano: int
    total: float


class ReceitaResumoPorFonte(BaseModel):
    fonte: str
    total: float
    percentual: float
