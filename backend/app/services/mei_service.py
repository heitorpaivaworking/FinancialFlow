import math
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.mei import MEILancamento
from app.schemas.mei import MEICreate, MEIUpdate
from app.utils.date_helpers import MESES_PT, get_mes_ano

LIMITE_MEI_ANUAL = 81000


def listar_mei(
    db: Session,
    mes: Optional[str] = None,
    ano: Optional[int] = None,
    page: int = 1,
    per_page: int = 20,
):
    query = db.query(MEILancamento)

    if mes:
        query = query.filter(MEILancamento.mes == mes)
    if ano:
        query = query.filter(MEILancamento.ano == ano)

    total = query.count()
    pages = math.ceil(total / per_page) if total > 0 else 1
    items = (
        query.order_by(MEILancamento.data.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    return {
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": pages,
    }


def obter_mei(db: Session, mei_id: int):
    return db.query(MEILancamento).filter(MEILancamento.id == mei_id).first()


def criar_mei(db: Session, data_in: MEICreate):
    mes, ano = get_mes_ano(data_in.data, data_in.mes, data_in.ano)
    imposto = data_in.valor_bruto * data_in.aliquota_imposto
    valor_liquido = data_in.valor_bruto - imposto

    lancamento = MEILancamento(
        data=data_in.data,
        cliente=data_in.cliente,
        servico=data_in.servico,
        valor_bruto=data_in.valor_bruto,
        aliquota_imposto=data_in.aliquota_imposto,
        imposto=round(imposto, 2),
        valor_liquido=round(valor_liquido, 2),
        nota_fiscal=data_in.nota_fiscal,
        mes=mes,
        ano=ano,
        observacoes=data_in.observacoes,
    )
    db.add(lancamento)
    db.commit()
    db.refresh(lancamento)
    return lancamento


def atualizar_mei(db: Session, mei_id: int, data_in: MEIUpdate):
    lancamento = db.query(MEILancamento).filter(MEILancamento.id == mei_id).first()
    if not lancamento:
        return None

    update_data = data_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(lancamento, field, value)

    if "data" in update_data:
        mes, ano = get_mes_ano(lancamento.data, None, None)
        lancamento.mes = mes
        lancamento.ano = ano

    # Recalcular imposto e valor líquido
    lancamento.imposto = round(
        float(lancamento.valor_bruto) * float(lancamento.aliquota_imposto), 2
    )
    lancamento.valor_liquido = round(
        float(lancamento.valor_bruto) - float(lancamento.imposto), 2
    )

    db.commit()
    db.refresh(lancamento)
    return lancamento


def deletar_mei(db: Session, mei_id: int):
    lancamento = db.query(MEILancamento).filter(MEILancamento.id == mei_id).first()
    if not lancamento:
        return False
    db.delete(lancamento)
    db.commit()
    return True


def resumo_mensal(db: Session, ano: int):
    results = (
        db.query(
            MEILancamento.mes,
            MEILancamento.ano,
            func.sum(MEILancamento.valor_bruto).label("total_bruto"),
            func.sum(MEILancamento.imposto).label("total_imposto"),
            func.sum(MEILancamento.valor_liquido).label("total_liquido"),
            func.count(MEILancamento.id).label("qtd"),
        )
        .filter(MEILancamento.ano == ano)
        .group_by(MEILancamento.mes, MEILancamento.ano)
        .all()
    )

    ordered = sorted(
        results, key=lambda r: MESES_PT.index(r.mes) if r.mes in MESES_PT else 0
    )

    return [
        {
            "mes": r.mes,
            "ano": r.ano,
            "total_bruto": float(r.total_bruto),
            "total_imposto": float(r.total_imposto),
            "total_liquido": float(r.total_liquido),
            "qtd_servicos": r.qtd,
        }
        for r in ordered
    ]


def resumo_anual(db: Session, ano: int):
    meses = resumo_mensal(db, ano)
    total_bruto = sum(m["total_bruto"] for m in meses)
    total_imposto = sum(m["total_imposto"] for m in meses)
    total_liquido = sum(m["total_liquido"] for m in meses)
    qtd = sum(m["qtd_servicos"] for m in meses)

    return {
        "ano": ano,
        "total_bruto": total_bruto,
        "total_imposto": total_imposto,
        "total_liquido": total_liquido,
        "limite_anual": LIMITE_MEI_ANUAL,
        "percentual_limite": total_bruto / LIMITE_MEI_ANUAL if LIMITE_MEI_ANUAL > 0 else 0,
        "qtd_servicos": qtd,
        "meses": meses,
    }
