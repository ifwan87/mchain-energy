import axios, { AxiosInstance } from 'axios'
import crypto from 'crypto'

export interface MasChainConfig {
  apiClient: AxiosInstance
  apiKey: string
  apiSecret: string
  projectId: string
  environment: 'testnet' | 'mainnet'
  baseUrl: string
  explorerUrl: string
}

export interface EnergyContract {
  contractId: string
  contractAddress: string
  tokenSymbol: string
  totalSupply: number
}

export interface WalletInfo {
  walletId: string
  walletAddress: string
  balance: number
}

let masChainConfig: MasChainConfig | null = null

export async function initializeMasChain(): Promise<MasChainConfig> {
  try {
    // Get MasChain configuration from environment
    const environment = (process.env.MASCHAIN_ENVIRONMENT as 'testnet' | 'mainnet') || 'testnet'
    const apiKey = process.env.MASCHAIN_API_KEY
    const apiSecret = process.env.MASCHAIN_API_SECRET
    const projectId = process.env.MASCHAIN_PROJECT_ID

    if (!apiKey || !apiSecret || !projectId) {
      throw new Error('Missing MasChain configuration. Please set MASCHAIN_API_KEY, MASCHAIN_API_SECRET, and MASCHAIN_PROJECT_ID')
    }

    // Set base URLs based on environment
    const baseUrl = environment === 'mainnet'
      ? 'https://service.maschain.com'
      : 'https://service-testnet.maschain.com'

    const explorerUrl = environment === 'mainnet'
      ? 'https://explorer.maschain.com'
      : 'https://explorer-testnet.maschain.com'

    // Create authenticated API client
    const apiClient = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-API-Secret': apiSecret,
        'X-Project-ID': projectId,
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor for additional security
    apiClient.interceptors.request.use((config) => {
      const timestamp = Date.now().toString()
      const nonce = crypto.randomBytes(16).toString('hex')

      config.headers['X-Timestamp'] = timestamp
      config.headers['X-Nonce'] = nonce

      return config
    })

    // Add response interceptor for error handling
    apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('MasChain API Error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )

    masChainConfig = {
      apiClient,
      apiKey,
      apiSecret,
      projectId,
      environment,
      baseUrl,
      explorerUrl,
    }

    // Test API connection
    await testMasChainConnection()

    console.log(`✅ MasChain L1 initialized successfully on ${environment}`)
    console.log(`🔗 Explorer: ${explorerUrl}`)

    return masChainConfig

  } catch (error) {
    console.error('Failed to initialize MasChain L1:', error)
    throw error
  }
}

async function testMasChainConnection(): Promise<void> {
  try {
    const config = getMasChainConfig()
    const response = await config.apiClient.get('/api/v1/health')
    console.log('✅ MasChain API connection successful')
  } catch (error) {
    console.warn('⚠️ MasChain API connection test failed:', error)
  }
}

export function getMasChainConfig(): MasChainConfig {
  if (!masChainConfig) {
    throw new Error('MasChain not initialized. Call initializeMasChain() first.')
  }
  return masChainConfig
}

// Energy Credit Token Management
export async function createEnergyToken(): Promise<EnergyContract> {
  try {
    const config = getMasChainConfig()

    const tokenData = {
      name: 'Energy Credit',
      symbol: 'EC',
      decimals: 3,
      totalSupply: 1000000000, // 1 billion EC tokens
      description: 'Energy Credit tokens for peer-to-peer energy trading'
    }

    const response = await config.apiClient.post('/api/v1/token/create', tokenData)

    return {
      contractId: response.data.contractId,
      contractAddress: response.data.contractAddress,
      tokenSymbol: response.data.symbol,
      totalSupply: response.data.totalSupply
    }

  } catch (error) {
    console.error('Error creating energy token:', error)
    throw error
  }
}

// Wallet Management
export async function createUserWallet(userId: string): Promise<WalletInfo> {
  try {
    const config = getMasChainConfig()

    const walletData = {
      userId: userId,
      walletType: 'energy_trading',
      metadata: {
        purpose: 'Energy trading wallet',
        createdAt: new Date().toISOString()
      }
    }

    const response = await config.apiClient.post('/api/v1/wallet/create', walletData)

    return {
      walletId: response.data.walletId,
      walletAddress: response.data.walletAddress,
      balance: 0
    }

  } catch (error) {
    console.error('Error creating user wallet:', error)
    throw error
  }
}

export async function getEnergyBalance(walletAddress: string): Promise<number> {
  try {
    const config = getMasChainConfig()

    const response = await config.apiClient.get(`/api/v1/wallet/${walletAddress}/balance`)

    return response.data.balance || 0

  } catch (error) {
    console.error('Error getting energy balance:', error)
    return 0
  }
}

// Energy Trading Functions
export async function submitMeterReading(
  meterId: string,
  readingValue: number,
  readingType: 'production' | 'consumption',
  signature: string
): Promise<string> {
  try {
    const config = getMasChainConfig()

    const readingData = {
      meterId,
      readingValue,
      readingType,
      timestamp: new Date().toISOString(),
      signature,
      metadata: {
        source: 'iot_meter',
        verified: true
      }
    }

    const response = await config.apiClient.post('/api/v1/oracle/submit-reading', readingData)

    console.log(`✅ Submitted reading: ${meterId} = ${readingValue} kWh (${readingType})`)

    return response.data.transactionId

  } catch (error) {
    console.error('Error submitting meter reading:', error)
    throw error
  }
}

export async function createEnergyOffer(
  sellerWallet: string,
  energyAmount: number,
  pricePerKwh: number,
  offerType: string,
  duration: number
): Promise<string> {
  try {
    const config = getMasChainConfig()

    const offerData = {
      sellerWallet,
      energyAmount,
      pricePerKwh,
      offerType,
      duration,
      expiresAt: new Date(Date.now() + duration * 60 * 1000).toISOString(),
      metadata: {
        energySource: 'solar',
        location: 'residential',
        createdAt: new Date().toISOString()
      }
    }

    const response = await config.apiClient.post('/api/v1/market/create-offer', offerData)

    console.log(`✅ Created offer: ${energyAmount} kWh at $${pricePerKwh}/kWh`)

    return response.data.offerId

  } catch (error) {
    console.error('Error creating energy offer:', error)
    throw error
  }
}

export async function executeTrade(
  offerId: string,
  buyerWallet: string,
  amount: number
): Promise<string> {
  try {
    const config = getMasChainConfig()

    const tradeData = {
      offerId,
      buyerWallet,
      amount,
      timestamp: new Date().toISOString()
    }

    const response = await config.apiClient.post('/api/v1/market/execute-trade', tradeData)

    console.log(`✅ Executed trade: ${amount} kWh for offer ${offerId}`)

    return response.data.transactionId

  } catch (error) {
    console.error('Error executing trade:', error)
    throw error
  }
}

// Utility Functions
export async function getTransactionStatus(transactionId: string): Promise<any> {
  try {
    const config = getMasChainConfig()

    const response = await config.apiClient.get(`/api/v1/transaction/${transactionId}`)

    return response.data

  } catch (error) {
    console.error('Error getting transaction status:', error)
    throw error
  }
}

export function getExplorerUrl(transactionId: string): string {
  const config = getMasChainConfig()
  return `${config.explorerUrl}/tx/${transactionId}`
}


