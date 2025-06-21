'use client'

import { useState, useEffect } from 'react'
import {
  BoltIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  SunIcon,
  CircleStackIcon,
  ArrowTrendingUpIcon,
  QuestionMarkCircleIcon,
  BuildingStorefrontIcon,
  GiftIcon
} from '@heroicons/react/24/outline'
import { useWallet } from '@/components/providers/WalletProvider'
import Link from 'next/link'

// Helper component for stat cards
const StatCard = ({ icon, title, value, subtitle, helpText }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
    <div className="flex items-center mb-4">
      <div className="p-3 bg-primary-100 rounded-xl mr-4">{icon}</div>
      <div>
        <div className="flex items-center">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="relative group ml-2">
            <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full mb-2 w-64 bg-gray-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
              {helpText}
            </div>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
    <p className="text-sm text-gray-600">{subtitle}</p>
  </div>
);

export default function DashboardPage() {
  const { connected, publicKey, connect, disconnect } = useWallet()
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'trading', name: 'Trading', icon: BuildingStorefrontIcon },
    { id: 'rewards', name: 'Rewards', icon: GiftIcon },
  ]

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <BoltIcon className="h-20 w-20 text-primary-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Connect Your Wallet</h1>
          <p className="text-xl text-gray-600 mb-8">
            To see your energy dashboard, you'll need to connect your demo wallet.
          </p>
          <button
            onClick={() => connect()}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
          >
            Connect Demo Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BoltIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">
                Maschain Energy Trading
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
              >
                Home
              </Link>
              <div className="text-sm text-gray-600">
                Demo Wallet: <span className="font-mono">{`${publicKey.substring(0, 4)}...${publicKey.substring(publicKey.length - 4)}`}</span>
              </div>
              <button
                onClick={disconnect}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg text-sm"
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
          <nav className="flex space-x-8 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
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
            {/* Welcome and Quick Actions */}
            <div className="bg-gradient-to-r from-primary-600 to-green-500 text-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
              <p className="text-lg opacity-90 mb-6">Here's a snapshot of your energy activity.</p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-primary-600 font-semibold py-2 px-5 rounded-lg flex items-center hover:bg-gray-100 transition-colors">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  Sell Your Extra Energy
                </button>
                <button className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-5 rounded-lg flex items-center transition-colors">
                  <BuildingStorefrontIcon className="h-5 w-5 mr-2" />
                  Browse the Market
                </button>
              </div>
            </div>

            {/* Your Energy Snapshot */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Energy Snapshot</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                  icon={<SunIcon className="h-8 w-8 text-green-600" />}
                  title="Energy You've Made"
                  value="1,250.5 kWh"
                  subtitle="from your solar panels this month"
                  helpText="This is the total amount of electricity your solar panels have generated."
                />
                <StatCard
                  icon={<BoltIcon className="h-8 w-8 text-yellow-600" />}
                  title="Energy You've Used"
                  value="980.2 kWh"
                  subtitle="in your home this month"
                  helpText="This is the total amount of electricity your home has consumed."
                />
                <StatCard
                  icon={<CircleStackIcon className="h-8 w-8 text-purple-600" />}
                  title="Your Energy Credits"
                  value="270.3 kWh"
                  subtitle="available to sell or use"
                  helpText="This is your extra energy that you can sell on the marketplace or save for later."
                />
              </div>
            </div>
            
            {/* Energy Flow Visualization */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Energy Flow (This Month)</h3>
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                  <span>Energy Used</span>
                  <span>Energy Made</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-yellow-400 h-4 rounded-l-full" 
                    style={{ width: `${(980.2 / 1250.5) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>980.2 kWh</span>
                  <span>1,250.5 kWh</span>
                </div>
              </div>
            </div>

            {/* Marketplace Snapshot */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Marketplace Snapshot</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={<BuildingStorefrontIcon className="h-8 w-8 text-blue-600" />}
                  title="Offers to Buy Energy"
                  value="15"
                  subtitle="available on the market"
                  helpText="These are active listings from people looking to buy energy right now."
                />
                <StatCard
                  icon={<ArrowTrendingUpIcon className="h-8 w-8 text-indigo-600" />}
                  title="Energy Traded Today"
                  value="5,420 kWh"
                  subtitle="across the entire network"
                  helpText="This is the total volume of energy that has been successfully traded today."
                />
                <StatCard
                  icon={<CurrencyDollarIcon className="h-8 w-8 text-teal-600" />}
                  title="Average Price"
                  value="$0.115 / kWh"
                  subtitle="the current market rate"
                  helpText="This is the average price for 1 kWh of energy on the marketplace right now."
                />
                 <StatCard
                  icon={<ChartBarIcon className="h-8 w-8 text-pink-600" />}
                  title="Price Trend"
                  value="+12.5%"
                  subtitle="in the last 24 hours"
                  helpText="This shows if the average price of energy is going up or down."
                />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'trading' && (
          <div className="text-center p-12 bg-white rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Marketplace Coming Soon!</h2>
            <p className="text-gray-600">This is where you'll be able to create offers to sell your energy and buy from others.</p>
          </div>
        )}
        
        {activeTab === 'rewards' && (
          <div className="text-center p-12 bg-white rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Rewards Coming Soon!</h2>
            <p className="text-gray-600">Earn special rewards and achievements for participating in the energy market.</p>
          </div>
        )}
      </main>
    </div>
  )
}
