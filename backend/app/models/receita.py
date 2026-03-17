from sqlalchemy import Column, Integer, String, Numeric, Date, Text

from app.database import Base
from app.models.base import TimestampMixin


class Receita(TimestampMixin, Base):
    __tablename__ = "receitas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    data = Column(Date, nullable=False)
    fonte = Column(String(100), nullable=False)
    tipo = Column(String(50), nullable=False)
    descricao = Column(String(255), nullable=False)
    valor = Column(Numeric(12, 2), nullable=False)
    forma_pagamento = Column(String(50), nullable=False)
    mes = Column(String(20), nullable=False)
    ano = Column(Integer, nullable=False)
    observacoes = Column(Text, nullable=True)
