'use client'

import {
  BoltIcon,
  SunIcon,
  CircleStackIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import { useEnergyStore } from '@/store/energyStore'

export default function EnergyStats() {
  const { energyData } = useEnergyStore()

  const stats = [
    {
      name: 'Total Production',
      value: `${energyData.totalProduction.toFixed(1)} kWh`,
      icon: SunIcon,
      color: 'text-energy-production',
      bgColor: 'bg-green-50',
      change: '+12.5%',
      changeType: 'increase',
    },
    {
      name: 'Total Consumption',
      value: `${energyData.totalConsumption.toFixed(1)} kWh`,
      icon: BoltIcon,
      color: 'text-energy-consumption',
      bgColor: 'bg-yellow-50',
      change: '-3.2%',
      changeType: 'decrease',
    },
    {
      name: 'Current Balance',
      value: `${energyData.currentBalance.toFixed(1)} kWh`,
      icon: CircleStackIcon,
      color: 'text-energy-trading',
      bgColor: 'bg-purple-50',
      change: '+8.7%',
      changeType: 'increase',
    },
    {
      name: 'Credits Earned',
      value: `${energyData.creditsEarned.toLocaleString()} EC`,
      icon: CurrencyDollarIcon,
      color: 'text-primary-600',
      bgColor: 'bg-blue-50',
      change: '+15.3%',
      changeType: 'increase',
    },
    {
      name: 'Credits Spent',
      value: `${energyData.creditsSpent.toLocaleString()} EC`,
      icon: CurrencyDollarIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      change: '+5.1%',
      changeType: 'increase',
    },
    {
      name: 'Carbon Offset',
      value: `${energyData.carbonOffset.toFixed(1)} kg CO₂`,
      icon: GlobeAltIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+18.9%',
      changeType: 'increase',
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Energy Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          const ChangeIcon = stat.changeType === 'increase' ? ArrowUpIcon : ArrowDownIcon

          return (
            <div key={stat.name} className="stat-card">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <ChangeIcon
                  className={`h-4 w-4 ${
                    stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                  }`}
                />
                <span
                  className={`ml-1 text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="ml-2 text-sm text-gray-500">vs last month</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
