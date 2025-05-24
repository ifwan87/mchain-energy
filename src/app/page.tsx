'use client'

import { useState, useEffect } from 'react'
import {
  BoltIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  SunIcon,
  CircleStackIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

// import TradingDashboard from '@/components/TradingDashboard'
// import EnergyStats from '@/components/EnergyStats'
// import MarketOverview from '@/components/MarketOverview'
// import { useEnergyStore } from '@/store/energyStore'

export default function HomePage() {
  const [connected, setConnected] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    // Simulate wallet connection for demo
    setConnected(true)
  }, [])

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'trading', name: 'Trading', icon: CurrencyDollarIcon },
    { id: 'analytics', name: 'Analytics', icon: ArrowTrendingUpIcon },
  ]

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <BoltIcon className="h-20 w-20 text-primary-600" />
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-energy-production rounded-full animate-pulse" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Maschain Energy Trading Platform
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Trade renewable energy on the blockchain. Connect your wallet to get started.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="card text-center">
                <SunIcon className="h-12 w-12 text-energy-production mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Solar Energy</h3>
                <p className="text-gray-600">Trade excess solar energy with your neighbors</p>
              </div>

              <div className="card text-center">
                <CircleStackIcon className="h-12 w-12 text-energy-trading mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Energy Storage</h3>
                <p className="text-gray-600">Store and trade energy when prices are optimal</p>
              </div>

              <div className="card text-center">
                <ChartBarIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-gray-600">Monitor your energy production and consumption</p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setConnected(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg"
              >
                Connect Demo Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BoltIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">
                Maschain Energy Trading
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Demo Wallet: 11111111...11111111
              </div>
              <button
                onClick={() => setConnected(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Energy Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="stat-card">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 rounded-lg bg-green-50">
                      <SunIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-600">Total Production</p>
                      <p className="text-2xl font-bold text-gray-900">1,250.5 kWh</p>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 rounded-lg bg-yellow-50">
                      <BoltIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-600">Total Consumption</p>
                      <p className="text-2xl font-bold text-gray-900">980.2 kWh</p>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 rounded-lg bg-purple-50">
                      <CircleStackIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-600">Current Balance</p>
                      <p className="text-2xl font-bold text-gray-900">270.3 kWh</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Market Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="stat-card">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-8 w-8 text-primary-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Active Offers</p>
                      <p className="text-2xl font-bold text-gray-900">15</p>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="flex items-center">
                    <BoltIcon className="h-8 w-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Volume Traded</p>
                      <p className="text-2xl font-bold text-gray-900">5,420 kWh</p>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Avg Price</p>
                      <p className="text-2xl font-bold text-gray-900">$0.115/kWh</p>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="flex items-center">
                    <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Trend</p>
                      <p className="text-sm text-green-600 font-medium">+12.5%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trading' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Energy Trading</h2>
            <p className="text-gray-600 mb-4">
              Create and manage your energy trading offers.
            </p>
            <button className="btn-primary">
              Create New Offer
            </button>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Energy Analytics</h2>
            <p className="text-gray-600">
              Detailed analytics and insights coming soon...
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
