import React, { useState, useEffect } from 'react'
import { 
  DollarSign, TrendingUp, AlertCircle, Users, 
  Clock, CheckCircle, RefreshCw, Activity, PieChart,
  Zap, ArrowUpRight, ArrowDownRight, Sparkles
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart as RePieChart,
  Pie, Cell, BarChart, Bar
} from 'recharts'
import { mockMetrics, mockTransactions } from '../data/mockTransactions'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

export const Dashboard = () => {
  const [metrics, setMetrics] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setMetrics(mockMetrics)
      setTransactions(mockTransactions.slice(0, 5))
      setLoading(false)
    }, 600)
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  const priorityData = [
    { name: 'Critical', value: mockTransactions.filter(t => t.priority === 'critical').length, color: '#ef4444' },
    { name: 'High', value: mockTransactions.filter(t => t.priority === 'high').length, color: '#f59e0b' },
    { name: 'Medium', value: mockTransactions.filter(t => t.priority === 'medium').length, color: '#3b82f6' },
    { name: 'Low', value: mockTransactions.filter(t => t.priority === 'low').length, color: '#9ca3af' },
  ]

  const failureData = mockTransactions.reduce((acc, tx) => {
    const reason = tx.failureReason.replace(/_/g, ' ')
    acc[reason] = (acc[reason] || 0) + 1
    return acc
  }, {})
  const failureChartData = Object.entries(failureData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI-powered revenue recovery overview
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs md:text-sm rounded-full flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Online
          </span>
          <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs md:text-sm rounded-full flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Updated: Now
          </span>
          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Revenue at Risk"
          value={`₹${metrics.totalAtRisk.toLocaleString()}`}
          change="+12%"
          icon={DollarSign}
          trend="up"
          color="blue"
        />
        <StatCard
          title="Recovered Amount"
          value={`₹${metrics.recovered.toLocaleString()}`}
          change={`${metrics.recoveryRate}% rate`}
          icon={TrendingUp}
          trend="up"
          color="green"
        />
        <StatCard
          title="Recovery Rate"
          value={`${metrics.recoveryRate}%`}
          change="+2.3%"
          icon={AlertCircle}
          trend="up"
          color="yellow"
        />
        <StatCard
          title="Active Cases"
          value={metrics.activeCases}
          change="-8%"
          icon={Users}
          trend="down"
          color="purple"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recovery Trend */}
        <div className="card lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Recovery Trend
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Daily recovery vs at-risk amount
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-blue-600 rounded-full"></span>
                <span className="text-gray-600 dark:text-gray-400">Recovered</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-red-400 rounded-full"></span>
                <span className="text-gray-600 dark:text-gray-400">At Risk</span>
              </span>
            </div>
          </div>
          <div className="h-[240px] md:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.timeline} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="recoveredGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="atRiskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" strokeOpacity={0.5} />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, '']}
                />
                <Area 
                  type="monotone" 
                  dataKey="recovered" 
                  stroke="#3b82f6" 
                  strokeWidth={2.5}
                  fill="url(#recoveredGrad)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="atRisk" 
                  stroke="#ef4444" 
                  strokeWidth={2.5}
                  fill="url(#atRiskGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Recovery breakdown
              </p>
            </div>
            <PieChart className="w-4 h-4 text-gray-400" />
          </div>
          <div className="h-[220px] md:h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={metrics.actionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {metrics.actionDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    border: '1px solid #e5e7eb',
                    padding: '12px'
                  }}
                  formatter={(value) => `${value}%`}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
            {metrics.actionDistribution.map((item, index) => (
              <span key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{item.value}%</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Priority Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Priority Distribution
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Cases by priority level
              </p>
            </div>
            <Activity className="w-4 h-4 text-gray-400" />
          </div>
          <div className="h-[200px] md:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={priorityData} 
                layout="vertical"
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                barSize={16}
              >
                <XAxis type="number" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} width={60} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    border: '1px solid #e5e7eb',
                    padding: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {priorityData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Failure Reasons */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Top Failure Reasons
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Most common payment failures
              </p>
            </div>
            <AlertCircle className="w-4 h-4 text-gray-400" />
          </div>
          <div className="h-[200px] md:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={failureChartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                barSize={20}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    border: '1px solid #e5e7eb',
                    padding: '12px'
                  }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Recent Failed Transactions
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Latest payment failures needing attention
            </p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Reason</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Priority</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={tx.id} className={`border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-gray-50/30 dark:bg-gray-900/20'}`}>
                  <td className="py-3 px-4 font-mono text-xs font-medium text-gray-500 dark:text-gray-400">{tx.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">{tx.customerName}</td>
                  <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">₹{tx.amount}</td>
                  <td className="py-3 px-4">
                    <span className="badge badge-warning capitalize">
                      {tx.failureReason.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            tx.recoveryScore >= 70 ? 'bg-green-500' :
                            tx.recoveryScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${tx.recoveryScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-8">{tx.recoveryScore}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge capitalize ${
                      tx.priority === 'critical' ? 'badge-danger' :
                      tx.priority === 'high' ? 'badge-warning' :
                      tx.priority === 'medium' ? 'badge-info' :
                      'badge'
                    }`}>
                      {tx.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="badge badge-info capitalize">
                      {tx.recommendedAction.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Stat Card Component
// ============================================

function StatCard({ title, value, change, icon: Icon, trend, color }) {
  const isPositive = trend === 'up'
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
  }
  
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-lg shadow-${color}-500/20`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2">
        <span className={`text-xs font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {isPositive ? <ArrowUpRight className="inline w-3 h-3" /> : <ArrowDownRight className="inline w-3 h-3" />}
          {change}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">vs last week</span>
      </div>
    </div>
  )
}

// ============================================
// Skeleton Loader
// ============================================

function DashboardSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg mt-2"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full"></div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full"></div>
        </div>
      </div>
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl"></div>
        ))}
      </div>
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 h-72 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl"></div>
        <div className="h-72 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl"></div>
      </div>
      <div className="h-80 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl"></div>
    </div>
  )
}