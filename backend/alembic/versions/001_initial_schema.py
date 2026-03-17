"""Initial schema - all tables

Revision ID: 001_initial
Revises:
Create Date: 2025-01-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Receitas
    op.create_table(
        "receitas",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("data", sa.Date(), nullable=False),
        sa.Column("fonte", sa.String(100), nullable=False),
        sa.Column("tipo", sa.String(50), nullable=False),
        sa.Column("descricao", sa.String(255), nullable=False),
        sa.Column("valor", sa.Numeric(12, 2), nullable=False),
        sa.Column("forma_pagamento", sa.String(50), nullable=False),
        sa.Column("mes", sa.String(20), nullable=False),
        sa.Column("ano", sa.Integer(), nullable=False),
        sa.Column("observacoes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_receitas_mes_ano", "receitas", ["mes", "ano"])

    # Despesas
    op.create_table(
        "despesas",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("data", sa.Date(), nullable=False),
        sa.Column("categoria", sa.String(100), nullable=False),
        sa.Column("subcategoria", sa.String(100), nullable=True),
        sa.Column("descricao", sa.String(255), nullable=False),
        sa.Column("tipo", sa.String(50), nullable=False),
        sa.Column("forma_pagamento", sa.String(50), nullable=False),
        sa.Column("valor", sa.Numeric(12, 2), nullable=False),
        sa.Column("mes", sa.String(20), nullable=False),
        sa.Column("ano", sa.Integer(), nullable=False),
        sa.Column("observacoes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_despesas_mes_ano", "despesas", ["mes", "ano"])
    op.create_index("ix_despesas_categoria", "despesas", ["categoria"])

    # Contas Fixas
    op.create_table(
        "contas_fixas",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("nome", sa.String(100), nullable=False),
        sa.Column("categoria", sa.String(100), nullable=False),
        sa.Column("valor", sa.Numeric(12, 2), nullable=False),
        sa.Column("dia_vencimento", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="Pendente"),
        sa.Column("mes_ref", sa.String(20), nullable=False),
        sa.Column("ano_ref", sa.Integer(), nullable=False),
        sa.Column("observacao", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_contas_fixas_mes_ano", "contas_fixas", ["mes_ref", "ano_ref"])

    # Investimentos
    op.create_table(
        "investimentos",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("data", sa.Date(), nullable=False),
        sa.Column("tipo_investimento", sa.String(50), nullable=False),
        sa.Column("categoria", sa.String(100), nullable=False),
        sa.Column("ativo", sa.String(100), nullable=False),
        sa.Column("valor_investido", sa.Numeric(12, 2), nullable=False),
        sa.Column("valor_atual", sa.Numeric(12, 2), nullable=False),
        sa.Column("quantidade", sa.Numeric(12, 4), nullable=True),
        sa.Column("corretora", sa.String(100), nullable=True),
        sa.Column("mes", sa.String(20), nullable=False),
        sa.Column("ano", sa.Integer(), nullable=False),
        sa.Column("observacoes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_investimentos_mes_ano", "investimentos", ["mes", "ano"])

    # Reserva de Emergência
    op.create_table(
        "reserva_emergencia",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("data", sa.Date(), nullable=False),
        sa.Column("descricao", sa.String(255), nullable=False),
        sa.Column("valor", sa.Numeric(12, 2), nullable=False),
        sa.Column("meta", sa.Numeric(12, 2), nullable=False, server_default="12000"),
        sa.Column("meses_meta", sa.Integer(), nullable=False, server_default="6"),
        sa.Column("observacoes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    # MEI Lançamentos
    op.create_table(
        "mei_lancamentos",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("data", sa.Date(), nullable=False),
        sa.Column("cliente", sa.String(200), nullable=False),
        sa.Column("servico", sa.String(200), nullable=False),
        sa.Column("valor_bruto", sa.Numeric(12, 2), nullable=False),
        sa.Column("aliquota_imposto", sa.Numeric(5, 4), nullable=False, server_default="0.06"),
        sa.Column("imposto", sa.Numeric(12, 2), nullable=False),
        sa.Column("valor_liquido", sa.Numeric(12, 2), nullable=False),
        sa.Column("nota_fiscal", sa.Boolean(), server_default="false"),
        sa.Column("mes", sa.String(20), nullable=False),
        sa.Column("ano", sa.Integer(), nullable=False),
        sa.Column("observacoes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_mei_lancamentos_mes_ano", "mei_lancamentos", ["mes", "ano"])


def downgrade() -> None:
    op.drop_table("mei_lancamentos")
    op.drop_table("reserva_emergencia")
    op.drop_table("investimentos")
    op.drop_table("contas_fixas")
    op.drop_table("despesas")
    op.drop_table("receitas")
