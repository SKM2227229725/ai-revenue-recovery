import React, { useState, useEffect } from 'react'
import { 
  Play, RefreshCw, TrendingUp, AlertTriangle, 
  CheckCircle, Clock, BarChart3 
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { mockTransactions, mockMetrics } from '../data/mockTransactions'

export const RecoveryCenter = () => {
  const [transactions, setTransactions] = useState([])
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      const failed = mockTransactions.filter(t => t.status === 'failed')
      setTransactions(failed)
      setLoading(false)
    }, 500)
  }, [])

  const handleRunRecovery = () => {
    setRunning(true)
    setTimeout(() => {
      const recovered = Math.floor(transactions.length * 0.35)
      setResults({
        total: transactions.length,
        recovered: recovered,
        failed: transactions.length - recovered,
        amountRecovered: transactions.reduce((acc, tx) => acc + tx.amount, 0) * 0.35,
        recoveryRate: 35.2,
        timeTaken: '2.4s'
      })
      setRunning(false)
    }, 2000)
  }

  // Cumulative recovery data for chart
  const recoveryTimeline = [
    { name: 'Week 1', recovered: 4200, target: 8000 },
    { name: 'Week 2', recovered: 6800, target: 12000 },
    { name: 'Week 3', recovered: 9200, target: 15000 },
    { name: 'Week 4', recovered: 13500, target: 18000 },
    { name: 'Week 5', recovered: 16800, target: 22000 },
    { name: 'Week 6', recovered: 22179, target: 25000 },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recovery Center</h1>
          <p className="text-gray-500">AI-powered recovery engine with real-time analytics</p>
        </div>
        <button
          onClick={handleRunRecovery}
          disabled={running}
          className={`
            px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-200
            ${running 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:scale-[1.02]'}
          `}
        >
          {running ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Run Recovery Batch
            </>
          )}
        </button>
      </div>

      {/* Results Cards */}
      {results ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="card border-l-4 border-l-blue-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Cases</p>
                <p className="text-2xl font-bold">{results.total}</p>
              </div>
            </div>
          </div>
          <div className="card border-l-4 border-l-green-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Recovered</p>
                <p className="text-2xl font-bold text-green-600">{results.recovered}</p>
              </div>
            </div>
          </div>
          <div className="card border-l-4 border-l-red-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Failed</p>
                <p className="text-2xl font-bold text-red-600">{results.failed}</p>
              </div>
            </div>
          </div>
          <div className="card border-l-4 border-l-yellow-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount Recovered</p>
                <p className="text-2xl font-bold">₹{Math.round(results.amountRecovered).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="card border-l-4 border-l-purple-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Time Taken</p>
                <p className="text-2xl font-bold">{results.timeTaken}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border-2 border-dashed border-gray-300 text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Click "Run Recovery Batch" to see results</p>
          <p className="text-sm text-gray-400">AI will process all failed transactions</p>
        </div>
      )}

      {/* Recovery Timeline Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Recovery Progress</h3>
            <p className="text-xs text-gray-500">Cumulative recovery vs target</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-blue-600"></span>
              Recovered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-red-400 border-2 border-dashed border-red-400"></span>
              Target
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={recoveryTimeline}>
            <defs>
              <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(value) => `₹${value/1000}k`} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
              formatter={(value) => [`₹${value.toLocaleString()}`, '']}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="recovered" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fill="url(#cumulativeGradient)" 
              name="Recovered"
            />
            <Area 
              type="monotone" 
              dataKey="target" 
              stroke="#ef4444" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
              name="Target"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* High Priority Cases */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">High Priority Cases</h3>
            <p className="text-xs text-gray-500">Transactions needing immediate attention</p>
          </div>
          <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            {transactions.filter(t => t.priority === 'critical' || t.priority === 'high').length} urgent
          </span>
        </div>
        <div className="space-y-2">
          {transactions
            .filter(t => t.priority === 'high' || t.priority === 'critical')
            .slice(0, 5)
            .map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${tx.priority === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-medium text-gray-500">{tx.id}</span>
                      <span className="font-medium text-gray-800">{tx.customerName}</span>
                      <span className="text-sm font-bold text-gray-900">₹{tx.amount}</span>
                    </div>
                    <p className="text-xs text-gray-500">{tx.failureReason.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`
                    px-2.5 py-1 rounded-full text-xs font-medium
                    ${tx.priority === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}
                  `}>
                    {tx.priority}
                  </span>
                  <span className="text-xs font-medium bg-blue-50 px-2.5 py-1 rounded-full text-blue-700">
                    {tx.recoveryScore}% chance
                  </span>
                  <span className="text-xs font-medium bg-green-50 px-2.5 py-1 rounded-full text-green-700">
                    {tx.recommendedAction.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}