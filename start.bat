@echo off
echo 🚀 Iniciando FinanceFlow (modo local sem Docker)...
echo.

REM Backend
echo 📦 Configurando backend...
cd backend

if not exist "venv" (
    python -m venv venv
)

call venv\Scripts\activate.bat
pip install -q -r requirements.txt

echo 🗃️  Aplicando migrations...
alembic upgrade head

echo 🔧 Iniciando API na porta 9000...
start /B uvicorn app.main:app --host 0.0.0.0 --port 9000 --reload

cd ..

REM Frontend
echo 🎨 Configurando frontend...
cd frontend

if not exist "node_modules" (
    call npm install
)

echo 🖥️  Iniciando frontend na porta 5173...
start /B npm run dev

cd ..

echo.
echo ✅ FinanceFlow rodando!
echo    🖥️  Frontend: http://localhost:5173
echo    🔧 API:      http://localhost:9000
echo    📚 Docs:     http://localhost:9000/docs
echo.
echo Pressione Ctrl+C para parar.
pause
