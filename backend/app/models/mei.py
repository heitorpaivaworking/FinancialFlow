from sqlalchemy import Column, Integer, String, Numeric, Date, Boolean, Text

from app.database import Base
from app.models.base import TimestampMixin


class MEILancamento(TimestampMixin, Base):
    __tablename__ = "mei_lancamentos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    data = Column(Date, nullable=False)
    cliente = Column(String(200), nullable=False)
    servico = Column(String(200), nullable=False)
    valor_bruto = Column(Numeric(12, 2), nullable=False)
    aliquota_imposto = Column(Numeric(5, 4), nullable=False, default=0.06)
    imposto = Column(Numeric(12, 2), nullable=False)
    valor_liquido = Column(Numeric(12, 2), nullable=False)
    nota_fiscal = Column(Boolean, default=False)
    mes = Column(String(20), nullable=False)
    ano = Column(Integer, nullable=False)
    observacoes = Column(Text, nullable=True)
