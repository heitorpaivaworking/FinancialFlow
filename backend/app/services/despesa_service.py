import math
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.despesa import Despesa
from app.schemas.despesa import DespesaCreate, DespesaUpdate
from app.utils.date_helpers import MESES_PT, get_mes_ano


def listar_despesas(
    db: Session,
    mes: Optional[str] = None,
    ano: Optional[int] = None,
    categoria: Optional[str] = None,
    tipo: Optional[str] = None,
    page: int = 1,
    per_page: int = 20,
):
    query = db.query(Despesa)

    if mes:
        query = query.filter(Despesa.mes == mes)
    if ano:
        query = query.filter(Despesa.ano == ano)
    if categoria:
        query = query.filter(Despesa.categoria == categoria)
    if tipo:
        query = query.filter(Despesa.tipo == tipo)

    total = query.count()
    pages = math.ceil(total / per_page) if total > 0 else 1
    items = (
        query.order_by(Despesa.data.desc())
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


def obter_despesa(db: Session, despesa_id: int):
    return db.query(Despesa).filter(Despesa.id == despesa_id).first()


def criar_despesa(db: Session, data_in: DespesaCreate):
    mes, ano = get_mes_ano(data_in.data, data_in.mes, data_in.ano)
    despesa = Despesa(
        data=data_in.data,
        categoria=data_in.categoria,
        subcategoria=data_in.subcategoria,
        descricao=data_in.descricao,
        tipo=data_in.tipo,
        forma_pagamento=data_in.forma_pagamento,
        valor=data_in.valor,
        mes=mes,
        ano=ano,
        observacoes=data_in.observacoes,
    )
    db.add(despesa)
    db.commit()
    db.refresh(despesa)
    return despesa


def atualizar_despesa(db: Session, despesa_id: int, data_in: DespesaUpdate):
    despesa = db.query(Despesa).filter(Despesa.id == despesa_id).first()
    if not despesa:
        return None

    update_data = data_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(despesa, field, value)

    if "data" in update_data:
        mes, ano = get_mes_ano(despesa.data, None, None)
        despesa.mes = mes
        despesa.ano = ano

    db.commit()
    db.refresh(despesa)
    return despesa


def deletar_despesa(db: Session, despesa_id: int):
    despesa = db.query(Despesa).filter(Despesa.id == despesa_id).first()
    if not despesa:
        return False
    db.delete(despesa)
    db.commit()
    return True


def resumo_mensal(db: Session, ano: int):
    results = (
        db.query(Despesa.mes, Despesa.ano, func.sum(Despesa.valor).label("total"))
        .filter(Despesa.ano == ano)
        .group_by(Despesa.mes, Despesa.ano)
        .all()
    )
    ordered = sorted(
        results, key=lambda r: MESES_PT.index(r.mes) if r.mes in MESES_PT else 0
    )
    return [{"mes": r.mes, "ano": r.ano, "total": float(r.total)} for r in ordered]


def resumo_categorias(
    db: Session, mes: Optional[str] = None, ano: Optional[int] = None
):
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
