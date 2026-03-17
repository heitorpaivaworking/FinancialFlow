import pytest


class TestReceitas:
    def test_criar_receita(self, client):
        response = client.post(
            "/api/v1/receitas",
            json={
                "data": "2025-01-15",
                "fonte": "Trabalho Principal",
                "tipo": "Fixa",
                "descricao": "Salário Janeiro",
                "valor": 1800.00,
                "forma_pagamento": "PIX",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["valor"] == 1800.00
        assert data["fonte"] == "Trabalho Principal"
        assert data["mes"] == "Janeiro"
        assert data["ano"] == 2025
        assert "id" in data

    def test_listar_receitas(self, client):
        # Criar algumas receitas
        client.post("/api/v1/receitas", json={
            "data": "2025-02-05", "fonte": "Trabalho Principal",
            "tipo": "Fixa", "descricao": "Salário Fev",
            "valor": 1800, "forma_pagamento": "PIX",
        })
        client.post("/api/v1/receitas", json={
            "data": "2025-02-15", "fonte": "Freelance",
            "tipo": "Extra", "descricao": "Projeto X",
            "valor": 500, "forma_pagamento": "PIX",
        })

        response = client.get("/api/v1/receitas")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert data["total"] >= 2

    def test_filtrar_por_mes_ano(self, client):
        response = client.get("/api/v1/receitas?mes=Fevereiro&ano=2025")
        assert response.status_code == 200

    def test_obter_receita(self, client):
        # Criar
        create_resp = client.post("/api/v1/receitas", json={
            "data": "2025-03-10", "fonte": "Freelance",
            "tipo": "Extra", "descricao": "Projeto Y",
            "valor": 300, "forma_pagamento": "Transferência",
        })
        receita_id = create_resp.json()["id"]

        # Obter
        response = client.get(f"/api/v1/receitas/{receita_id}")
        assert response.status_code == 200
        assert response.json()["id"] == receita_id

    def test_atualizar_receita(self, client):
        create_resp = client.post("/api/v1/receitas", json={
            "data": "2025-03-15", "fonte": "Trabalho Principal",
            "tipo": "Fixa", "descricao": "Salário",
            "valor": 1800, "forma_pagamento": "PIX",
        })
        receita_id = create_resp.json()["id"]

        response = client.put(
            f"/api/v1/receitas/{receita_id}",
            json={"valor": 2000, "descricao": "Salário atualizado"},
        )
        assert response.status_code == 200
        assert response.json()["valor"] == 2000

    def test_deletar_receita(self, client):
        create_resp = client.post("/api/v1/receitas", json={
            "data": "2025-04-05", "fonte": "Extra",
            "tipo": "Extra", "descricao": "Bônus",
            "valor": 200, "forma_pagamento": "PIX",
        })
        receita_id = create_resp.json()["id"]

        response = client.delete(f"/api/v1/receitas/{receita_id}")
        assert response.status_code == 204

        # Verificar que não existe mais
        response = client.get(f"/api/v1/receitas/{receita_id}")
        assert response.status_code == 404

    def test_receita_not_found(self, client):
        response = client.get("/api/v1/receitas/99999")
        assert response.status_code == 404

    def test_valor_negativo_rejeitado(self, client):
        response = client.post("/api/v1/receitas", json={
            "data": "2025-01-01", "fonte": "Teste",
            "tipo": "Fixa", "descricao": "Valor negativo",
            "valor": -100, "forma_pagamento": "PIX",
        })
        assert response.status_code == 422

    def test_resumo_mensal(self, client):
        response = client.get("/api/v1/receitas/resumo/mensal?ano=2025")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_resumo_por_fonte(self, client):
        response = client.get("/api/v1/receitas/resumo/por-fonte?ano=2025")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
