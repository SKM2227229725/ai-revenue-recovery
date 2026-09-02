import React from 'react'
import { LayoutDashboard, Database, Target, FileText } from 'lucide-react'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Database },
  { id: 'recovery', label: 'Recovery Center', icon: Target },
  { id: 'audit', label: 'Audit Trail', icon: FileText },
]

export const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="fixed left-0 top-16 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                transition-colors duration-200
                ${isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                }
              `}
            >
              <Icon size={20} />
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-8 bg-blue-600 rounded-full" />
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}