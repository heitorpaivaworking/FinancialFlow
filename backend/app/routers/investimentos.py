import math
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.investimento import Investimento
from app.schemas.investimento import (
    InvestimentoCreate,
    InvestimentoUpdate,
    InvestimentoResponse,
    InvestimentoListResponse,
    InvestimentoResumoTotal,
    InvestimentoResumoPorTipo,
)
from app.utils.date_helpers import get_mes_ano

router = APIRouter()


@router.get("", response_model=InvestimentoListResponse)
def listar_investimentos(
    mes: Optional[str] = None,
    ano: Optional[int] = None,
    tipo: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Investimento)
    if mes:
        query = query.filter(Investimento.mes == mes)
    if ano:
        query = query.filter(Investimento.ano == ano)
    if tipo:
        query = query.filter(Investimento.tipo_investimento == tipo)

    total = query.count()
    pages = math.ceil(total / per_page) if total > 0 else 1
    items = (
        query.order_by(Investimento.data.desc())
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


@router.get("/resumo/total", response_model=InvestimentoResumoTotal)
def resumo_total(ano: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Investimento)
    if ano:
        query = query.filter(Investimento.ano == ano)

    items = query.all()
    total_investido = sum(float(i.valor_investido) for i in items)
    total_atual = sum(float(i.valor_atual) for i in items)
    lucro = total_atual - total_investido
    rentab = lucro / total_investido if total_investido > 0 else 0

    return {
        "total_investido": total_investido,
        "total_atual": total_atual,
        "lucro_total": lucro,
        "rentabilidade_media": rentab,
    }


@router.get("/resumo/por-tipo", response_model=List[InvestimentoResumoPorTipo])
def resumo_por_tipo(ano: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(
        Investimento.tipo_investimento,
        func.sum(Investimento.valor_investido).label("total_investido"),
        func.sum(Investimento.valor_atual).label("total_atual"),
    )
    if ano:
        query = query.filter(Investimento.ano == ano)

    results = query.group_by(Investimento.tipo_investimento).all()
    grand_total = sum(float(r.total_investido) for r in results)

    return [
        {
            "tipo_investimento": r.tipo_investimento,
            "total_investido": float(r.total_investido),
            "total_atual": float(r.total_atual),
            "lucro": float(r.total_atual) - float(r.total_investido),
            "percentual": float(r.total_investido) / grand_total if grand_total > 0 else 0,
        }
        for r in results
    ]


@router.get("/{investimento_id}", response_model=InvestimentoResponse)
def obter_investimento(investimento_id: int, db: Session = Depends(get_db)):
    inv = db.query(Investimento).filter(Investimento.id == investimento_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investimento não encontrado")
    return inv


@router.post("", response_model=InvestimentoResponse, status_code=201)
def criar_investimento(data_in: InvestimentoCreate, db: Session = Depends(get_db)):
    mes, ano = get_mes_ano(data_in.data, data_in.mes, data_in.ano)
    inv = Investimento(
        data=data_in.data,
        tipo_investimento=data_in.tipo_investimento,
        categoria=data_in.categoria,
        ativo=data_in.ativo,
        valor_investido=data_in.valor_investido,
        valor_atual=data_in.valor_atual,
        quantidade=data_in.quantidade,
        corretora=data_in.corretora,
        mes=mes,
        ano=ano,
        observacoes=data_in.observacoes,
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return inv


@router.put("/{investimento_id}", response_model=InvestimentoResponse)
def atualizar_investimento(
    investimento_id: int, data_in: InvestimentoUpdate, db: Session = Depends(get_db)
):
    inv = db.query(Investimento).filter(Investimento.id == investimento_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investimento não encontrado")

    update_data = data_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(inv, field, value)

    if "data" in update_data:
        mes, ano = get_mes_ano(inv.data, None, None)
        inv.mes = mes
        inv.ano = ano

    db.commit()
    db.refresh(inv)
    return inv


@router.delete("/{investimento_id}", status_code=204)
def deletar_investimento(investimento_id: int, db: Session = Depends(get_db)):
    inv = db.query(Investimento).filter(Investimento.id == investimento_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investimento não encontrado")
    db.delete(inv)
    db.commit()
