from sqlalchemy import Column, Integer, String, Numeric, Date, Text

from app.database import Base
from app.models.base import TimestampMixin


class Investimento(TimestampMixin, Base):
    __tablename__ = "investimentos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    data = Column(Date, nullable=False)
    tipo_investimento = Column(String(50), nullable=False)
    categoria = Column(String(100), nullable=False)
    ativo = Column(String(100), nullable=False)
    valor_investido = Column(Numeric(12, 2), nullable=False)
    valor_atual = Column(Numeric(12, 2), nullable=False)
    quantidade = Column(Numeric(12, 4), nullable=True)
    corretora = Column(String(100), nullable=True)
    mes = Column(String(20), nullable=False)
    ano = Column(Integer, nullable=False)
    observacoes = Column(Text, nullable=True)

    @property
    def lucro(self):
        return float(self.valor_atual) - float(self.valor_investido)

    @property
    def rentabilidade_pct(self):
        if self.valor_investido and float(self.valor_investido) > 0:
            return self.lucro / float(self.valor_investido)
        return 0.0
