from typing import Optional, List
from datetime import date

from sqlalchemy import func, case, desc
from sqlalchemy.orm import Session

from app.models.receita import Receita
from app.models.despesa import Despesa
from app.models.investimento import Investimento
from app.models.reserva import ReservaEmergencia
from app.models.conta_fixa import ContaFixa
from app.utils.date_helpers import MESES_PT, get_prev_month


def get_kpis(db: Session, mes: str, ano: int):
    # Receita do mês
    receita_total = (
        db.query(func.coalesce(func.sum(Receita.valor), 0))
        .filter(Receita.mes == mes, Receita.ano == ano)
        .scalar()
    )

    # Despesa do mês
    despesa_total = (
        db.query(func.coalesce(func.sum(Despesa.valor), 0))
        .filter(Despesa.mes == mes, Despesa.ano == ano)
        .scalar()
    )

    # Mês anterior para comparação
    prev_mes, prev_ano = get_prev_month(mes, ano)
    receita_anterior = (
        db.query(func.coalesce(func.sum(Receita.valor), 0))
        .filter(Receita.mes == prev_mes, Receita.ano == prev_ano)
        .scalar()
    )
    despesa_anterior = (
        db.query(func.coalesce(func.sum(Despesa.valor), 0))
        .filter(Despesa.mes == prev_mes, Despesa.ano == prev_ano)
        .scalar()
    )

    # Investimentos
    investido_total = (
        db.query(func.coalesce(func.sum(Investimento.valor_atual), 0)).scalar()
    )

    # Reserva
    reserva_saldo = (
        db.query(func.coalesce(func.sum(ReservaEmergencia.valor), 0)).scalar()
    )

    saldo = float(receita_total) - float(despesa_total)

    # Score de saúde financeira (0-100)
    score = _calcular_score(
        float(receita_total),
        float(despesa_total),
        float(investido_total),
        float(reserva_saldo),
    )

    return {
        "receita_total": float(receita_total),
        "despesa_total": float(despesa_total),
        "saldo": saldo,
        "investido_total": float(investido_total),
        "reserva_saldo": float(reserva_saldo),
        "score_saude": score,
        "receita_anterior": float(receita_anterior),
        "despesa_anterior": float(despesa_anterior),
    }


def get_evolucao_mensal(db: Session, ano: int):
    receitas = (
        db.query(Receita.mes, Receita.ano, func.sum(Receita.valor).label("total"))
        .filter(Receita.ano == ano)
        .group_by(Receita.mes, Receita.ano)
        .all()
    )
    despesas = (
        db.query(Despesa.mes, Despesa.ano, func.sum(Despesa.valor).label("total"))
        .filter(Despesa.ano == ano)
        .group_by(Despesa.mes, Despesa.ano)
        .all()
    )

    rec_map = {r.mes: float(r.total) for r in receitas}
    desp_map = {d.mes: float(d.total) for d in despesas}

    result = []
    for mes in MESES_PT:
        r = rec_map.get(mes, 0)
        d = desp_map.get(mes, 0)
        if r > 0 or d > 0:
            result.append({
                "mes": mes,
                "ano": ano,
                "receitas": r,
                "despesas": d,
                "saldo": r - d,
            })

    return result


def get_gastos_categorias(db: Session, mes: Optional[str] = None, ano: Optional[int] = None):
    query = db.query(Despesa.categoria, func.sum(Despesa.valor).label("total"))

    if mes:
        query = query.filter(Despesa.mes == mes)
    if ano:
        query = query.filter(Despesa.ano == ano)

    results = query.group_by(Despesa.categoria).all()
    total_geral = sum(float(r.total) for r in results)

    return [
        {
            "categoria": r.categoria,
            "total": float(r.total),
            "percentual": float(r.total) / total_geral if total_geral > 0 else 0,
        }
        for r in sorted(results, key=lambda r: float(r.total), reverse=True)
    ]


def get_fluxo_caixa(db: Session, ano: int):
    evolucao = get_evolucao_mensal(db, ano)
    acumulado = 0
    result = []
    for item in evolucao:
        acumulado += item["saldo"]
        result.append({
            "mes": item["mes"],
            "ano": ano,
            "entradas": item["receitas"],
            "saidas": item["despesas"],
            "saldo_acumulado": acumulado,
        })
    return result


def get_patrimonio(db: Session, ano: int):
    evolucao = get_evolucao_mensal(db, ano)
    result = []
    saldo_acum = 0

    for item in evolucao:
        mes = item["mes"]
        saldo_acum += item["saldo"]

        inv_total = float(
            db.query(func.coalesce(func.sum(Investimento.valor_atual), 0))
            .filter(Investimento.mes == mes, Investimento.ano == ano)
            .scalar()
        )

        res_total = float(
            db.query(func.coalesce(func.sum(ReservaEmergencia.valor), 0))
            .filter(
                func.extract("month", ReservaEmergencia.data) == MESES_PT.index(mes) + 1,
                func.extract("year", ReservaEmergencia.data) == ano,
            )
            .scalar()
        )

        result.append({
            "mes": mes,
            "ano": ano,
            "saldo": saldo_acum,
            "investimentos": inv_total,
            "reserva": res_total,
            "total": saldo_acum + inv_total + res_total,
        })

    return result


def get_saude_financeira(db: Session, mes: str, ano: int):
    receita = float(
        db.query(func.coalesce(func.sum(Receita.valor), 0))
        .filter(Receita.mes == mes, Receita.ano == ano)
        .scalar()
    )
    despesa = float(
        db.query(func.coalesce(func.sum(Despesa.valor), 0))
        .filter(Despesa.mes == mes, Despesa.ano == ano)
        .scalar()
    )
    fixas = float(
        db.query(func.coalesce(func.sum(ContaFixa.valor), 0))
        .filter(ContaFixa.mes_ref == mes, ContaFixa.ano_ref == ano)
        .scalar()
    )
    reserva = float(
        db.query(func.coalesce(func.sum(ReservaEmergencia.valor), 0)).scalar()
    )

    taxa_poupanca = (receita - despesa) / receita if receita > 0 else 0
    comprometimento = fixas / receita if receita > 0 else 0
    meses_reserva = reserva / despesa if despesa > 0 else 0

    tipos_inv = (
        db.query(func.count(func.distinct(Investimento.tipo_investimento))).scalar()
    )
    diversificacao = min(tipos_inv / 5, 1.0) if tipos_inv else 0

    score = _calcular_score(receita, despesa, 0, reserva)

    return {
        "score": score,
        "taxa_poupanca": taxa_poupanca,
        "comprometimento_fixas": comprometimento,
        "reserva_meses": meses_reserva,
        "diversificacao_investimentos": diversificacao,
        "indicadores": {
            "receita": receita,
            "despesa": despesa,
            "fixas": fixas,
            "reserva": reserva,
            "tipos_investimento": tipos_inv,
        },
    }


def get_ultimas_transacoes(db: Session, limit: int = 10):
    receitas = (
        db.query(
            Receita.id,
            Receita.descricao,
            Receita.valor,
            Receita.data,
            Receita.fonte.label("categoria"),
        )
        .order_by(Receita.data.desc())
        .limit(limit)
        .all()
    )

    despesas = (
        db.query(
            Despesa.id,
            Despesa.descricao,
            Despesa.valor,
            Despesa.data,
            Despesa.categoria,
        )
        .order_by(Despesa.data.desc())
        .limit(limit)
        .all()
    )

    transacoes = []
    for r in receitas:
        transacoes.append({
            "id": r.id,
            "tipo": "receita",
            "descricao": r.descricao,
            "valor": float(r.valor),
            "data": r.data.isoformat(),
            "categoria": r.categoria,
        })
    for d in despesas:
        transacoes.append({
            "id": d.id,
            "tipo": "despesa",
            "descricao": d.descricao,
            "valor": float(d.valor),
            "data": d.data.isoformat(),
            "categoria": d.categoria,
        })

    transacoes.sort(key=lambda t: t["data"], reverse=True)
    return transacoes[:limit]


def _calcular_score(receita: float, despesa: float, investido: float, reserva: float) -> float:
    score = 50.0

    # Taxa de poupança (até +20 pontos)
    if receita > 0:
        taxa = (receita - despesa) / receita
        score += min(taxa * 100, 20)
        if taxa < 0:
            score += taxa * 50  # penalidade

    # Reserva de emergência (até +15 pontos)
    if despesa > 0:
        meses = reserva / despesa
        score += min(meses * 2.5, 15)

    # Investimentos (até +15 pontos)
    if receita > 0:
        taxa_inv = investido / (receita * 12)
        score += min(taxa_inv * 30, 15)

    return max(0, min(100, round(score, 1)))
