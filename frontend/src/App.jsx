import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import Dashboard from './pages/Dashboard'
import Receitas from './pages/Receitas'
import Despesas from './pages/Despesas'
import ContasFixas from './pages/ContasFixas'
import Investimentos from './pages/Investimentos'
import Reserva from './pages/Reserva'
import MEI from './pages/MEI'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/receitas" element={<Receitas />} />
          <Route path="/despesas" element={<Despesas />} />
          <Route path="/contas-fixas" element={<ContasFixas />} />
          <Route path="/investimentos" element={<Investimentos />} />
          <Route path="/reserva" element={<Reserva />} />
          <Route path="/mei" element={<MEI />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
