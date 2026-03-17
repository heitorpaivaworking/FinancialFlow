import math
from typing import Optional, List

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.receita import Receita
from app.schemas.receita import ReceitaCreate, ReceitaUpdate
from app.utils.date_helpers import MESES_PT, get_mes_ano


def listar_receitas(
    db: Session,
    mes: Optional[str] = None,
    ano: Optional[int] = None,
    fonte: Optional[str] = None,
    tipo: Optional[str] = None,
    page: int = 1,
    per_page: int = 20,
):
    query = db.query(Receita)

    if mes:
        query = query.filter(Receita.mes == mes)
    if ano:
        query = query.filter(Receita.ano == ano)
    if fonte:
        query = query.filter(Receita.fonte == fonte)
    if tipo:
        query = query.filter(Receita.tipo == tipo)

    total = query.count()
    pages = math.ceil(total / per_page) if total > 0 else 1
    items = (
        query.order_by(Receita.data.desc())
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


def obter_receita(db: Session, receita_id: int):
    return db.query(Receita).filter(Receita.id == receita_id).first()


def criar_receita(db: Session, data_in: ReceitaCreate):
    mes, ano = get_mes_ano(data_in.data, data_in.mes, data_in.ano)
    receita = Receita(
        data=data_in.data,
        fonte=data_in.fonte,
        tipo=data_in.tipo,
        descricao=data_in.descricao,
        valor=data_in.valor,
        forma_pagamento=data_in.forma_pagamento,
        mes=mes,
        ano=ano,
        observacoes=data_in.observacoes,
    )
    db.add(receita)
    db.commit()
    db.refresh(receita)
    return receita


def atualizar_receita(db: Session, receita_id: int, data_in: ReceitaUpdate):
    receita = db.query(Receita).filter(Receita.id == receita_id).first()
    if not receita:
        return None

    update_data = data_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(receita, field, value)

    if "data" in update_data:
        mes, ano = get_mes_ano(receita.data, None, None)
        receita.mes = mes
        receita.ano = ano

    db.commit()
    db.refresh(receita)
    return receita


def deletar_receita(db: Session, receita_id: int):
    receita = db.query(Receita).filter(Receita.id == receita_id).first()
    if not receita:
        return False
    db.delete(receita)
    db.commit()
    return True


def resumo_mensal(db: Session, ano: int):
    results = (
        db.query(Receita.mes, Receita.ano, func.sum(Receita.valor).label("total"))
        .filter(Receita.ano == ano)
        .group_by(Receita.mes, Receita.ano)
        .all()
    )
    # Ordenar por índice do mês
    ordered = sorted(
        results, key=lambda r: MESES_PT.index(r.mes) if r.mes in MESES_PT else 0
    )
    return [
        {"mes": r.mes, "ano": r.ano, "total": float(r.total)} for r in ordered
    ]


def resumo_por_fonte(db: Session, mes: Optional[str] = None, ano: Optional[int] = None):
    query = db.query(Receita.fonte, func.sum(Receita.valor).label("total"))

    if mes:
        query = query.filter(Receita.mes == mes)
    if ano:
        query = query.filter(Receita.ano == ano)

    results = query.group_by(Receita.fonte).all()
    total_geral = sum(float(r.total) for r in results)

    return [
        {
            "fonte": r.fonte,
            "total": float(r.total),
            "percentual": float(r.total) / total_geral if total_geral > 0 else 0,
        }
        for r in sorted(results, key=lambda r: float(r.total), reverse=True)
    ]
