from sqlalchemy import Column, Integer, String, Numeric, Text

from app.database import Base
from app.models.base import TimestampMixin


class ContaFixa(TimestampMixin, Base):
    __tablename__ = "contas_fixas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(100), nullable=False)
    categoria = Column(String(100), nullable=False)
    valor = Column(Numeric(12, 2), nullable=False)
    dia_vencimento = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False, default="Pendente")
    mes_ref = Column(String(20), nullable=False)
    ano_ref = Column(Integer, nullable=False)
    observacao = Column(Text, nullable=True)
