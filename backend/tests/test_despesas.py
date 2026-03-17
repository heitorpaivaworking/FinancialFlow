import pytest


class TestDespesas:
    def test_criar_despesa(self, client):
        response = client.post(
            "/api/v1/despesas",
            json={
                "data": "2025-01-20",
                "categoria": "Alimentação",
                "subcategoria": "Supermercado",
                "descricao": "Compras do mês",
                "tipo": "Variável",
                "forma_pagamento": "Cartão Débito",
                "valor": 450.00,
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["valor"] == 450.00
        assert data["categoria"] == "Alimentação"
        assert data["mes"] == "Janeiro"
        assert data["ano"] == 2025

    def test_listar_despesas(self, client):
        client.post("/api/v1/despesas", json={
            "data": "2025-02-10", "categoria": "Moradia",
            "descricao": "Aluguel", "tipo": "Fixa",
            "forma_pagamento": "Transferência", "valor": 800,
        })

        response = client.get("/api/v1/despesas")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert data["total"] >= 1

    def test_filtrar_por_categoria(self, client):
        response = client.get("/api/v1/despesas?categoria=Alimentação")
        assert response.status_code == 200

    def test_atualizar_despesa(self, client):
        create_resp = client.post("/api/v1/despesas", json={
            "data": "2025-03-15", "categoria": "Lazer",
            "descricao": "Cinema", "tipo": "Variável",
            "forma_pagamento": "PIX", "valor": 60,
        })
        despesa_id = create_resp.json()["id"]

        response = client.put(
            f"/api/v1/despesas/{despesa_id}",
            json={"valor": 80},
        )
        assert response.status_code == 200
        assert response.json()["valor"] == 80

    def test_deletar_despesa(self, client):
        create_resp = client.post("/api/v1/despesas", json={
            "data": "2025-04-01", "categoria": "Outros",
            "descricao": "Teste delete", "tipo": "Variável",
            "forma_pagamento": "Dinheiro", "valor": 30,
        })
        despesa_id = create_resp.json()["id"]

        response = client.delete(f"/api/v1/despesas/{despesa_id}")
        assert response.status_code == 204

    def test_valor_negativo_rejeitado(self, client):
        response = client.post("/api/v1/despesas", json={
            "data": "2025-01-01", "categoria": "Teste",
            "descricao": "Negativo", "tipo": "Fixa",
            "forma_pagamento": "PIX", "valor": -50,
        })
        assert response.status_code == 422

    def test_resumo_mensal(self, client):
        response = client.get("/api/v1/despesas/resumo/mensal?ano=2025")
        assert response.status_code == 200

    def test_resumo_categorias(self, client):
        response = client.get("/api/v1/despesas/resumo/categorias?ano=2025")
        assert response.status_code == 200
