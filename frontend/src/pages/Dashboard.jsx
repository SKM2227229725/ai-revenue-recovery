/**
 * Dashboard Page - Complete with Razorpay Analytics + AI Explainability
 * 
 * FEATURES:
 * 1. Overview Tab - Main dashboard with metrics and charts
 * 2. Razorpay Analytics Tab - Payment methods, fees, webhook status
 * 3. Payment Analytics Tab - Method distribution, segment analytics
 * 4. AI Explainability Tab - Feature importance, per-transaction reasoning
 * 5. Priority Filter - All/Critical/High/Medium/Low with correct counts
 * 6. Run Recovery via Razorpay - Batch processing with progress bar
 * 7. Real-time Notifications - Toast alerts
 * 8. AI Agent Workflow - Step-by-step recovery animation
 * 9. "Why This Action?" - Per-transaction explainability
 * 10. Dark Mode + Responsive
 */

import React, { useState, useEffect } from 'react'
import { 
  DollarSign, TrendingUp, AlertCircle, Users, 
  Clock, CheckCircle, RefreshCw, Activity, PieChart,
  ArrowUpRight, ArrowDownRight, Bell, Download, 
  Filter, Zap, Shield, Award, Target, Sparkles,
  FileText, Printer, Calendar, Eye, Star, TrendingDown,
  CreditCard, Banknote, Wallet, Percent, BarChart3,
  Info, ChevronDown, ChevronUp, Brain, Lightbulb,
  LayoutDashboard, Database, Server, Webhook
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart as RePieChart,
  Pie, Cell, BarChart, Bar, Legend, ComposedChart,
  Line
} from 'recharts'
import { MetricCard } from '../components/ui/MetricCard'
import { mockMetrics, mockTransactions } from '../data/mockTransactions'

// ============================================
// CONSTANTS
// ============================================

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6']

// ============================================
// MOCK DATA (Will be replaced with real API)
// ============================================

const PAYMENT_ANALYTICS = {
  totalPayments: 650,
  successfulPayments: 445,
  failedPayments: 205,
  recoveryRate: 32.5,
  razorpayRecovered: 22179,
  monthlyData: [
    { month: 'Jan', payments: 120, failed: 45, recovered: 15, amount: 45000 },
    { month: 'Feb', payments: 135, failed: 50, recovered: 18, amount: 52000 },
    { month: 'Mar', payments: 110, failed: 38, recovered: 12, amount: 38000 },
    { month: 'Apr', payments: 140, failed: 42, recovered: 16, amount: 49000 },
    { month: 'May', payments: 145, failed: 30, recovered: 20, amount: 58000 },
    { month: 'Jun', payments: 120, failed: 35, recovered: 14, amount: 42000 },
  ],
  razorpayMetrics: {
    totalAmount: 1250000,
    recoveredAmount: 452000,
    pendingAmount: 322000,
    failedAmount: 476000,
    transactionFees: 29500,
    netRecovered: 1220500,
    settlementTime: 'T+2',
  },
  paymentMethods: [
    { name: 'UPI', value: 42 },
    { name: 'Credit Card', value: 20 },
    { name: 'Debit Card', value: 20 },
    { name: 'Netbanking', value: 10 },
    { name: 'Wallet', value: 8 },
  ],
  feeBreakdown: {
    transactionAmount: 1250000,
    razorpayFee: 25000,
    gst: 4500,
    totalFees: 29500,
    netAmount: 1220500,
  },
  beforeAfterAI: {
    before: { recoveryRate: 18.5, recoveredAmount: 125000, failedPayments: 205 },
    after: { recoveryRate: 32.5, recoveredAmount: 221790, failedPayments: 140 },
    improvement: 14.0,
    additionalRecovered: 96790,
  },
  webhookStatus: [
    { name: 'Payment Captured', status: 'active', last: '2 min ago' },
    { name: 'Payment Failed', status: 'active', last: '5 min ago' },
    { name: 'Refund Processed', status: 'warning', last: '1 hour ago' },
  ]
}

// Workflow steps for AI Agent
const WORKFLOW_STEPS = [
  { id: 'detect', label: '🔍 Detecting Failed Payments', icon: '🔍' },
  { id: 'analyze', label: '🧠 AI Analyzing Failures', icon: '🧠' },
  { id: 'opportunities', label: '🎯 Finding Recovery Opportunities', icon: '🎯' },
  { id: 'execute', label: '⚡ Executing Recovery Actions', icon: '⚡' },
  { id: 'recover', label: '💰 Revenue Recovered!', icon: '💰' },
]

// ============================================
// MAIN COMPONENT
// ============================================

export const Dashboard = () => {
  // ============================================
  // STATE
  // ============================================
  
  const [metrics, setMetrics] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [progress, setProgress] = useState(0)
  const [recoveryRunning, setRecoveryRunning] = useState(false)
  const [showExplainability, setShowExplainability] = useState(null)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [workflowActive, setWorkflowActive] = useState(false)

  // ============================================
  // FETCH DATA
  // ============================================
  
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    setRefreshing(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600))
      setMetrics({
        ...mockMetrics,
        ...PAYMENT_ANALYTICS.razorpayMetrics,
        beforeAfterAI: PAYMENT_ANALYTICS.beforeAfterAI,
        feeBreakdown: PAYMENT_ANALYTICS.feeBreakdown,
        webhookStatus: PAYMENT_ANALYTICS.webhookStatus,
        paymentMethods: PAYMENT_ANALYTICS.paymentMethods,
        monthlyData: PAYMENT_ANALYTICS.monthlyData,
      })
      setTransactions(mockTransactions.slice(0, 10))
      
    } catch (err) {
      setError(err.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ============================================
  // NOTIFICATIONS
  // ============================================
  
  const addNotification = (message) => {
    setNotifications(prev => [...prev, { id: Date.now(), message, read: false }])
    setShowNotifications(true)
    setTimeout(() => setShowNotifications(false), 5000)
  }

  const clearNotifications = () => {
    setNotifications([])
    setShowNotifications(false)
  }

  // ============================================
  // FILTER TRANSACTIONS
  // ============================================
  
  const getFilteredTransactions = () => {
    if (selectedPriority === 'all') return transactions
    return transactions.filter(t => t.priority === selectedPriority)
  }

  // ============================================
  // RUN RECOVERY WITH WORKFLOW
  // ============================================
  
  const runRecovery = async () => {
    setRecoveryRunning(true)
    setWorkflowActive(true)
    setProgress(0)
    
    const highPriorityIds = transactions
      .filter(t => t.priority === 'critical' || t.priority === 'high')
      .map(t => t.id)
    
    if (highPriorityIds.length === 0) {
      addNotification('⚠️ No high-priority cases to recover!')
      setRecoveryRunning(false)
      setWorkflowActive(false)
      return
    }

    // Simulate workflow steps
    const stepDuration = 300
    for (let step = 0; step < 5; step++) {
      setProgress((step + 1) * 20)
      await new Promise(resolve => setTimeout(resolve, stepDuration))
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      const recovered = Math.floor(highPriorityIds.length * 0.45)
      addNotification(`✅ ${recovered} cases recovered via Razorpay!`)
      fetchData()
    } catch (err) {
      addNotification(`❌ Recovery failed: ${err.message}`)
    } finally {
      setRecoveryRunning(false)
      setWorkflowActive(false)
      setProgress(100)
    }
  }

  // ============================================
  // EXPORT REPORT
  // ============================================
  
  const exportReport = () => {
    const headers = ['ID', 'Customer', 'Amount', 'Status', 'Priority', 'Action']
    const csvData = transactions.map(t => [
      t.transaction_id || t.id,
      t.customerName || t.customer_name,
      t.amount,
      t.status,
      t.priority,
      t.recommendedAction || t.recommended_action
    ])
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `recovery-report-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    addNotification('📊 Report exported successfully!')
  }

  // ============================================
  // GET RATIONALE FOR TRANSACTION
  // ============================================
  
  const getRationale = (tx) => {
    const reason = tx.failureReason || tx.failure_reason
    const reasonMap = {
      'insufficient_funds': 'Customer may have funds after few days. Previous payments successful.',
      'card_expired': 'Customer needs to update payment method. Card has been expired for 30+ days.',
      'network_timeout': 'Transient failure detected. Retry likely to succeed within 24 hours.',
      'bank_declined': 'Bank declined due to fraud risk. Manual review recommended.',
      'authentication_timeout': 'Customer timed out during authentication. Retry with simpler flow.',
      'fraud_suspected': 'High fraud risk detected. Auto-block and manual review required.',
    }
    return reasonMap[reason] || 'Rule-based recommendation with high confidence.'
  }

  const getWorkflowStep = (stepIndex) => {
    return WORKFLOW_STEPS[stepIndex] || WORKFLOW_STEPS[0]
  }

  // ============================================
  // RENDER - LOADING
  // ============================================
  
  if (loading) {
    return <DashboardSkeleton />
  }

  // ============================================
  // RENDER - ERROR
  // ============================================
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connection Error</h3>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
          <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    )
  }

  const filteredTransactions = getFilteredTransactions()
  const highPriorityCount = transactions.filter(t => t.priority === 'critical' || t.priority === 'high').length
  const allCount = transactions.length

  // ============================================
  // RENDER - MAIN
  // ============================================
  
  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* ==========================================
          HEADER
          ========================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Razorpay Revenue Recovery
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            AI-powered payment recovery with Razorpay integration
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
            {showNotifications && notifications.length > 0 && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-white">Notifications</span>
                  <button onClick={clearNotifications} className="text-sm text-blue-600 hover:text-blue-700">
                    Clear all
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${n.read ? 'opacity-60' : ''}`}>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-full flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Razorpay Connected (Test Mode)
          </span>

          {/* Refresh Button */}
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ==========================================
          TABS
          ========================================== */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'razorpay', label: '💳 Razorpay Analytics' },
          { id: 'analytics', label: '📈 Payment Analytics' },
          { id: 'explainability', label: '🧠 AI Explainability' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==========================================
          TAB 1: OVERVIEW
          ========================================== */}
      {selectedTab === 'overview' && (
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <MetricCard
              title="Revenue at Risk"
              value={`₹${(metrics?.totalAtRisk || 0).toLocaleString()}`}
              change="+12% from last week"
              icon={DollarSign}
              trend="up"
            />
            <MetricCard
              title="Razorpay Recovered"
              value={`₹${(metrics?.recovered || 0).toLocaleString()}`}
              change={`${metrics?.recoveryRate || 0}% rate`}
              icon={TrendingUp}
              trend="up"
            />
            <MetricCard
              title="Recovery Rate"
              value={`${metrics?.recoveryRate || 0}%`}
              change="+2.3% improvement"
              icon={AlertCircle}
              trend="up"
            />
            <MetricCard
              title="Active Cases"
              value={metrics?.activeCases || 0}
              change="8 pending review"
              icon={Users}
              trend="down"
            />
            <MetricCard
              title="High Priority"
              value={highPriorityCount}
              change="Need attention"
              icon={Star}
              trend="up"
            />
            <MetricCard
              title="AI Recovery ROI"
              value={`₹${(metrics?.netRecovered || 0).toLocaleString()}`}
              change="Net recovered after fees"
              icon={TrendingUp}
              trend="up"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'critical', 'high', 'medium', 'low'].map((priority) => {
                const count = priority === 'all' ? allCount : transactions.filter(t => t.priority === priority).length
                return (
                  <button
                    key={priority}
                    onClick={() => setSelectedPriority(priority)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedPriority === priority
                        ? priority === 'critical'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-2 ring-red-500'
                          : priority === 'high'
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 ring-2 ring-orange-500'
                          : priority === 'medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 ring-2 ring-yellow-500'
                          : priority === 'low'
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 ring-2 ring-gray-500'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {priority === 'all' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                    <span className="ml-1 px-1.5 py-0.5 bg-white/50 dark:bg-gray-700/50 rounded-full text-xs">
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
            <button
              onClick={runRecovery}
              disabled={recoveryRunning || highPriorityCount === 0}
              className={`ml-auto px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 ${
                recoveryRunning || highPriorityCount === 0
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:scale-[1.02]'
              }`}
            >
              {recoveryRunning ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <><Zap className="w-4 h-4" /> Run Recovery via Razorpay</>
              )}
            </button>
          </div>

          {/* AI Agent Workflow */}
          {workflowActive && (
            <RecoveryAgentWorkflow 
              isRunning={recoveryRunning} 
              progress={progress} 
              steps={WORKFLOW_STEPS}
            />
          )}

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recovery Trend</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Razorpay recovery vs at-risk</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-600"></span>Recovered</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-400"></span>At Risk</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={metrics?.timeline || []}>
                  <defs>
                    <linearGradient id="recoveredGrad"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                    <linearGradient id="atRiskGrad"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <Area type="monotone" dataKey="recovered" stroke="#3b82f6" strokeWidth={2} fill="url(#recoveredGrad)" />
                  <Area type="monotone" dataKey="atRisk" stroke="#ef4444" strokeWidth={2} fill="url(#atRiskGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Recovery breakdown</p>
                </div>
                <PieChart className="w-4 h-4 text-gray-400" />
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <RePieChart>
                  <Pie
                    data={[
                      { name: 'Retry', value: 44.4 },
                      { name: 'Update Link', value: 37.5 },
                      { name: 'Escalate', value: 18.1 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                  >
                    {[0, 1, 2].map((i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    formatter={(value, name) => [`${value}%`, name]}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {selectedPriority === 'all' ? 'All' : selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)} Priority Transactions
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{filteredTransactions.length} transactions found</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={exportReport}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Back to Top
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Reason</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Score</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Priority</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Action</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase">Explain</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No transactions found for this priority level
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx, index) => {
                      const id = tx.transaction_id || tx.id
                      const customer = tx.customerName || tx.customer_name
                      const reason = tx.failureReason || tx.failure_reason
                      const score = tx.recoveryScore || tx.recovery_score
                      const action = tx.recommendedAction || tx.recommended_action
                      return (
                        <tr key={id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                          <td className="py-3 px-4 font-mono text-xs">{id}</td>
                          <td className="py-3 px-4 font-medium">{customer}</td>
                          <td className="py-3 px-4 font-bold">₹{tx.amount}</td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium capitalize">
                              {reason?.replace(/_/g, ' ') || 'Unknown'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                                <div className={`h-full rounded-full ${score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score || 0}%` }} />
                              </div>
                              <span className="text-xs font-semibold">{score || 0}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${tx.priority === 'critical' ? 'bg-red-100 text-red-800' : tx.priority === 'high' ? 'bg-orange-100 text-orange-800' : tx.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                              {tx.priority || 'low'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                              {action?.replace(/_/g, ' ') || 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setShowExplainability(showExplainability === id ? null : id)}
                              className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                            >
                              <Info className="w-3 h-3" />
                              Why?
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction Explainability Panel */}
          {filteredTransactions.map((tx) => {
            const id = tx.transaction_id || tx.id
            return showExplainability === id && (
              <TransactionExplainability 
                key={id}
                tx={tx}
                isExpanded={true}
                onToggle={() => setShowExplainability(null)}
                rationale={getRationale(tx)}
              />
            )
          })}
        </>
      )}

      {/* ==========================================
          TAB 2: RAZORPAY ANALYTICS
          ========================================== */}
      {selectedTab === 'razorpay' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Razorpay Payments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{PAYMENT_ANALYTICS.totalPayments}</p>
              <span className="text-xs text-green-600">+12% from last month</span>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-green-100 dark:border-green-900/30">
              <p className="text-xs text-green-600 dark:text-green-400">Razorpay Recovered</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{(metrics?.recovered || 0).toLocaleString()}</p>
              <span className="text-xs text-green-600">{metrics?.recoveryRate || 0}% recovery rate</span>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-blue-100 dark:border-blue-900/30">
              <p className="text-xs text-blue-600 dark:text-blue-400">Razorpay Fees (2% + GST)</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{(metrics?.transactionFees || 0).toLocaleString()}</p>
              <span className="text-xs text-blue-600">Net recovered: ₹{(metrics?.netRecovered || 0).toLocaleString()}</span>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-purple-100 dark:border-purple-900/30">
              <p className="text-xs text-purple-600 dark:text-purple-400">Settlement Time</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">T+2</p>
              <span className="text-xs text-purple-600">Days to settle</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Razorpay Payment Methods</h3>
              <div className="space-y-3">
                {PAYMENT_ANALYTICS.paymentMethods.map((method, index) => (
                  <div key={method.name}>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{method.name}</span>
                      <span className="font-medium">{method.value}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                      <div className="h-full rounded-full" style={{ width: `${method.value}%`, backgroundColor: COLORS[index % COLORS.length] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Razorpay Fee Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div><p className="text-sm font-medium">Transaction Amount</p><p className="text-xs text-gray-500">Total payments processed</p></div>
                  <p className="text-lg font-bold">₹{(PAYMENT_ANALYTICS.feeBreakdown.transactionAmount).toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div><p className="text-sm font-medium text-blue-700 dark:text-blue-400">Razorpay Fee (2%)</p><p className="text-xs text-blue-500">Standard merchant fee</p></div>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-400">₹{(PAYMENT_ANALYTICS.feeBreakdown.razorpayFee).toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div><p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">GST (18%)</p><p className="text-xs text-yellow-500">Tax on fee</p></div>
                  <p className="text-lg font-bold text-yellow-700 dark:text-yellow-400">₹{(PAYMENT_ANALYTICS.feeBreakdown.gst).toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                  <div><p className="text-sm font-medium text-green-700 dark:text-green-400">Total Fees</p><p className="text-xs text-green-500">Including GST</p></div>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400">₹{(PAYMENT_ANALYTICS.feeBreakdown.totalFees).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              AI Impact: Before vs After
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Before AI</p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{PAYMENT_ANALYTICS.beforeAfterAI.before.recoveryRate}%</p>
                <p className="text-xs text-gray-500">₹{(PAYMENT_ANALYTICS.beforeAfterAI.before.recoveredAmount).toLocaleString()} recovered</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">After AI</p>
                <p className="text-2xl font-bold text-blue-600">{PAYMENT_ANALYTICS.beforeAfterAI.after.recoveryRate}%</p>
                <p className="text-xs text-green-600">₹{(PAYMENT_ANALYTICS.beforeAfterAI.after.recoveredAmount).toLocaleString()} recovered</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Improvement</p>
                <p className="text-2xl font-bold text-green-600">+{PAYMENT_ANALYTICS.beforeAfterAI.improvement}%</p>
                <p className="text-xs text-green-600">₹{(PAYMENT_ANALYTICS.beforeAfterAI.additionalRecovered).toLocaleString()} extra saved</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <Webhook className="w-4 h-4 text-blue-600" />
              Razorpay Webhook Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PAYMENT_ANALYTICS.webhookStatus.map((webhook) => (
                <div key={webhook.name} className={`flex items-center gap-3 p-3 rounded-lg ${webhook.status === 'active' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
                  <div className={`w-3 h-3 rounded-full ${webhook.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{webhook.name}</p>
                    <p className="text-xs text-gray-500">Last: {webhook.last}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 3: PAYMENT ANALYTICS
          ========================================== */}
      {selectedTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Payment Method Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RePieChart>
                  <Pie
                    data={PAYMENT_ANALYTICS.paymentMethods}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {PAYMENT_ANALYTICS.paymentMethods.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Customer Segment Analytics</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { name: 'Premium', failed: 35, recovered: 25 },
                  { name: 'Regular', failed: 55, recovered: 30 },
                  { name: 'New', failed: 40, recovered: 15 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="failed" fill="#ef4444" name="Failed Payments" />
                  <Bar dataKey="recovered" fill="#10b981" name="Recovered" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Monthly Payment Analytics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={PAYMENT_ANALYTICS.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                <YAxis yAxisId="left" stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={11} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                <Legend />
                <Bar yAxisId="left" dataKey="payments" fill="#3b82f6" name="Total Payments" barSize={30} />
                <Bar yAxisId="left" dataKey="failed" fill="#ef4444" name="Failed" barSize={30} />
                <Line yAxisId="right" type="monotone" dataKey="recovered" stroke="#10b981" name="Recovered" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 4: AI EXPLAINABILITY
          ========================================== */}
      {selectedTab === 'explainability' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6 border border-purple-100 dark:border-purple-900/30">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Explainability Panel</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Understand why AI made each decision</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Feature Importance (ML Model)</h3>
            <div className="space-y-3">
              {[
                { name: 'Amount', value: 40, color: 'blue' },
                { name: 'Failure Recoverability', value: 25, color: 'purple' },
                { name: 'Customer Segment', value: 15, color: 'green' },
                { name: 'Customer History', value: 10, color: 'yellow' },
                { name: 'Retry Count', value: 10, color: 'red' },
              ].map((feature) => (
                <div key={feature.name}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{feature.name}</span>
                    <span className={`font-medium text-${feature.color}-600`}>{feature.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                    <div className={`h-full bg-${feature.color}-600 rounded-full`} style={{ width: `${feature.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Transaction-Level Explanations</h3>
            {transactions.slice(0, 5).map((tx) => {
              const id = tx.transaction_id || tx.id
              return (
                <TransactionExplainability 
                  key={id}
                  tx={tx}
                  isExpanded={showExplainability === id}
                  onToggle={() => setShowExplainability(showExplainability === id ? null : id)}
                  rationale={getRationale(tx)}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// COMPONENT: TransactionExplainability
// ============================================

function TransactionExplainability({ tx, isExpanded, onToggle, rationale }) {
  const id = tx.transaction_id || tx.id
  const customer = tx.customerName || tx.customer_name
  const reason = tx.failureReason || tx.failure_reason
  const score = tx.recoveryScore || tx.recovery_score
  const action = tx.recommendedAction || tx.recommended_action

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-xs font-medium">{id}</span>
          <span className="font-medium">{customer}</span>
          <span className="text-sm font-bold">₹{tx.amount}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            tx.priority === 'critical' ? 'bg-red-100 text-red-800' :
            tx.priority === 'high' ? 'bg-orange-100 text-orange-800' :
            tx.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {tx.priority}
          </span>
          <span className="text-xs text-gray-500">Confidence: {score || 0}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-600">Why this action?</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">🤖 AI Diagnosis</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{reason || 'Network timeout'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">📊 Recovery Probability</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{score || 55}% chance</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">🎯 Recommended Action</p>
              <p className="text-sm font-medium text-blue-600">{action || 'retry_payment'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">📋 Rationale</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{rationale}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Confidence Breakdown</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-gray-500">AI Confidence</p>
                <p className="text-lg font-bold text-blue-600">0.7</p>
              </div>
              <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-xs text-gray-500">ML Probability</p>
                <p className="text-lg font-bold text-green-600">{score || 55}%</p>
              </div>
              <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-xs text-gray-500">Priority Score</p>
                <p className="text-lg font-bold text-purple-600">{score || 78}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-yellow-500" />
              Claude AI Analysis:
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              This transaction failed due to {reason || 'network timeout'}. 
              Recommended action: {action || 'retry_payment'} with confidence 0.7.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// COMPONENT: RecoveryAgentWorkflow
// ============================================

function RecoveryAgentWorkflow({ isRunning, progress, steps }) {
  const activeStep = Math.min(Math.floor(progress / 20), steps.length - 1)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-blue-600" />
        AI Agent Workflow
      </h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              index <= activeStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  index <= activeStep ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
                {index <= activeStep && (
                  <span className="text-xs text-green-600 dark:text-green-400">✅</span>
                )}
                {index === activeStep && isRunning && (
                  <span className="text-xs text-blue-600 animate-pulse">⏳ Processing...</span>
                )}
              </div>
              {index <= activeStep && (
                <div className="w-full h-1 bg-green-200 dark:bg-green-900/30 rounded-full mt-1">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
                </div>
              )}
              {index === activeStep && isRunning && (
                <div className="w-full h-1 bg-blue-200 dark:bg-blue-900/30 rounded-full mt-1">
                  <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: `${progress % 20 * 5}%` }} />
                </div>
              )}
              {index > activeStep && (
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-1" />
              )}
            </div>
          </div>
        ))}
      </div>

      {isRunning && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            AI Agent Processing... {progress}% complete
          </p>
        </div>
      )}

      {!isRunning && progress === 100 && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Recovery Complete! Revenue recovered successfully.
          </p>
        </div>
      )}
    </div>
  )
}

// ============================================
// SKELETON LOADER
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
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg"></div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg"></div>
        ))}
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>
        ))}
      </div>
      <div className="h-12 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 h-80 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>
        <div className="h-80 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>
      </div>
      <div className="h-80 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>
    </div>
  )
}