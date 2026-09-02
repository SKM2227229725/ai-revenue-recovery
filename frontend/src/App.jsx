import React, { useState } from 'react'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { RecoveryCenter } from './pages/RecoveryCenter'
import { AuditTrail } from './pages/AuditTrail'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'transactions':
        return <Transactions />
      case 'recovery':
        return <RecoveryCenter />
      case 'audit':
        return <AuditTrail />
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  )
}

export default App