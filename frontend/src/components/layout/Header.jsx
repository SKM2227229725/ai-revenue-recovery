import React from 'react'
import { Bell, Settings, User, Menu } from 'lucide-react'

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">₹</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Revenue Recovery</span>
          <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
            AI
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}