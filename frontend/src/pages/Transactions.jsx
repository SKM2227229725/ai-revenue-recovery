import React, { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import { mockTransactions } from '../data/mockTransactions'

export const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setTransactions(mockTransactions)
      setLoading(false)
    }, 500)
  }, [])

  const filteredTx = transactions.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === 'all' || tx.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500">{filteredTx.length} transactions found</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Method</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Reason</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Priority</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-xs">{tx.id}</td>
                  <td className="py-3 px-4">{tx.customerName}</td>
                  <td className="py-3 px-4 font-medium">₹{tx.amount}</td>
                  <td className="py-3 px-4 text-xs">{tx.paymentMethod}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      {tx.failureReason.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${tx.recoveryScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{tx.recoveryScore}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-medium
                      ${tx.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        tx.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        tx.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {tx.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {tx.recommendedAction.replace('_', ' ')}
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