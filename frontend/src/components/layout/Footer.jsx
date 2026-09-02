import React from 'react'
import { Heart } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-800/50 overflow-hidden">
      {/* Main Footer Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Revenue Recovery System
            </h4>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              AI-powered revenue recovery platform
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                System Online
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">v2.0.0</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Quick Stats
            </h4>
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Total Transactions</span>
                <span className="font-medium text-gray-900 dark:text-white">60</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Recovery Rate</span>
                <span className="font-medium text-gray-900 dark:text-white">32.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Active Cases</span>
                <span className="font-medium text-gray-900 dark:text-white">9</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Quick Actions
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              <button 
                onClick={() => window.location.reload()}
                className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Refresh
              </button>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Back to Top
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Revenue Recovery System — Built with <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" /> for Razorpay AI Buildathon
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span>Version 2.0.0</span>
            <span className="w-px h-4 bg-gray-200 dark:bg-gray-700"></span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}