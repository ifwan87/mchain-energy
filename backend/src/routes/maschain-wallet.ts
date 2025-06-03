import express from 'express'
import { getMasChainConfig, createUserWallet, getEnergyBalance, executeTrade } from '../config/blockchain'

const router = express.Router()

/**
 * Create a demo wallet for development/testing
 */
router.post('/create-demo', async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    const wallet = await createUserWallet(userId)

    res.json({
      success: true,
      walletId: wallet.walletId,
      walletAddress: wallet.walletAddress,
      balance: wallet.balance,
    })

  } catch (error) {
    console.error('Error creating demo wallet:', error)
    res.status(500).json({ 
      error: 'Failed to create demo wallet',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * Get wallet balance
 */
router.post('/balance', async (req, res) => {
  try {
    const { walletAddress } = req.body

    if (!walletAddress) {
      return res.status(400).json({ error: 'walletAddress is required' })
    }

    const balance = await getEnergyBalance(walletAddress)

    res.json({
      success: true,
      walletAddress,
      balance,
      currency: 'EC', // Energy Credits
    })

  } catch (error) {
    console.error('Error getting wallet balance:', error)
    res.status(500).json({ 
      error: 'Failed to get wallet balance',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * Send energy credits (simplified transaction)
 */
router.post('/send', async (req, res) => {
  try {
    const { from, to, amount } = req.body

    if (!from || !to || !amount) {
      return res.status(400).json({ error: 'from, to, and amount are required' })
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'amount must be greater than 0' })
    }

    // For demo purposes, we'll simulate a transaction
    // In production, this would call MasChain's transaction API
    const config = getMasChainConfig()
    
    const transactionData = {
      from,
      to,
      amount,
      tokenType: 'EC',
      timestamp: new Date().toISOString(),
      metadata: {
        type: 'energy_credit_transfer',
        description: `Transfer of ${amount} EC from ${from} to ${to}`
      }
    }

    const response = await config.apiClient.post('/api/v1/transaction/send', transactionData)

    res.json({
      success: true,
      transactionId: response.data.transactionId,
      from,
      to,
      amount,
      status: 'pending',
      explorerUrl: `${config.explorerUrl}/tx/${response.data.transactionId}`
    })

  } catch (error) {
    console.error('Error sending transaction:', error)
    res.status(500).json({ 
      error: 'Failed to send transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * Get transaction history for a wallet
 */
router.get('/transactions/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const { limit = 10, offset = 0 } = req.query

    if (!walletAddress) {
      return res.status(400).json({ error: 'walletAddress is required' })
    }

    const config = getMasChainConfig()
    
    const response = await config.apiClient.get(`/api/v1/wallet/${walletAddress}/transactions`, {
      params: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    })

    res.json({
      success: true,
      walletAddress,
      transactions: response.data.transactions || [],
      total: response.data.total || 0,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    })

  } catch (error) {
    console.error('Error getting transaction history:', error)
    res.status(500).json({ 
      error: 'Failed to get transaction history',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * Get wallet information
 */
router.get('/info/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params

    if (!walletAddress) {
      return res.status(400).json({ error: 'walletAddress is required' })
    }

    const config = getMasChainConfig()
    
    // Get wallet info and balance
    const [walletResponse, balance] = await Promise.all([
      config.apiClient.get(`/api/v1/wallet/${walletAddress}`),
      getEnergyBalance(walletAddress)
    ])

    res.json({
      success: true,
      walletAddress,
      balance,
      walletInfo: walletResponse.data,
      network: config.environment,
      explorerUrl: `${config.explorerUrl}/address/${walletAddress}`
    })

  } catch (error) {
    console.error('Error getting wallet info:', error)
    res.status(500).json({ 
      error: 'Failed to get wallet info',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * Execute energy trade
 */
router.post('/trade', async (req, res) => {
  try {
    const { offerId, buyerWallet, amount } = req.body

    if (!offerId || !buyerWallet || !amount) {
      return res.status(400).json({ error: 'offerId, buyerWallet, and amount are required' })
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'amount must be greater than 0' })
    }

    const transactionId = await executeTrade(offerId, buyerWallet, amount)

    const config = getMasChainConfig()

    res.json({
      success: true,
      transactionId,
      offerId,
      buyerWallet,
      amount,
      status: 'pending',
      explorerUrl: `${config.explorerUrl}/tx/${transactionId}`
    })

  } catch (error) {
    console.error('Error executing trade:', error)
    res.status(500).json({ 
      error: 'Failed to execute trade',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

/**
 * Get MasChain network status
 */
router.get('/network-status', async (req, res) => {
  try {
    const config = getMasChainConfig()
    
    const response = await config.apiClient.get('/api/v1/network/status')

    res.json({
      success: true,
      network: config.environment,
      status: response.data,
      endpoints: {
        api: config.baseUrl,
        explorer: config.explorerUrl
      }
    })

  } catch (error) {
    console.error('Error getting network status:', error)
    res.status(500).json({ 
      error: 'Failed to get network status',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router
