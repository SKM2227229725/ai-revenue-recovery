import React from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'

export const Layout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-6 ml-0 md:ml-64 mt-16">
          <div className="max-w-7xl mx-auto">
            {children}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  )
}