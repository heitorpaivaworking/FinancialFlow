from datetime import date
from typing import Optional, Tuple

MESES_PT = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]


def get_mes_ano(
    data: date, mes: Optional[str] = None, ano: Optional[int] = None
) -> Tuple[str, int]:
    """Retorna (mes_nome, ano) derivados da data quando não informados."""
    if not mes:
        mes = MESES_PT[data.month - 1]
    if not ano:
        ano = data.year
    return mes, ano


def get_prev_month(mes: str, ano: int) -> Tuple[str, int]:
    """Retorna o mês anterior dado um mês/ano."""
    idx = MESES_PT.index(mes) if mes in MESES_PT else 0
    if idx == 0:
        return MESES_PT[11], ano - 1
    return MESES_PT[idx - 1], ano


def get_next_month(mes: str, ano: int) -> Tuple[str, int]:
    """Retorna o próximo mês dado um mês/ano."""
    idx = MESES_PT.index(mes) if mes in MESES_PT else 0
    if idx == 11:
        return MESES_PT[0], ano + 1
    return MESES_PT[idx + 1], ano


def mes_to_number(mes: str) -> int:
    """Converte nome do mês para número (1-12)."""
    try:
        return MESES_PT.index(mes) + 1
    except ValueError:
        return 1
