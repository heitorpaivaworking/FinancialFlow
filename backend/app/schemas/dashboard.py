from typing import List, Optional

from pydantic import BaseModel


class KPIResponse(BaseModel):
    receita_total: float
    despesa_total: float
    saldo: float
    investido_total: float
    reserva_saldo: float
    score_saude: float  # 0-100
    receita_anterior: Optional[float] = None
    despesa_anterior: Optional[float] = None


class EvolucaoMensalItem(BaseModel):
    mes: str
    ano: int
    receitas: float
    despesas: float
    saldo: float


class GastosCategoriaItem(BaseModel):
    categoria: str
    total: float
    percentual: float


class FluxoCaixaItem(BaseModel):
    mes: str
    ano: int
    entradas: float
    saidas: float
    saldo_acumulado: float


class PatrimonioItem(BaseModel):
    mes: str
    ano: int
    saldo: float
    investimentos: float
    reserva: float
    total: float


class SaudeFinanceira(BaseModel):
    score: float
    taxa_poupanca: float
    comprometimento_fixas: float
    reserva_meses: float
    diversificacao_investimentos: float
    indicadores: dict


class TransacaoRecente(BaseModel):
    id: int
    tipo: str  # "receita" | "despesa"
    descricao: str
    valor: float
    data: str
    categoria: Optional[str] = None
