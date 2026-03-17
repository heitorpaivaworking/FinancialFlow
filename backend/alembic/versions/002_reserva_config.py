"""Add reserva_config table and remove meta columns from reserva_emergencia

Revision ID: 002_reserva_config
Revises: 001_initial
Create Date: 2026-03-16 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "002_reserva_config"
down_revision: Union[str, None] = "001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Criar tabela de configuração da reserva
    op.create_table(
        "reserva_config",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("meta", sa.Numeric(12, 2), nullable=False, server_default="12000"),
        sa.Column("meses_meta", sa.Integer(), nullable=False, server_default="6"),
        sa.PrimaryKeyConstraint("id"),
    )

    # Remover colunas meta e meses_meta da tabela de aportes
    op.drop_column("reserva_emergencia", "meta")
    op.drop_column("reserva_emergencia", "meses_meta")


def downgrade() -> None:
    op.add_column(
        "reserva_emergencia",
        sa.Column("meta", sa.Numeric(12, 2), nullable=False, server_default="12000"),
    )
    op.add_column(
        "reserva_emergencia",
        sa.Column("meses_meta", sa.Integer(), nullable=False, server_default="6"),
    )
    op.drop_table("reserva_config")
