import { create } from 'zustand'

export interface EnergyReading {
  id: string
  meterId: string
  value: number
  type: 'production' | 'consumption'
  timestamp: number
  verified: boolean
}

export interface EnergyOffer {
  id: string
  seller: string
  energyAmount: number
  pricePerKwh: number
  offerType: 'immediate' | 'scheduled' | 'recurring'
  status: 'active' | 'completed' | 'cancelled' | 'expired'
  createdAt: number
  expiresAt: number
  filledAmount: number
}

export interface EnergyStats {
  totalProduction: number
  totalConsumption: number
  currentBalance: number
  creditsEarned: number
  creditsSpent: number
  carbonOffset: number
}

export interface MarketData {
  totalOffers: number
  totalVolumeTraded: number
  averagePrice: number
  activeOffers: EnergyOffer[]
  recentTrades: any[]
  priceHistory: { timestamp: number; price: number }[]
}

interface EnergyStore {
  // State
  energyData: EnergyStats
  marketData: MarketData
  userOffers: EnergyOffer[]
  recentReadings: EnergyReading[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchEnergyData: () => Promise<void>
  fetchMarketData: () => Promise<void>
  fetchUserOffers: () => Promise<void>
  createOffer: (offer: Omit<EnergyOffer, 'id' | 'createdAt' | 'status' | 'filledAmount'>) => Promise<void>
  cancelOffer: (offerId: string) => Promise<void>
  executeTrade: (offerId: string, amount: number) => Promise<void>
  submitReading: (reading: Omit<EnergyReading, 'id' | 'timestamp' | 'verified'>) => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useEnergyStore = create<EnergyStore>((set, get) => ({
  // Initial state
  energyData: {
    totalProduction: 0,
    totalConsumption: 0,
    currentBalance: 0,
    creditsEarned: 0,
    creditsSpent: 0,
    carbonOffset: 0,
  },
  marketData: {
    totalOffers: 0,
    totalVolumeTraded: 0,
    averagePrice: 0,
    activeOffers: [],
    recentTrades: [],
    priceHistory: [],
  },
  userOffers: [],
  recentReadings: [],
  isLoading: false,
  error: null,

  // Actions
  fetchEnergyData: async () => {
    set({ isLoading: true, error: null })
    try {
      // Simulate API call - replace with actual blockchain calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const energyData: EnergyStats = {
        totalProduction: 1250.5,
        totalConsumption: 980.2,
        currentBalance: 270.3,
        creditsEarned: 1250,
        creditsSpent: 980,
        carbonOffset: 625.25,
      }
      
      set({ energyData, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch energy data', isLoading: false })
    }
  },

  fetchMarketData: async () => {
    set({ isLoading: true, error: null })
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock data
      const mockOffers: EnergyOffer[] = [
        {
          id: '1',
          seller: 'Solar Farm A',
          energyAmount: 100,
          pricePerKwh: 0.12,
          offerType: 'immediate',
          status: 'active',
          createdAt: Date.now() - 3600000,
          expiresAt: Date.now() + 7200000,
          filledAmount: 0,
        },
        {
          id: '2',
          seller: 'Wind Farm B',
          energyAmount: 250,
          pricePerKwh: 0.10,
          offerType: 'immediate',
          status: 'active',
          createdAt: Date.now() - 1800000,
          expiresAt: Date.now() + 5400000,
          filledAmount: 50,
        },
      ]

      const priceHistory = Array.from({ length: 24 }, (_, i) => ({
        timestamp: Date.now() - (23 - i) * 3600000,
        price: 0.08 + Math.random() * 0.08,
      }))
      
      const marketData: MarketData = {
        totalOffers: 15,
        totalVolumeTraded: 5420.8,
        averagePrice: 0.115,
        activeOffers: mockOffers,
        recentTrades: [],
        priceHistory,
      }
      
      set({ marketData, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch market data', isLoading: false })
    }
  },

  fetchUserOffers: async () => {
    set({ isLoading: true, error: null })
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock user offers
      const userOffers: EnergyOffer[] = [
        {
          id: 'user-1',
          seller: 'You',
          energyAmount: 50,
          pricePerKwh: 0.13,
          offerType: 'immediate',
          status: 'active',
          createdAt: Date.now() - 900000,
          expiresAt: Date.now() + 6300000,
          filledAmount: 15,
        },
      ]
      
      set({ userOffers, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch user offers', isLoading: false })
    }
  },

  createOffer: async (offerData) => {
    set({ isLoading: true, error: null })
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newOffer: EnergyOffer = {
        ...offerData,
        id: `offer-${Date.now()}`,
        createdAt: Date.now(),
        status: 'active',
        filledAmount: 0,
      }
      
      set(state => ({
        userOffers: [...state.userOffers, newOffer],
        marketData: {
          ...state.marketData,
          activeOffers: [...state.marketData.activeOffers, newOffer],
        },
        isLoading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to create offer', isLoading: false })
    }
  },

  cancelOffer: async (offerId) => {
    set({ isLoading: true, error: null })
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      set(state => ({
        userOffers: state.userOffers.map(offer =>
          offer.id === offerId ? { ...offer, status: 'cancelled' as const } : offer
        ),
        marketData: {
          ...state.marketData,
          activeOffers: state.marketData.activeOffers.filter(offer => offer.id !== offerId),
        },
        isLoading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to cancel offer', isLoading: false })
    }
  },

  executeTrade: async (offerId, amount) => {
    set({ isLoading: true, error: null })
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      set(state => ({
        marketData: {
          ...state.marketData,
          activeOffers: state.marketData.activeOffers.map(offer =>
            offer.id === offerId
              ? { ...offer, filledAmount: offer.filledAmount + amount }
              : offer
          ),
        },
        isLoading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to execute trade', isLoading: false })
    }
  },

  submitReading: async (readingData) => {
    set({ isLoading: true, error: null })
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newReading: EnergyReading = {
        ...readingData,
        id: `reading-${Date.now()}`,
        timestamp: Date.now(),
        verified: true,
      }
      
      set(state => ({
        recentReadings: [newReading, ...state.recentReadings.slice(0, 9)],
        isLoading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to submit reading', isLoading: false })
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
