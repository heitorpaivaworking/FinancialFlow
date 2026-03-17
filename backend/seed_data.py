"""
Popula o banco com dados realistas dos últimos 8 meses.
Uso: python seed_data.py [--force]
"""
import argparse
import random
import sys
import os
from datetime import date
from decimal import Decimal

from dateutil.relativedelta import relativedelta

# Adiciona o diretório ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.database import SessionLocal
from app.models.receita import Receita
from app.models.despesa import Despesa
from app.models.investimento import Investimento
from app.models.conta_fixa import ContaFixa
from app.models.reserva import ReservaEmergencia
from app.models.mei import MEILancamento

MESES_PT = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

CLIENTES_MEI = [
    "Empresa Alpha", "Startup Beta", "João Silva", "Maria Oliveira",
    "Tech Corp", "Design Studio", "Agência Digital", "Consultoria XYZ",
]

SERVICOS_MEI = [
    "Desenvolvimento Web", "Consultoria", "Design", "Manutenção",
    "Suporte Técnico", "Treinamento", "Integração de Sistemas",
    "Desenvolvimento Mobile",
]

ATIVOS = {
    "Ação": ["PETR4", "VALE3", "ITUB4", "BBDC4", "WEGE3"],
    "ETF": ["BOVA11", "IVVB11", "HASH11", "SMAL11"],
    "FII": ["HGLG11", "XPML11", "MXRF11", "KNRI11"],
    "Tesouro Direto": ["SELIC 2026", "IPCA+ 2029", "Prefixado 2027"],
    "CDB": ["CDB BB 110%", "CDB Inter 120%", "CDB Nubank 100%"],
    "Cripto": ["BTC", "ETH", "SOL"],
}

CORRETORAS = ["Nubank", "XP", "Rico", "Clear", "Inter", "BTG"]


def safe_day(year: int, month: int, day: int) -> date:
    """Retorna uma data válida, ajustando o dia se necessário."""
    import calendar
    max_day = calendar.monthrange(year, month)[1]
    return date(year, month, min(day, max_day))


def seed(force: bool = False):
    db = SessionLocal()

    try:
        # Verifica se já existem dados
        existing = db.query(Receita).first()
        if existing and not force:
            print("ℹ️  Dados já existem. Use --force para recriar.")
            return

        if force:
            print("🗑️  Limpando dados existentes...")
            db.execute(text("DELETE FROM mei_lancamentos"))
            db.execute(text("DELETE FROM reserva_config"))
            db.execute(text("DELETE FROM reserva_emergencia"))
            db.execute(text("DELETE FROM investimentos"))
            db.execute(text("DELETE FROM contas_fixas"))
            db.execute(text("DELETE FROM despesas"))
            db.execute(text("DELETE FROM receitas"))
            db.commit()

        hoje = date.today()
        meses = [hoje - relativedelta(months=i) for i in range(7, -1, -1)]

        print("🌱 Gerando dados para 8 meses...")

        for mes_date in meses:
            mes_nome = MESES_PT[mes_date.month - 1]
            ano = mes_date.year

            # ── RECEITAS ──────────────────────────────────────
            # Fixas mensais
            db.add(Receita(
                data=safe_day(ano, mes_date.month, 5),
                fonte="Trabalho Principal", tipo="Fixa",
                descricao="Salário", valor=Decimal("1800.00"),
                forma_pagamento="PIX", mes=mes_nome, ano=ano,
            ))
            db.add(Receita(
                data=safe_day(ano, mes_date.month, 10),
                fonte="Trabalho Secundário", tipo="Fixa",
                descricao="Pagamento quinzenal", valor=Decimal("1000.00"),
                forma_pagamento="Transferência", mes=mes_nome, ano=ano,
            ))

            # Extras
            if random.random() > 0.3:
                db.add(Receita(
                    data=safe_day(ano, mes_date.month, random.randint(1, 28)),
                    fonte="Extra Trabalho Principal", tipo="Extra",
                    descricao="Hora extra",
                    valor=Decimal(str(random.randint(150, 500))),
                    forma_pagamento="PIX", mes=mes_nome, ano=ano,
                ))

            if random.random() > 0.5:
                db.add(Receita(
                    data=safe_day(ano, mes_date.month, random.randint(1, 28)),
                    fonte="Freelance", tipo="Extra",
                    descricao="Projeto pontual",
                    valor=Decimal(str(random.randint(200, 800))),
                    forma_pagamento="PIX", mes=mes_nome, ano=ano,
                ))

            # ── DESPESAS ──────────────────────────────────────
            despesas_mes = [
                ("Moradia", "Aluguel", "Fixa", 800, "Transferência"),
                ("Moradia", "Internet", "Fixa", 99.90, "Débito Automático"),
                ("Moradia", "Luz", "Variável", random.randint(60, 120), "Boleto"),
                ("Moradia", "Água", "Fixa", 45, "Boleto"),
                ("Alimentação", "Supermercado", "Variável", random.randint(350, 550), "Cartão Débito"),
                ("Alimentação", "iFood", "Variável", random.randint(80, 200), "Cartão Crédito"),
                ("Transporte", "Combustível", "Variável", random.randint(100, 200), "PIX"),
                ("Saúde", "Academia", "Fixa", 89.90, "Débito Automático"),
                ("Assinaturas", "Netflix", "Fixa", 39.90, "Cartão Crédito"),
                ("Assinaturas", "Spotify", "Fixa", 21.90, "Cartão Crédito"),
                ("Lazer", "Cinema", "Variável", random.randint(40, 80), "PIX"),
                ("Educação", "Curso Online", "Fixa", 49.90, "Cartão Crédito"),
            ]

            # Adicionar extras aleatórios
            if random.random() > 0.4:
                despesas_mes.append(
                    ("Tecnologia", "Acessórios", "Variável", random.randint(50, 300), "PIX")
                )
            if random.random() > 0.5:
                despesas_mes.append(
                    ("Saúde", "Farmácia", "Variável", random.randint(30, 100), "Cartão Débito")
                )
            if random.random() > 0.6:
                despesas_mes.append(
                    ("Outros", "Vestuário", "Variável", random.randint(80, 250), "Cartão Crédito")
                )

            for cat, subcat, tipo, valor, pgto in despesas_mes:
                db.add(Despesa(
                    data=safe_day(ano, mes_date.month, random.randint(1, 28)),
                    categoria=cat, subcategoria=subcat,
                    descricao=f"{subcat} {mes_nome}",
                    tipo=tipo, forma_pagamento=pgto,
                    valor=Decimal(str(round(valor, 2))),
                    mes=mes_nome, ano=ano,
                ))

            # ── INVESTIMENTOS ─────────────────────────────────
            if random.random() > 0.2:
                tipo_inv = random.choice(list(ATIVOS.keys()))
                ativo = random.choice(ATIVOS[tipo_inv])
                valor_inv = random.choice([100, 150, 200, 250, 300, 500])
                rentab = 1 + random.uniform(-0.05, 0.15)
                categoria = "Renda Variável" if tipo_inv in ("Ação", "ETF", "FII", "Cripto") else "Renda Fixa"

                db.add(Investimento(
                    data=safe_day(ano, mes_date.month, random.randint(1, 20)),
                    tipo_investimento=tipo_inv,
                    categoria=categoria,
                    ativo=ativo,
                    valor_investido=Decimal(str(valor_inv)),
                    valor_atual=Decimal(str(round(valor_inv * rentab, 2))),
                    quantidade=Decimal(str(round(random.uniform(1, 100), 4))) if tipo_inv in ("Ação", "ETF", "FII", "Cripto") else None,
                    corretora=random.choice(CORRETORAS),
                    mes=mes_nome, ano=ano,
                ))

            # Segundo investimento em alguns meses
            if random.random() > 0.5:
                tipo_inv = random.choice(["Tesouro Direto", "CDB"])
                ativo = random.choice(ATIVOS[tipo_inv])
                valor_inv = random.choice([200, 300, 500])
                rentab = 1 + random.uniform(0.005, 0.012)

                db.add(Investimento(
                    data=safe_day(ano, mes_date.month, random.randint(1, 20)),
                    tipo_investimento=tipo_inv,
                    categoria="Renda Fixa",
                    ativo=ativo,
                    valor_investido=Decimal(str(valor_inv)),
                    valor_atual=Decimal(str(round(valor_inv * rentab, 2))),
                    corretora=random.choice(CORRETORAS),
                    mes=mes_nome, ano=ano,
                ))

            # ── RESERVA ───────────────────────────────────────
            aporte = random.choice([200, 250, 300, 350, 400])
            db.add(ReservaEmergencia(
                data=safe_day(ano, mes_date.month, random.randint(1, 10)),
                descricao=f"Aporte {mes_nome}/{ano}",
                valor=Decimal(str(aporte)),
            ))

            # ── MEI ───────────────────────────────────────────
            n_servicos = random.randint(0, 4)
            for _ in range(n_servicos):
                valor_bruto = Decimal(str(random.randint(300, 2000)))
                aliquota = Decimal("0.06")
                imposto = round(valor_bruto * aliquota, 2)
                valor_liquido = valor_bruto - imposto

                db.add(MEILancamento(
                    data=safe_day(ano, mes_date.month, random.randint(1, 28)),
                    cliente=random.choice(CLIENTES_MEI),
                    servico=random.choice(SERVICOS_MEI),
                    valor_bruto=valor_bruto,
                    aliquota_imposto=aliquota,
                    imposto=imposto,
                    valor_liquido=valor_liquido,
                    nota_fiscal=random.choice([True, False]),
                    mes=mes_nome, ano=ano,
                ))

        # ── CONTAS FIXAS DO MÊS ATUAL ────────────────────────
        mes_atual = MESES_PT[hoje.month - 1]
        contas = [
            ("Aluguel", "Moradia", 800, 10, "Pago"),
            ("Internet", "Moradia", 99.90, 15, "Pago"),
            ("Luz", "Moradia", 95, 20, "Pendente"),
            ("Água", "Moradia", 45, 22, "Pendente"),
            ("Academia", "Saúde", 89.90, 5, "Pago"),
            ("Netflix", "Assinaturas", 39.90, 8, "Pago"),
            ("Spotify", "Assinaturas", 21.90, 8, "Pago"),
            ("Curso Online", "Educação", 49.90, 25, "Pendente"),
            ("Celular", "Tecnologia", 59.90, 18, "Pendente"),
        ]

        for nome, cat, valor, dia, status in contas:
            db.add(ContaFixa(
                nome=nome, categoria=cat,
                valor=Decimal(str(valor)),
                dia_vencimento=dia, status=status,
                mes_ref=mes_atual, ano_ref=hoje.year,
            ))

        db.commit()
        print(f"✅ Seed concluído: 8 meses de dados gerados com sucesso!")

    except Exception as e:
        db.rollback()
        print(f"❌ Erro no seed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed do banco de dados FinanceFlow")
    parser.add_argument("--force", action="store_true", help="Limpa e recria todos os dados")
    args = parser.parse_args()
    seed(force=args.force)
