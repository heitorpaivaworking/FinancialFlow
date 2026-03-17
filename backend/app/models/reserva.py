from sqlalchemy import Column, Integer, String, Numeric, Date, Text

from app.database import Base
from app.models.base import TimestampMixin


class ReservaConfig(Base):
    __tablename__ = "reserva_config"

    id = Column(Integer, primary_key=True, autoincrement=True)
    meta = Column(Numeric(12, 2), nullable=False, default=12000)
    meses_meta = Column(Integer, nullable=False, default=6)


class ReservaEmergencia(TimestampMixin, Base):
    __tablename__ = "reserva_emergencia"

    id = Column(Integer, primary_key=True, autoincrement=True)
    data = Column(Date, nullable=False)
    descricao = Column(String(255), nullable=False)
    valor = Column(Numeric(12, 2), nullable=False)  # positivo=aporte, negativo=retirada
    observacoes = Column(Text, nullable=True)
