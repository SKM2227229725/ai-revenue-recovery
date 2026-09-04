import React from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export const MetricCard = ({ title, value, change, icon: Icon, trend }) => {
  const isPositive = trend === 'up'
  
  return (
    <div className="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100/80 dark:border-gray-800/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      {/* Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1.5">
            {value}
          </h3>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                isPositive 
                  ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30' 
                  : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
              }`}>
                {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {change}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">vs last week</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        )}
      </div>
    </div>
  )
}