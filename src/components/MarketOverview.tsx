'use client'

import { useState } from 'react'
import { 
  ChartBarIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  BoltIcon 
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEnergyStore } from '@/store/energyStore'
import { format } from 'date-fns'

export default function MarketOverview() {
  const { marketData } = useEnergyStore()
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')

  const timeframes = [
    { id: '24h', name: '24 Hours' },
    { id: '7d', name: '7 Days' },
    { id: '30d', name: '30 Days' },
  ]

  const formatPrice = (value: number) => `$${value.toFixed(3)}`
  const formatTime = (timestamp: number) => format(new Date(timestamp), 'HH:mm')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Market Overview</h2>
        
        <div className="flex space-x-2">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.id}
              onClick={() => setSelectedTimeframe(timeframe.id)}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                selectedTimeframe === timeframe.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {timeframe.name}
            </button>
          ))}
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-primary-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Offers</p>
              <p className="text-2xl font-bold text-gray-900">{marketData.totalOffers}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <BoltIcon className="h-8 w-8 text-energy-trading" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Volume Traded</p>
              <p className="text-2xl font-bold text-gray-900">
                {marketData.totalVolumeTraded.toLocaleString()} kWh
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Price</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(marketData.averagePrice)}/kWh
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-sm text-gray-900">
                {format(new Date(), 'HH:mm:ss')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Price Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketData.priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime}
                type="number"
                scale="time"
                domain={['dataMin', 'dataMax']}
              />
              <YAxis 
                tickFormatter={formatPrice}
                domain={['dataMin - 0.01', 'dataMax + 0.01']}
              />
              <Tooltip 
                labelFormatter={(value) => format(new Date(value), 'MMM dd, HH:mm')}
                formatter={(value: number) => [formatPrice(value), 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#0ea5e9" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Offers */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Market Offers</h3>
        
        {marketData.activeOffers.length === 0 ? (
          <div className="text-center py-8">
            <BoltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No active offers available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {marketData.activeOffers.map((offer) => {
                  const progress = (offer.filledAmount / offer.energyAmount) * 100
                  const timeLeft = Math.max(0, offer.expiresAt - Date.now())
                  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
                  
                  return (
                    <tr key={offer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {offer.seller}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {offer.energyAmount} kWh
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(offer.pricePerKwh)}/kWh
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          offer.offerType === 'immediate' 
                            ? 'bg-green-100 text-green-800'
                            : offer.offerType === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {offer.offerType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hoursLeft > 0 ? `${hoursLeft}h` : 'Expired'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
