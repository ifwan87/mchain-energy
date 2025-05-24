import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import { Program, AnchorProvider, Wallet } from '@project-serum/anchor'
import fs from 'fs'
import path from 'path'

export interface BlockchainConfig {
  connection: Connection
  energyCreditProgram: Program | null
  energyMarketProgram: Program | null
  energyOracleProgram: Program | null
  wallet: Wallet
}

let blockchainConfig: BlockchainConfig | null = null

export async function initializeBlockchain(): Promise<BlockchainConfig> {
  try {
    // Get RPC endpoint from environment
    const rpcEndpoint = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com'
    
    // Create connection
    const connection = new Connection(rpcEndpoint, 'confirmed')
    
    // Load or create wallet
    const walletPath = process.env.WALLET_PATH || path.join(__dirname, '../../wallet.json')
    let keypair: Keypair
    
    if (fs.existsSync(walletPath)) {
      const secretKey = JSON.parse(fs.readFileSync(walletPath, 'utf8'))
      keypair = Keypair.fromSecretKey(new Uint8Array(secretKey))
    } else {
      // Generate new keypair for development
      keypair = Keypair.generate()
      fs.writeFileSync(walletPath, JSON.stringify(Array.from(keypair.secretKey)))
      console.log(`Generated new wallet: ${keypair.publicKey.toString()}`)
    }
    
    const wallet = new Wallet(keypair)
    
    // Create provider
    const provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    })
    
    // Initialize programs (placeholder - would load actual IDLs in production)
    let energyCreditProgram = null
    let energyMarketProgram = null
    let energyOracleProgram = null
    
    try {
      // Load program IDLs and initialize programs
      // const energyCreditIdl = JSON.parse(fs.readFileSync('path/to/energy_credit.json', 'utf8'))
      // energyCreditProgram = new Program(energyCreditIdl, new PublicKey(process.env.ENERGY_CREDIT_PROGRAM_ID!), provider)
      
      console.log('⚠️  Program IDLs not loaded - using mock programs for development')
    } catch (error) {
      console.warn('Could not load program IDLs:', error)
    }
    
    blockchainConfig = {
      connection,
      energyCreditProgram,
      energyMarketProgram,
      energyOracleProgram,
      wallet,
    }
    
    // Test connection
    const balance = await connection.getBalance(wallet.publicKey)
    console.log(`Wallet balance: ${balance / 1e9} SOL`)
    
    return blockchainConfig
    
  } catch (error) {
    console.error('Failed to initialize blockchain:', error)
    throw error
  }
}

export function getBlockchainConfig(): BlockchainConfig {
  if (!blockchainConfig) {
    throw new Error('Blockchain not initialized. Call initializeBlockchain() first.')
  }
  return blockchainConfig
}

export async function getEnergyBalance(userPublicKey: string): Promise<number> {
  try {
    const config = getBlockchainConfig()
    
    // In production, this would query the actual token account
    // For now, return mock data
    return Math.random() * 1000
    
  } catch (error) {
    console.error('Error getting energy balance:', error)
    return 0
  }
}

export async function submitMeterReading(
  meterId: string,
  readingValue: number,
  readingType: 'production' | 'consumption',
  signature: string
): Promise<string> {
  try {
    const config = getBlockchainConfig()
    
    // In production, this would call the oracle program
    console.log(`Submitting reading: ${meterId} = ${readingValue} kWh (${readingType})`)
    
    // Mock transaction signature
    return 'mock_tx_signature_' + Date.now()
    
  } catch (error) {
    console.error('Error submitting meter reading:', error)
    throw error
  }
}

export async function createEnergyOffer(
  energyAmount: number,
  pricePerKwh: number,
  offerType: string,
  duration: number
): Promise<string> {
  try {
    const config = getBlockchainConfig()
    
    // In production, this would call the market program
    console.log(`Creating offer: ${energyAmount} kWh at $${pricePerKwh}/kWh`)
    
    // Mock transaction signature
    return 'mock_offer_tx_' + Date.now()
    
  } catch (error) {
    console.error('Error creating energy offer:', error)
    throw error
  }
}

export async function executeTrade(
  offerId: string,
  amount: number,
  buyerPublicKey: string
): Promise<string> {
  try {
    const config = getBlockchainConfig()
    
    // In production, this would call the market program
    console.log(`Executing trade: ${amount} kWh from offer ${offerId}`)
    
    // Mock transaction signature
    return 'mock_trade_tx_' + Date.now()
    
  } catch (error) {
    console.error('Error executing trade:', error)
    throw error
  }
}
