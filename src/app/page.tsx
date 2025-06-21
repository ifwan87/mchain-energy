'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BoltIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  SunIcon,
  CircleStackIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  UserGroupIcon,
  PlayIcon,
  CheckIcon,
  ArrowRightIcon,
  WifiIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'

export default function EnhancedLandingPage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [liveStats, setLiveStats] = useState({
    activeTrades: 0,
    totalVolume: 0,
    avgPrice: 0,
    participants: 0
  })

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats({
        activeTrades: Math.floor(Math.random() * 20) + 10,
        totalVolume: Math.floor(Math.random() * 1000) + 5000,
        avgPrice: 0.08 + Math.random() * 0.12,
        participants: Math.floor(Math.random() * 50) + 150
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="relative">
                <BoltIcon className="h-8 w-8 text-primary-600" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                MasChain Energy Trading
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
              <a href="#why-energy-trading" className="text-gray-600 hover:text-gray-900 transition-colors">Why Energy Trading</a>
              <a href="#use-cases" className="text-gray-600 hover:text-gray-900 transition-colors">Use Cases</a>
              <a href="#maschain-benefits" className="text-gray-600 hover:text-gray-900 transition-colors">MasChain</a>
              <a href="#what-we-offer" className="text-gray-600 hover:text-gray-900 transition-colors">What We Offer</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Start Trading
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-green-50 pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-2 animate-pulse"></span>
                🚀 HACKATHON DEMO - Powered by MasChain L1
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Trade Energy
                <span className="text-primary-600"> Like Never Before</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The world's first peer-to-peer renewable energy marketplace on blockchain.
                Sell your excess solar power directly to neighbors, earn more,
                and help build a sustainable future.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/dashboard"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  🎯 Try Live Demo
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all border border-gray-200 hover:border-gray-300 flex items-center justify-center"
                >
                  <PlayIcon className="mr-2 h-5 w-5" />
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                  Real-time trading
                </div>
                <div className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                  IoT integration
                </div>
                <div className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                  Blockchain secured
                </div>
              </div>
            </div>

            {/* Right Column - Live Demo Stats */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-primary-100 to-green-100 rounded-2xl p-8 shadow-2xl">
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  LIVE
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Live Stats Cards */}
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center mb-2">
                      <BoltIcon className="h-6 w-6 text-yellow-500 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Active Trades</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{liveStats.activeTrades}</div>
                    <div className="text-sm text-green-600">Live updates</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center mb-2">
                      <CurrencyDollarIcon className="h-6 w-6 text-green-500 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Avg Price</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">${liveStats.avgPrice.toFixed(3)}</div>
                    <div className="text-sm text-green-600">per kWh</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center mb-2">
                      <ChartBarIcon className="h-6 w-6 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Volume</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{liveStats.totalVolume.toLocaleString()}</div>
                    <div className="text-sm text-green-600">kWh traded</div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center mb-2">
                      <UserGroupIcon className="h-6 w-6 text-purple-500 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Participants</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{liveStats.participants}</div>
                    <div className="text-sm text-green-600">active users</div>
                  </div>
                </div>

                {/* Live Trading Feed */}
                <div className="mt-6 bg-white rounded-lg p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">Recent Trades</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Live Feed</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Solar Farm A → John D.</span>
                      <span className="font-medium text-gray-900">50 kWh</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Wind Farm B → Sarah M.</span>
                      <span className="font-medium text-gray-900">25 kWh</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Battery Storage → Mike R.</span>
                      <span className="font-medium text-gray-900">30 kWh</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg">
                <CpuChipIcon className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
                <WifiIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Energy Trading Section */}
      <section id="why-energy-trading" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ⚡ Why Energy Trading Matters
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The energy sector is undergoing a massive transformation. Here's why peer-to-peer energy trading is the future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 border border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <CurrencyDollarIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">$15B Annual Energy Waste</h3>
              <p className="text-gray-600 mb-4">
                Homeowners with solar panels sell excess energy back to utilities at 3-5¢/kWh, then buy it back at 15-25¢/kWh. This inefficiency costs billions annually.
              </p>
              <div className="text-2xl font-bold text-red-600">$15B Lost</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-8 border border-orange-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <BoltIcon className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Grid Inefficiency Crisis</h3>
              <p className="text-gray-600 mb-4">
                8-15% of electricity is lost during long-distance transmission. Peak demand forces utilities to build expensive "peaker plants" that run only 10% of the time.
              </p>
              <div className="text-2xl font-bold text-orange-600">40% Waste</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <GlobeAltIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Climate & Transparency Crisis</h3>
              <p className="text-gray-600 mb-4">
                70% of consumers don't know if their electricity comes from renewable sources. Companies struggle to accurately track their carbon footprint.
              </p>
              <div className="text-2xl font-bold text-green-600">70% Unaware</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🏠 Real-World Use Cases
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our platform transforms energy trading for different stakeholders
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Residential Solar Owners */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <SunIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Residential Solar Owners</h3>
                  <p className="text-gray-600">Homeowners with solar panels</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">3-5x Higher Revenue</h4>
                    <p className="text-sm text-gray-600">Sell at market rates ($0.15-0.25/kWh) vs utility buyback ($0.03-0.05/kWh)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Instant Payments</h4>
                    <p className="text-sm text-gray-600">Receive payment immediately via MasChain, not monthly utility credits</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Community Impact</h4>
                    <p className="text-sm text-gray-600">Directly supply clean energy to neighbors and reduce carbon footprint</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Example:</strong> A California homeowner generates $3,000 worth of solar energy but only receives $300 from utility buyback programs. With our platform, they could earn $2,000+.
                </p>
              </div>
            </div>

            {/* Energy Consumers */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Energy Consumers</h3>
                  <p className="text-gray-600">Residential and commercial users</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">20-40% Cost Savings</h4>
                    <p className="text-sm text-gray-600">Buy directly from local producers at competitive rates</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">100% Renewable</h4>
                    <p className="text-sm text-gray-600">Choose verified clean energy sources with transparent tracking</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Energy Independence</h4>
                    <p className="text-sm text-gray-600">Reduce reliance on utility monopolies and grid vulnerabilities</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Example:</strong> A family spending $200/month on electricity could save $60-80/month by buying from local solar producers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How MasChain Helps Section */}
      <section id="maschain-benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🇲🇾 How MasChain Powers Our Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Malaysia's premier Layer 1 blockchain provides the perfect foundation for energy trading
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BoltIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">10x Lower Transaction Fees</h3>
                    <p className="text-gray-600">
                      Energy-optimized blockchain vs. Ethereum. Perfect for micro-transactions in energy trading where every cent matters.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">100x Faster Transactions</h3>
                    <p className="text-gray-600">
                      Sub-second transaction confirmation with Proof of Authority consensus. Energy trades execute instantly, not in minutes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Regulatory Compliance</h3>
                    <p className="text-gray-600">
                      Built for Malaysian market requirements from day one. Automatic audit trails for utility reporting and government compliance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GlobeAltIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Carbon Neutral Operations</h3>
                    <p className="text-gray-600">
                      Proof-of-stake consensus mechanism ensures our platform doesn't contribute to climate change while enabling clean energy trading.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-green-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">MasChain Technical Advantages</h3>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Transaction Speed</span>
                    <span className="text-sm font-bold text-green-600">Sub-second</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Transaction Cost</span>
                    <span className="text-sm font-bold text-green-600">$0.001</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Energy Efficiency</span>
                    <span className="text-sm font-bold text-green-600">99.9%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '99%' }}></div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Uptime</span>
                    <span className="text-sm font-bold text-green-600">99.99%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '99%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary-600 rounded-lg text-white">
                <p className="text-sm">
                  <strong>Government Backed:</strong> Supported by Malaysian authorities for regulatory compliance and enterprise adoption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section id="what-we-offer" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎯 What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A complete energy trading ecosystem built for the future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <BoltIcon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real-Time Trading Platform</h3>
              <p className="text-gray-600 mb-4">
                Live energy marketplace with instant order matching, dynamic pricing, and automated settlement.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Instant order execution</li>
                <li>• Dynamic pricing algorithms</li>
                <li>• Automated escrow system</li>
                <li>• Real-time market data</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <WifiIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">IoT Integration Network</h3>
              <p className="text-gray-600 mb-4">
                Seamless connection to smart meters, solar panels, and energy storage systems.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Smart meter connectivity</li>
                <li>• Real-time data validation</li>
                <li>• Multi-oracle consensus</li>
                <li>• Offline data sync</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Blockchain Security</h3>
              <p className="text-gray-600 mb-4">
                Immutable records, transparent transactions, and cryptographic verification.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Immutable transaction history</li>
                <li>• Cryptographic verification</li>
                <li>• Transparent audit trails</li>
                <li>• Fraud prevention</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Analytics</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive insights into energy usage, trading patterns, and market trends.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Energy usage analytics</li>
                <li>• Trading performance metrics</li>
                <li>• Market trend analysis</li>
                <li>• Carbon footprint tracking</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                <UserGroupIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mobile-First Experience</h3>
              <p className="text-gray-600 mb-4">
                Intuitive mobile and web interfaces for seamless energy trading on any device.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Responsive web design</li>
                <li>• Native mobile apps</li>
                <li>• Push notifications</li>
                <li>• Offline capabilities</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <GlobeAltIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Enterprise Solutions</h3>
              <p className="text-gray-600 mb-4">
                White-label platform and API access for utilities and large energy consumers.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• White-label platform</li>
                <li>• Enterprise APIs</li>
                <li>• Custom integrations</li>
                <li>• Dedicated support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Energy Trading?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join the future of peer-to-peer energy trading. Start earning more from your solar panels
            while building a sustainable energy future powered by MasChain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-white hover:bg-gray-100 text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              🚀 Start Trading Now
            </Link>
            <button
              onClick={() => setIsVideoPlaying(true)}
              className="bg-transparent hover:bg-primary-700 text-white border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
            >
              📺 Watch Demo Video
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BoltIcon className="h-8 w-8 text-primary-400 mr-2" />
                <span className="text-xl font-bold">MasChain Energy</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing energy trading with blockchain technology.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Trading</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">IoT Integration</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MasChain Energy Trading. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 