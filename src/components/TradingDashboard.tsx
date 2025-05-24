'use client'

import { useState } from 'react'
import { 
  PlusIcon, 
  XMarkIcon,
  BoltIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useEnergyStore } from '@/store/energyStore'
import toast from 'react-hot-toast'

export default function TradingDashboard() {
  const { 
    marketData, 
    userOffers, 
    isLoading, 
    createOffer, 
    cancelOffer, 
    executeTrade,
    fetchUserOffers 
  } = useEnergyStore()
  
  const [showCreateOffer, setShowCreateOffer] = useState(false)
  const [offerForm, setOfferForm] = useState({
    energyAmount: '',
    pricePerKwh: '',
    offerType: 'immediate' as 'immediate' | 'scheduled' | 'recurring',
    duration: '24',
  })

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!offerForm.energyAmount || !offerForm.pricePerKwh) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await createOffer({
        seller: 'You',
        energyAmount: parseFloat(offerForm.energyAmount),
        pricePerKwh: parseFloat(offerForm.pricePerKwh),
        offerType: offerForm.offerType,
        expiresAt: Date.now() + (parseInt(offerForm.duration) * 3600000),
      })
      
      toast.success('Offer created successfully!')
      setShowCreateOffer(false)
      setOfferForm({
        energyAmount: '',
        pricePerKwh: '',
        offerType: 'immediate',
        duration: '24',
      })
      fetchUserOffers()
    } catch (error) {
      toast.error('Failed to create offer')
    }
  }

  const handleCancelOffer = async (offerId: string) => {
    try {
      await cancelOffer(offerId)
      toast.success('Offer cancelled successfully!')
      fetchUserOffers()
    } catch (error) {
      toast.error('Failed to cancel offer')
    }
  }

  const handleBuyEnergy = async (offerId: string, amount: number) => {
    try {
      await executeTrade(offerId, amount)
      toast.success('Trade executed successfully!')
    } catch (error) {
      toast.error('Failed to execute trade')
    }
  }

  const formatPrice = (value: number) => `$${value.toFixed(3)}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Energy Trading</h2>
        <button
          onClick={() => setShowCreateOffer(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Offer
        </button>
      </div>

      {/* Create Offer Modal */}
      {showCreateOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create Energy Offer</h3>
              <button
                onClick={() => setShowCreateOffer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Energy Amount (kWh)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={offerForm.energyAmount}
                  onChange={(e) => setOfferForm({ ...offerForm, energyAmount: e.target.value })}
                  className="input-field"
                  placeholder="100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per kWh ($)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={offerForm.pricePerKwh}
                  onChange={(e) => setOfferForm({ ...offerForm, pricePerKwh: e.target.value })}
                  className="input-field"
                  placeholder="0.120"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Type
                </label>
                <select
                  value={offerForm.offerType}
                  onChange={(e) => setOfferForm({ ...offerForm, offerType: e.target.value as any })}
                  className="input-field"
                >
                  <option value="immediate">Immediate</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="recurring">Recurring</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (hours)
                </label>
                <select
                  value={offerForm.duration}
                  onChange={(e) => setOfferForm({ ...offerForm, duration: e.target.value })}
                  className="input-field"
                >
                  <option value="1">1 hour</option>
                  <option value="6">6 hours</option>
                  <option value="24">24 hours</option>
                  <option value="168">1 week</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateOffer(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="loading-spinner mr-2" />
                  ) : null}
                  Create Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Your Offers */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Offers</h3>
        
        {userOffers.length === 0 ? (
          <div className="text-center py-8">
            <BoltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">You haven't created any offers yet</p>
            <button
              onClick={() => setShowCreateOffer(true)}
              className="btn-primary mt-4"
            >
              Create Your First Offer
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userOffers.map((offer) => {
              const progress = (offer.filledAmount / offer.energyAmount) * 100
              const timeLeft = Math.max(0, offer.expiresAt - Date.now())
              const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
              
              return (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {offer.energyAmount} kWh at {formatPrice(offer.pricePerKwh)}/kWh
                          </p>
                          <p className="text-sm text-gray-500">
                            {offer.filledAmount} / {offer.energyAmount} kWh filled
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            offer.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : offer.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {offer.status}
                          </span>
                          
                          {offer.status === 'active' && (
                            <span className="text-xs text-gray-500 flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {hoursLeft > 0 ? `${hoursLeft}h left` : 'Expired'}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {offer.status === 'active' && (
                      <button
                        onClick={() => handleCancelOffer(offer.id)}
                        disabled={isLoading}
                        className="ml-4 text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Market Offers */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Market Offers</h3>
        
        {marketData.activeOffers.length === 0 ? (
          <div className="text-center py-8">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No offers available in the market</p>
          </div>
        ) : (
          <div className="space-y-4">
            {marketData.activeOffers.map((offer) => {
              const available = offer.energyAmount - offer.filledAmount
              const timeLeft = Math.max(0, offer.expiresAt - Date.now())
              const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
              
              return (
                <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {offer.seller}
                          </p>
                          <p className="text-sm text-gray-600">
                            {available} kWh available at {formatPrice(offer.pricePerKwh)}/kWh
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Total: {formatPrice(available * offer.pricePerKwh)}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            offer.offerType === 'immediate' 
                              ? 'bg-green-100 text-green-800'
                              : offer.offerType === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {offer.offerType}
                          </span>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {hoursLeft > 0 ? `${hoursLeft}h left` : 'Expired'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleBuyEnergy(offer.id, available)}
                      disabled={isLoading || available <= 0 || hoursLeft <= 0}
                      className="ml-4 btn-primary disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="loading-spinner" />
                      ) : (
                        'Buy Energy'
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
