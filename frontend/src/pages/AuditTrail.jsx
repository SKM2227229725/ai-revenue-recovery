import React, { useState, useEffect, useMemo } from 'react'
import { 
  FileText, Download, Filter, Search, 
  Clock, CheckCircle, XCircle, AlertCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react'

// Mock Audit Data
const mockAuditLogs = [
  { id: 1, timestamp: '2026-08-30 10:30:00', type: 'diagnosis', action: 'Claude AI diagnosis completed', status: 'success', details: 'Root cause: insufficient_funds' },
  { id: 2, timestamp: '2026-08-30 10:30:02', type: 'policy', action: 'Policy validation', status: 'allowed', details: 'Rule R-03: Retry budget available' },
  { id: 3, timestamp: '2026-08-30 10:30:05', type: 'execution', action: 'Payment retry executed', status: 'success', details: 'Amount: ₹2,499, Attempt: 1' },
  { id: 4, timestamp: '2026-08-30 10:31:00', type: 'diagnosis', action: 'Claude AI diagnosis completed', status: 'success', details: 'Root cause: card_expired' },
  { id: 5, timestamp: '2026-08-30 10:31:02', type: 'policy', action: 'Policy validation', status: 'blocked', details: 'Rule R-01: Missing contact consent' },
  { id: 6, timestamp: '2026-08-30 10:31:05', type: 'execution', action: 'Escalated to human', status: 'pending', details: 'High value: ₹12,500' },
  { id: 7, timestamp: '2026-08-30 10:32:00', type: 'diagnosis', action: 'Claude AI diagnosis completed', status: 'success', details: 'Root cause: network_timeout' },
  { id: 8, timestamp: '2026-08-30 10:32:02', type: 'policy', action: 'Policy validation', status: 'allowed', details: 'Rule R-04: Cooling period satisfied' },
  { id: 9, timestamp: '2026-08-30 10:32:05', type: 'execution', action: 'Payment retry executed', status: 'success', details: 'Amount: ₹599, Attempt: 3' },
  { id: 10, timestamp: '2026-08-30 10:33:00', type: 'diagnosis', action: 'Claude AI diagnosis completed', status: 'success', details: 'Root cause: fraud_suspected' },
  { id: 11, timestamp: '2026-08-30 10:33:02', type: 'policy', action: 'Policy validation', status: 'blocked', details: 'Rule R-02: Fraud flag detected' },
  { id: 12, timestamp: '2026-08-30 10:33:05', type: 'execution', action: 'Escalated to fraud team', status: 'pending', details: 'Amount: ₹18,900' },
  { id: 13, timestamp: '2026-08-30 10:34:00', type: 'diagnosis', action: 'Claude AI diagnosis completed', status: 'success', details: 'Root cause: insufficient_funds' },
  { id: 14, timestamp: '2026-08-30 10:34:02', type: 'policy', action: 'Policy validation', status: 'allowed', details: 'Rule R-03: Retry budget available' },
  { id: 15, timestamp: '2026-08-30 10:34:05', type: 'execution', action: 'Payment retry executed', status: 'failed', details: 'Amount: ₹899, Attempt: 3' },
  { id: 16, timestamp: '2026-08-30 10:35:00', type: 'diagnosis', action: 'Claude AI diagnosis completed', status: 'success', details: 'Root cause: bank_declined' },
  { id: 17, timestamp: '2026-08-30 10:35:02', type: 'policy', action: 'Policy validation', status: 'blocked', details: 'Rule R-05: High value requires approval' },
  { id: 18, timestamp: '2026-08-30 10:35:05', type: 'execution', action: 'Escalated to manager', status: 'pending', details: 'Amount: ₹25,000' },
]

export const AuditTrail = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setLogs(mockAuditLogs)
      setLoading(false)
    }, 500)
  }, [])

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesType = filterType === 'all' || log.type === filterType
      const matchesStatus = filterStatus === 'all' || log.status === filterStatus
      const matchesSearch = 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.id.toString().includes(searchTerm)
      return matchesType && matchesStatus && matchesSearch
    })
  }, [logs, filterType, filterStatus, searchTerm])

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const stats = useMemo(() => {
    const total = logs.length
    const success = logs.filter(l => l.status === 'success' || l.status === 'allowed').length
    const blocked = logs.filter(l => l.status === 'blocked').length
    const pending = logs.filter(l => l.status === 'pending').length
    return { total, success, blocked, pending }
  }, [logs])

  const handleExportCSV = () => {
    setExporting(true)
    setTimeout(() => {
      const headers = ['Timestamp', 'Type', 'Action', 'Status', 'Details']
      const csvData = filteredLogs.map(log => [
        log.timestamp,
        log.type,
        log.action,
        log.status,
        `"${log.details}"`
      ])
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `audit-trail-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      setExporting(false)
    }, 800)
  }

  const StatusBadge = ({ status }) => {
    const configs = {
      success: { icon: CheckCircle, color: 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400' },
      allowed: { icon: CheckCircle, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' },
      blocked: { icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400' },
      pending: { icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400' },
      failed: { icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400' },
    }
    const config = configs[status] || configs.success
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    )
  }

  const TypeBadge = ({ type }) => {
    const configs = {
      diagnosis: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
      policy: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
      execution: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    }
    const config = configs[type] || configs.execution

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${config.color}`}>
        {type}
      </span>
    )
  }

  if (loading) {
    return <AuditSkeleton />
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/25">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Audit Trail
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Complete audit history of all system events
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className={`
            inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
            transition-all duration-200
            ${exporting 
              ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:scale-[1.02]'
            }
          `}
        >
          {exporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export CSV
            </>
          )}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100/80 dark:border-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Events</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-green-100/80 dark:border-green-900/30">
          <p className="text-xs text-green-600 dark:text-green-400">Successful</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.success}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-red-100/80 dark:border-red-900/30">
          <p className="text-xs text-red-600 dark:text-red-400">Blocked</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">{stats.blocked}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-yellow-100/80 dark:border-yellow-900/30">
          <p className="text-xs text-yellow-600 dark:text-yellow-400">Pending</p>
          <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by action, details or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="diagnosis">Diagnosis</option>
              <option value="policy">Policy</option>
              <option value="execution">Execution</option>
            </select>
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="allowed">Allowed</option>
              <option value="blocked">Blocked</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <th className="text-left py-3.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Timestamp
                  </span>
                </th>
                <th className="text-left py-3.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Type</th>
                <th className="text-left py-3.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Action</th>
                <th className="text-left py-3.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-3.5 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                      <p>No audit events found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log, index) => (
                  <tr 
                    key={log.id} 
                    className={`border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors ${
                      index % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-gray-50/30 dark:bg-gray-900/20'
                    }`}
                  >
                    <td className="py-3 px-4 text-xs font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4">
                      <TypeBadge type={log.type} />
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                      {log.action}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredLogs.length > itemsPerPage && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of{' '}
              {filteredLogs.length} entries
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Skeleton Loader
function AuditSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>
          <div className="h-4 w-56 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg mt-2"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>
        ))}
      </div>
      <div className="h-12 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>
      <div className="h-96 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl"></div>
    </div>
  )
}