from datetime import date, datetime
from typing import Optional, List

from pydantic import BaseModel, Field


class MEIBase(BaseModel):
    data: date
    cliente: str = Field(..., max_length=200)
    servico: str = Field(..., max_length=200)
    valor_bruto: float = Field(..., gt=0)
    aliquota_imposto: float = Field(default=0.06, ge=0, le=1)
    nota_fiscal: bool = False
    mes: Optional[str] = None
    ano: Optional[int] = None
    observacoes: Optional[str] = None


class MEICreate(MEIBase):
    pass


class MEIUpdate(BaseModel):
    data: Optional[date] = None
    cliente: Optional[str] = Field(None, max_length=200)
    servico: Optional[str] = Field(None, max_length=200)
    valor_bruto: Optional[float] = Field(None, gt=0)
    aliquota_imposto: Optional[float] = Field(None, ge=0, le=1)
    nota_fiscal: Optional[bool] = None
    mes: Optional[str] = None
    ano: Optional[int] = None
    observacoes: Optional[str] = None


class MEIResponse(MEIBase):
    id: int
    imposto: float
    valor_liquido: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MEIListResponse(BaseModel):
    items: List[MEIResponse]
    total: int
    page: int
    per_page: int
    pages: int


class MEIResumoMensal(BaseModel):
    mes: str
    ano: int
    total_bruto: float
    total_imposto: float
    total_liquido: float
    qtd_servicos: int


class MEIResumoAnual(BaseModel):
    ano: int
    total_bruto: float
    total_imposto: float
    total_liquido: float
    limite_anual: float
    percentual_limite: float
    qtd_servicos: int
    meses: List[MEIResumoMensal]
