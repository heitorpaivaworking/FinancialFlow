from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.conta_fixa import ContaFixa
from app.schemas.conta_fixa import (
    ContaFixaCreate,
    ContaFixaUpdate,
    ContaFixaResponse,
    ContaFixaListResponse,
    ReplicarContasRequest,
)

router = APIRouter()


@router.get("", response_model=ContaFixaListResponse)
def listar_contas_fixas(
    mes_ref: Optional[str] = None,
    ano_ref: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(ContaFixa)
    if mes_ref:
        query = query.filter(ContaFixa.mes_ref == mes_ref)
    if ano_ref:
        query = query.filter(ContaFixa.ano_ref == ano_ref)
    if status:
        query = query.filter(ContaFixa.status == status)

    items = query.order_by(ContaFixa.dia_vencimento).all()
    total_valor = sum(float(c.valor) for c in items)
    total_pago = sum(float(c.valor) for c in items if c.status == "Pago")
    total_pendente = sum(float(c.valor) for c in items if c.status != "Pago")

    return {
        "items": items,
        "total": len(items),
        "total_valor": total_valor,
        "total_pago": total_pago,
        "total_pendente": total_pendente,
    }


@router.post("", response_model=ContaFixaResponse, status_code=201)
def criar_conta_fixa(data_in: ContaFixaCreate, db: Session = Depends(get_db)):
    conta = ContaFixa(**data_in.model_dump())
    db.add(conta)
    db.commit()
    db.refresh(conta)
    return conta


@router.put("/{conta_id}", response_model=ContaFixaResponse)
def atualizar_conta_fixa(
    conta_id: int, data_in: ContaFixaUpdate, db: Session = Depends(get_db)
):
    conta = db.query(ContaFixa).filter(ContaFixa.id == conta_id).first()
    if not conta:
        raise HTTPException(status_code=404, detail="Conta fixa não encontrada")

    update_data = data_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(conta, field, value)

    db.commit()
    db.refresh(conta)
    return conta


@router.put("/{conta_id}/pagar", response_model=ContaFixaResponse)
def toggle_pagar(conta_id: int, db: Session = Depends(get_db)):
    conta = db.query(ContaFixa).filter(ContaFixa.id == conta_id).first()
    if not conta:
        raise HTTPException(status_code=404, detail="Conta fixa não encontrada")

    conta.status = "Pendente" if conta.status == "Pago" else "Pago"
    db.commit()
    db.refresh(conta)
    return conta


@router.delete("/{conta_id}", status_code=204)
def deletar_conta_fixa(conta_id: int, db: Session = Depends(get_db)):
    conta = db.query(ContaFixa).filter(ContaFixa.id == conta_id).first()
    if not conta:
        raise HTTPException(status_code=404, detail="Conta fixa não encontrada")
    db.delete(conta)
    db.commit()


@router.post("/replicar", response_model=List[ContaFixaResponse])
def replicar_contas(data_in: ReplicarContasRequest, db: Session = Depends(get_db)):
    contas_origem = (
        db.query(ContaFixa)
        .filter(
            ContaFixa.mes_ref == data_in.mes_origem,
            ContaFixa.ano_ref == data_in.ano_origem,
        )
        .all()
    )

    if not contas_origem:
        raise HTTPException(
            status_code=404, detail="Nenhuma conta encontrada no mês de origem"
        )

    novas = []
    for conta in contas_origem:
        nova = ContaFixa(
            nome=conta.nome,
            categoria=conta.categoria,
            valor=conta.valor,
            dia_vencimento=conta.dia_vencimento,
            status="Pendente",
            mes_ref=data_in.mes_destino,
            ano_ref=data_in.ano_destino,
            observacao=conta.observacao,
        )
        db.add(nova)
        novas.append(nova)

    db.commit()
    for n in novas:
        db.refresh(n)
    return novas
