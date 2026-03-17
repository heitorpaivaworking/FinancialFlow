#!/bin/bash
set -e

echo "🚀 Iniciando FinanceFlow (modo local sem Docker)..."
echo ""

# Verifica dependências
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 não encontrado"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js não encontrado"; exit 1; }

# Backend
echo "📦 Configurando backend..."
cd backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

echo "🗃️  Aplicando migrations..."
alembic upgrade head

echo "🔧 Iniciando API na porta 9000..."
uvicorn app.main:app --host 0.0.0.0 --port 9000 --reload &
BACKEND_PID=$!

cd ..

# Frontend
echo "🎨 Configurando frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    npm install
fi

echo "🖥️  Iniciando frontend na porta 5173..."
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "✅ FinanceFlow rodando!"
echo "   🖥️  Frontend: http://localhost:5173"
echo "   🔧 API:      http://localhost:9000"
echo "   📚 Docs:     http://localhost:9000/docs"
echo ""
echo "Pressione Ctrl+C para parar."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
