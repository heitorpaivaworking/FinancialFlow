import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import useAppStore from '../../store/useAppStore'
import axios from 'axios'

export default function RootLayout() {
  const { sidebarCollapsed, setApiOnline } = useAppStore()
  const navigate = useNavigate()

  // Health check ping
  useEffect(() => {
    const checkApi = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '/api'
        await axios.get(`${apiUrl}/../health`, { timeout: 5000 })
        setApiOnline(true)
      } catch {
        setApiOnline(false)
      }
    }

    checkApi()
    const interval = setInterval(checkApi, 30000)
    return () => clearInterval(interval)
  }, [setApiOnline])

  const handleNewEntry = (type) => {
    const routes = {
      receita: '/receitas',
      despesa: '/despesas',
      investimento: '/investimentos',
      mei: '/mei',
    }
    navigate(routes[type] || '/', { state: { openNew: true } })
  }

  return (
    <div className="min-h-screen bg-base bg-gradient-mesh">
      <Sidebar />
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-[260px]'
        }`}
      >
        <Header onNewEntry={handleNewEntry} />
        <main className="min-h-[calc(100vh-60px)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
