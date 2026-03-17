import { DollarSign, TrendingDown, Wallet, TrendingUp, Shield, Activity } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import { KPICard } from '../components/ui/Card'
import Card from '../components/ui/Card'
import Skeleton from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import Badge from '../components/ui/Badge'
import BarChart from '../components/charts/BarChart'
import DonutChart from '../components/charts/DonutChart'
import AreaChart from '../components/charts/AreaChart'
import useDashboard from '../hooks/useDashboard'
import { formatBRL, formatDate, trendInfo } from '../utils/formatters'

export default function Dashboard() {
  const { kpis, evolucao, categorias, patrimonio, transacoes, loading, error, fetch } = useDashboard()

  if (error) return <PageWrapper><ErrorState message={error} onRetry={fetch} /></PageWrapper>

  return (
    <PageWrapper>
      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Skeleton variant="kpi-card" count={6} />
        </div>
      ) : kpis ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <KPICard
            icon={DollarSign} label="Receitas" accent="#10D98A"
            value={formatBRL(kpis.receita_total)}
            trend={trendInfo(kpis.receita_total, kpis.receita_anterior)}
          />
          <KPICard
            icon={TrendingDown} label="Despesas" accent="#FF5757"
            value={formatBRL(kpis.despesa_total)}
            trend={trendInfo(kpis.despesa_total, kpis.despesa_anterior)}
          />
          <KPICard
            icon={Wallet} label="Saldo" accent="#4F8EF7"
            value={formatBRL(kpis.saldo)}
          />
          <KPICard
            icon={TrendingUp} label="Investido" accent="#FFB547"
            value={formatBRL(kpis.investido_total)}
          />
          <KPICard
            icon={Shield} label="Reserva" accent="#A78BFA"
            value={formatBRL(kpis.reserva_saldo)}
          />
          <KPICard
            icon={Activity} label="Score Saúde" accent="#22D3EE"
            value={`${kpis.score_saude}/100`}
          />
        </div>
      ) : null}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-white/60 mb-4">Receitas vs Despesas</h3>
          {loading ? <Skeleton variant="chart" /> : (
            <BarChart
              data={evolucao}
              bars={[
                { dataKey: 'receitas', name: 'Receitas', color: '#10D98A' },
                { dataKey: 'despesas', name: 'Despesas', color: '#FF5757' },
              ]}
            />
          )}
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-white/60 mb-4">Distribuição de Gastos</h3>
          {loading ? <Skeleton variant="chart" /> : (
            <DonutChart data={categorias} height={250} />
          )}
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <Card>
          <h3 className="text-sm font-semibold text-white/60 mb-4">Evolução do Patrimônio</h3>
          {loading ? <Skeleton variant="chart" /> : (
            <AreaChart
              data={patrimonio}
              areas={[
                { dataKey: 'saldo', name: 'Saldo', color: '#4F8EF7' },
                { dataKey: 'investimentos', name: 'Investimentos', color: '#FFB547' },
                { dataKey: 'reserva', name: 'Reserva', color: '#10D98A' },
              ]}
              stacked
              height={280}
            />
          )}
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <h3 className="text-sm font-semibold text-white/60 mb-4">Últimas Transações</h3>
        {loading ? (
          <Skeleton variant="table-row" count={5} />
        ) : (
          <div className="space-y-1">
            {transacoes.map((t) => (
              <div
                key={`${t.tipo}-${t.id}`}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    color={t.tipo === 'receita' ? 'success' : 'danger'}
                    size="sm"
                    dot
                  >
                    {t.tipo === 'receita' ? 'Receita' : 'Despesa'}
                  </Badge>
                  <div>
                    <p className="text-sm text-white/80">{t.descricao}</p>
                    <p className="text-xs text-white/30">{t.categoria} &middot; {formatDate(t.data)}</p>
                  </div>
                </div>
                <span className={`font-mono text-sm font-medium ${
                  t.tipo === 'receita' ? 'text-accent-green' : 'text-accent-red'
                }`}>
                  {t.tipo === 'receita' ? '+' : '-'}{formatBRL(t.valor)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </PageWrapper>
  )
}
