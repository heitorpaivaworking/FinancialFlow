import pytest


class TestDashboard:
    def _seed_data(self, client):
        """Cria dados básicos para testar o dashboard."""
        client.post("/api/v1/receitas", json={
            "data": "2025-01-05", "fonte": "Trabalho Principal",
            "tipo": "Fixa", "descricao": "Salário",
            "valor": 1800, "forma_pagamento": "PIX",
        })
        client.post("/api/v1/despesas", json={
            "data": "2025-01-10", "categoria": "Moradia",
            "descricao": "Aluguel", "tipo": "Fixa",
            "forma_pagamento": "Transferência", "valor": 800,
        })
        client.post("/api/v1/despesas", json={
            "data": "2025-01-15", "categoria": "Alimentação",
            "descricao": "Supermercado", "tipo": "Variável",
            "forma_pagamento": "Cartão Débito", "valor": 400,
        })

    def test_kpis(self, client):
        self._seed_data(client)
        response = client.get("/api/v1/dashboard/kpis?mes=Janeiro&ano=2025")
        assert response.status_code == 200
        data = response.json()
        assert "receita_total" in data
        assert "despesa_total" in data
        assert "saldo" in data
        assert "score_saude" in data

    def test_evolucao_mensal(self, client):
        self._seed_data(client)
        response = client.get("/api/v1/dashboard/evolucao-mensal?ano=2025")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_gastos_categorias(self, client):
        self._seed_data(client)
        response = client.get("/api/v1/dashboard/gastos-categorias?mes=Janeiro&ano=2025")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        if data:
            assert "categoria" in data[0]
            assert "total" in data[0]
            assert "percentual" in data[0]

    def test_fluxo_caixa(self, client):
        self._seed_data(client)
        response = client.get("/api/v1/dashboard/fluxo-caixa?ano=2025")
        assert response.status_code == 200

    def test_patrimonio(self, client):
        response = client.get("/api/v1/dashboard/patrimonio?ano=2025")
        assert response.status_code == 200

    def test_saude_financeira(self, client):
        self._seed_data(client)
        response = client.get("/api/v1/dashboard/saude-financeira?mes=Janeiro&ano=2025")
        assert response.status_code == 200
        data = response.json()
        assert "score" in data
        assert "taxa_poupanca" in data

    def test_ultimas_transacoes(self, client):
        self._seed_data(client)
        response = client.get("/api/v1/dashboard/ultimas-transacoes?limit=5")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) <= 5

    def test_health(self, client):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
