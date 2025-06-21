'use client'

import { FC, ReactNode, createContext, useContext, useState, useMemo } from 'react'

// Function to generate a random, realistic-looking wallet address
const generateRandomAddress = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let address = 'DEMO';
  for (let i = 0; i < 40; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return address;
};

interface WalletContextType {
  connected: boolean
  publicKey: string
  connect: () => void
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false)
  // Generate a memoized random address so it doesn't change on re-renders
  const publicKey = useMemo(() => generateRandomAddress(), []);

  const connect = () => {
    setConnected(true)
  }

  const disconnect = () => {
    setConnected(false)
  }

  return (
    <WalletContext.Provider value={{ connected, publicKey, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
