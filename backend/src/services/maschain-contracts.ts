import { getMasChainConfig } from '../config/blockchain'

export interface SmartContractTemplate {
  name: string
  description: string
  functions: string[]
  parameters: Record<string, any>
}

export interface DeployedContract {
  contractId: string
  contractAddress: string
  transactionId: string
  status: 'pending' | 'deployed' | 'failed'
}

/**
 * MasChain Smart Contract Management Service
 * Handles creation and deployment of energy trading smart contracts
 */
export class MasChainContractService {
  
  /**
   * Create Energy Credit Token Contract
   */
  async createEnergyTokenContract(): Promise<DeployedContract> {
    try {
      const config = getMasChainConfig()
      
      const contractTemplate: SmartContractTemplate = {
        name: 'EnergyCredit',
        description: 'Energy Credit (EC) token for peer-to-peer energy trading',
        functions: [
          'mint',
          'burn', 
          'transfer',
          'approve',
          'balanceOf',
          'totalSupply'
        ],
        parameters: {
          name: 'Energy Credit',
          symbol: 'EC',
          decimals: 3,
          initialSupply: 0,
          mintable: true,
          burnable: true,
          pausable: true,
          metadata: {
            description: 'Tokenized energy credits for renewable energy trading',
            website: 'https://energy-trading.maschain.com',
            logo: 'https://energy-trading.maschain.com/logo.png'
          }
        }
      }
      
      const response = await config.apiClient.post('/api/v1/smart-contract/create', {
        template: 'ERC20_TOKEN',
        name: contractTemplate.name,
        description: contractTemplate.description,
        parameters: contractTemplate.parameters
      })
      
      console.log('✅ Energy Credit token contract created:', response.data.contractId)
      
      return {
        contractId: response.data.contractId,
        contractAddress: response.data.contractAddress,
        transactionId: response.data.transactionId,
        status: response.data.status
      }
      
    } catch (error) {
      console.error('Error creating energy token contract:', error)
      throw error
    }
  }
  
  /**
   * Create Energy Marketplace Contract
   */
  async createEnergyMarketContract(): Promise<DeployedContract> {
    try {
      const config = getMasChainConfig()
      
      const contractTemplate: SmartContractTemplate = {
        name: 'EnergyMarketplace',
        description: 'Decentralized marketplace for energy trading',
        functions: [
          'createOffer',
          'cancelOffer',
          'executeTrade',
          'getOffer',
          'getActiveOffers',
          'updateOfferPrice'
        ],
        parameters: {
          energyTokenAddress: '', // Will be set after token contract deployment
          feePercentage: 250, // 2.5% platform fee
          minOfferAmount: 1000, // Minimum 1 kWh
          maxOfferDuration: 86400, // 24 hours max
          metadata: {
            description: 'Peer-to-peer energy trading marketplace',
            version: '1.0.0',
            features: ['instant_settlement', 'automated_matching', 'price_discovery']
          }
        }
      }
      
      const response = await config.apiClient.post('/api/v1/smart-contract/create', {
        template: 'MARKETPLACE',
        name: contractTemplate.name,
        description: contractTemplate.description,
        parameters: contractTemplate.parameters
      })
      
      console.log('✅ Energy Marketplace contract created:', response.data.contractId)
      
      return {
        contractId: response.data.contractId,
        contractAddress: response.data.contractAddress,
        transactionId: response.data.transactionId,
        status: response.data.status
      }
      
    } catch (error) {
      console.error('Error creating energy market contract:', error)
      throw error
    }
  }
  
  /**
   * Create Energy Oracle Contract
   */
  async createEnergyOracleContract(): Promise<DeployedContract> {
    try {
      const config = getMasChainConfig()
      
      const contractTemplate: SmartContractTemplate = {
        name: 'EnergyOracle',
        description: 'Oracle service for IoT energy meter data validation',
        functions: [
          'registerMeter',
          'submitReading',
          'validateReading',
          'getMeterData',
          'updateMeterStatus'
        ],
        parameters: {
          validatorThreshold: 2, // Minimum validators required
          readingValidityPeriod: 3600, // 1 hour validity
          authorizedValidators: [], // Will be populated with validator addresses
          metadata: {
            description: 'Secure oracle for energy meter data validation',
            dataTypes: ['production', 'consumption', 'storage'],
            updateFrequency: '5_minutes'
          }
        }
      }
      
      const response = await config.apiClient.post('/api/v1/smart-contract/create', {
        template: 'ORACLE',
        name: contractTemplate.name,
        description: contractTemplate.description,
        parameters: contractTemplate.parameters
      })
      
      console.log('✅ Energy Oracle contract created:', response.data.contractId)
      
      return {
        contractId: response.data.contractId,
        contractAddress: response.data.contractAddress,
        transactionId: response.data.transactionId,
        status: response.data.status
      }
      
    } catch (error) {
      console.error('Error creating energy oracle contract:', error)
      throw error
    }
  }
  
  /**
   * Deploy all energy trading contracts
   */
  async deployAllContracts(): Promise<{
    tokenContract: DeployedContract
    marketContract: DeployedContract
    oracleContract: DeployedContract
  }> {
    try {
      console.log('🚀 Starting deployment of all energy trading contracts...')
      
      // Deploy contracts in sequence
      const tokenContract = await this.createEnergyTokenContract()
      const oracleContract = await this.createEnergyOracleContract()
      const marketContract = await this.createEnergyMarketContract()
      
      // Wait for all contracts to be deployed
      await this.waitForDeployment([tokenContract, marketContract, oracleContract])
      
      console.log('✅ All energy trading contracts deployed successfully!')
      
      return {
        tokenContract,
        marketContract,
        oracleContract
      }
      
    } catch (error) {
      console.error('Error deploying contracts:', error)
      throw error
    }
  }
  
  /**
   * Wait for contract deployment to complete
   */
  private async waitForDeployment(contracts: DeployedContract[]): Promise<void> {
    const maxAttempts = 30
    const delayMs = 2000
    
    for (const contract of contracts) {
      let attempts = 0
      
      while (attempts < maxAttempts) {
        try {
          const config = getMasChainConfig()
          const response = await config.apiClient.get(`/api/v1/smart-contract/${contract.contractId}/status`)
          
          if (response.data.status === 'deployed') {
            console.log(`✅ Contract ${contract.contractId} deployed successfully`)
            break
          } else if (response.data.status === 'failed') {
            throw new Error(`Contract ${contract.contractId} deployment failed`)
          }
          
          attempts++
          await new Promise(resolve => setTimeout(resolve, delayMs))
          
        } catch (error) {
          console.error(`Error checking deployment status for ${contract.contractId}:`, error)
          attempts++
          await new Promise(resolve => setTimeout(resolve, delayMs))
        }
      }
      
      if (attempts >= maxAttempts) {
        throw new Error(`Timeout waiting for contract ${contract.contractId} deployment`)
      }
    }
  }
  
  /**
   * Get contract information
   */
  async getContractInfo(contractId: string): Promise<any> {
    try {
      const config = getMasChainConfig()
      const response = await config.apiClient.get(`/api/v1/smart-contract/${contractId}`)
      return response.data
    } catch (error) {
      console.error('Error getting contract info:', error)
      throw error
    }
  }
}

// Export singleton instance
export const masChainContractService = new MasChainContractService()
