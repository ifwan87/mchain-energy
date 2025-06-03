'use client'

import { FC, ReactNode, createContext, useContext, useState, useEffect } from 'react'

interface MasChainWallet {
  walletId: string | null
  walletAddress: string | null
  balance: number
  isConnected: boolean
  isConnecting: boolean
}

interface MasChainWalletContextType {
  wallet: MasChainWallet
  connect: () => Promise<void>
  disconnect: () => void
  getBalance: () => Promise<number>
  sendTransaction: (to: string, amount: number) => Promise<string>
}

const MasChainWalletContext = createContext<MasChainWalletContextType | undefined>(undefined)

interface MasChainWalletProviderProps {
  children: ReactNode
}

export const MasChainWalletProvider: FC<MasChainWalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<MasChainWallet>({
    walletId: null,
    walletAddress: null,
    balance: 0,
    isConnected: false,
    isConnecting: false,
  })

  // Check for existing wallet connection on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('maschain_wallet')
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet)
        setWallet(prev => ({
          ...prev,
          walletId: walletData.walletId,
          walletAddress: walletData.walletAddress,
          isConnected: true,
        }))
        // Refresh balance
        getBalance()
      } catch (error) {
        console.error('Error loading saved wallet:', error)
        localStorage.removeItem('maschain_wallet')
      }
    }
  }, [])

  const connect = async (): Promise<void> => {
    try {
      setWallet(prev => ({ ...prev, isConnecting: true }))

      // Check if MasWallet is available
      if (typeof window !== 'undefined' && (window as any).masWallet) {
        // Use MasWallet if available
        const masWallet = (window as any).masWallet
        const response = await masWallet.connect()
        
        setWallet(prev => ({
          ...prev,
          walletId: response.walletId,
          walletAddress: response.walletAddress,
          isConnected: true,
          isConnecting: false,
        }))

        // Save to localStorage
        localStorage.setItem('maschain_wallet', JSON.stringify({
          walletId: response.walletId,
          walletAddress: response.walletAddress,
        }))

        // Get initial balance
        await getBalance()

      } else {
        // Fallback: Create demo wallet for development
        const demoWallet = await createDemoWallet()
        
        setWallet(prev => ({
          ...prev,
          walletId: demoWallet.walletId,
          walletAddress: demoWallet.walletAddress,
          balance: 1000, // Demo balance
          isConnected: true,
          isConnecting: false,
        }))

        // Save to localStorage
        localStorage.setItem('maschain_wallet', JSON.stringify({
          walletId: demoWallet.walletId,
          walletAddress: demoWallet.walletAddress,
        }))

        console.log('✅ Connected to demo MasChain wallet')
      }

    } catch (error) {
      console.error('Error connecting to MasChain wallet:', error)
      setWallet(prev => ({ ...prev, isConnecting: false }))
      throw error
    }
  }

  const disconnect = (): void => {
    setWallet({
      walletId: null,
      walletAddress: null,
      balance: 0,
      isConnected: false,
      isConnecting: false,
    })
    localStorage.removeItem('maschain_wallet')
    console.log('✅ Disconnected from MasChain wallet')
  }

  const getBalance = async (): Promise<number> => {
    try {
      if (!wallet.walletAddress) {
        return 0
      }

      // Call MasChain API to get balance
      const response = await fetch('/api/wallet/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: wallet.walletAddress,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const balance = data.balance || 0
        
        setWallet(prev => ({ ...prev, balance }))
        return balance
      } else {
        console.error('Error fetching balance from API')
        return 0
      }

    } catch (error) {
      console.error('Error getting wallet balance:', error)
      return 0
    }
  }

  const sendTransaction = async (to: string, amount: number): Promise<string> => {
    try {
      if (!wallet.walletAddress) {
        throw new Error('Wallet not connected')
      }

      const response = await fetch('/api/wallet/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: wallet.walletAddress,
          to,
          amount,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Refresh balance after transaction
        await getBalance()
        
        return data.transactionId
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Transaction failed')
      }

    } catch (error) {
      console.error('Error sending transaction:', error)
      throw error
    }
  }

  const createDemoWallet = async (): Promise<{ walletId: string; walletAddress: string }> => {
    try {
      const response = await fetch('/api/wallet/create-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: `demo_user_${Date.now()}`,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          walletId: data.walletId,
          walletAddress: data.walletAddress,
        }
      } else {
        throw new Error('Failed to create demo wallet')
      }

    } catch (error) {
      console.error('Error creating demo wallet:', error)
      // Fallback to local demo wallet
      return {
        walletId: `demo_wallet_${Date.now()}`,
        walletAddress: `maschain_demo_${Math.random().toString(36).substring(7)}`,
      }
    }
  }

  const contextValue: MasChainWalletContextType = {
    wallet,
    connect,
    disconnect,
    getBalance,
    sendTransaction,
  }

  return (
    <MasChainWalletContext.Provider value={contextValue}>
      {children}
    </MasChainWalletContext.Provider>
  )
}

// Hook to use MasChain wallet context
export const useMasChainWallet = (): MasChainWalletContextType => {
  const context = useContext(MasChainWalletContext)
  if (context === undefined) {
    throw new Error('useMasChainWallet must be used within a MasChainWalletProvider')
  }
  return context
}

// Wallet connection button component
export const MasChainWalletButton: FC<{ className?: string }> = ({ className = '' }) => {
  const { wallet, connect, disconnect } = useMasChainWallet()

  const handleClick = async () => {
    if (wallet.isConnected) {
      disconnect()
    } else {
      try {
        await connect()
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={wallet.isConnecting}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        wallet.isConnected
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-primary-600 hover:bg-primary-700 text-white'
      } ${wallet.isConnecting ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {wallet.isConnecting
        ? 'Connecting...'
        : wallet.isConnected
        ? `Connected: ${wallet.walletAddress?.substring(0, 8)}...`
        : 'Connect MasChain Wallet'
      }
    </button>
  )
}

// Wallet info display component
export const MasChainWalletInfo: FC<{ className?: string }> = ({ className = '' }) => {
  const { wallet, getBalance } = useMasChainWallet()

  useEffect(() => {
    if (wallet.isConnected) {
      getBalance()
    }
  }, [wallet.isConnected])

  if (!wallet.isConnected) {
    return null
  }

  return (
    <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-2">MasChain Wallet</h3>
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Address:</span>{' '}
          <span className="font-mono">{wallet.walletAddress}</span>
        </div>
        <div>
          <span className="font-medium">Balance:</span>{' '}
          <span className="font-mono">{wallet.balance.toFixed(3)} EC</span>
        </div>
      </div>
    </div>
  )
}
