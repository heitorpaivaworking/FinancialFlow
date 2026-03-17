from typing import List, Dict


def calcular_imposto_mei(valor_bruto: float, aliquota: float = 0.06) -> Dict:
    """Calcula imposto e valor líquido para MEI."""
    imposto = round(valor_bruto * aliquota, 2)
    valor_liquido = round(valor_bruto - imposto, 2)
    return {
        "imposto": imposto,
        "valor_liquido": valor_liquido,
    }


def calcular_percentuais(items: List[Dict], campo_valor: str = "total") -> List[Dict]:
    """Adiciona campo 'percentual' a cada item baseado no total geral."""
    total = sum(item[campo_valor] for item in items)
    for item in items:
        item["percentual"] = item[campo_valor] / total if total > 0 else 0
    return items


def calcular_variacao(atual: float, anterior: float) -> Dict:
    """Calcula variação percentual entre dois valores."""
    if anterior == 0:
        return {"variacao": 0, "percentual": 0, "tendencia": "neutro"}

    variacao = atual - anterior
    percentual = variacao / abs(anterior)
    tendencia = "positivo" if variacao > 0 else "negativo" if variacao < 0 else "neutro"

    return {
        "variacao": round(variacao, 2),
        "percentual": round(percentual, 4),
        "tendencia": tendencia,
    }
