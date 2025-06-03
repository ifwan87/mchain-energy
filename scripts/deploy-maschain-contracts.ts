#!/usr/bin/env ts-node

import { initializeMasChain } from '../backend/src/config/blockchain'
import { masChainContractService } from '../backend/src/services/maschain-contracts'
import fs from 'fs'
import path from 'path'

interface DeploymentResult {
  environment: string
  timestamp: string
  contracts: {
    energyToken: {
      contractId: string
      contractAddress: string
      transactionId: string
    }
    energyMarket: {
      contractId: string
      contractAddress: string
      transactionId: string
    }
    energyOracle: {
      contractId: string
      contractAddress: string
      transactionId: string
    }
  }
}

async function deployContracts(): Promise<void> {
  console.log('🚀 Starting MasChain L1 contract deployment...')
  
  try {
    // Initialize MasChain connection
    console.log('📡 Initializing MasChain L1 connection...')
    const config = await initializeMasChain()
    console.log(`✅ Connected to MasChain ${config.environment}`)
    
    // Deploy all contracts
    console.log('📝 Deploying smart contracts...')
    const deploymentResult = await masChainContractService.deployAllContracts()
    
    // Prepare deployment summary
    const deployment: DeploymentResult = {
      environment: config.environment,
      timestamp: new Date().toISOString(),
      contracts: {
        energyToken: {
          contractId: deploymentResult.tokenContract.contractId,
          contractAddress: deploymentResult.tokenContract.contractAddress,
          transactionId: deploymentResult.tokenContract.transactionId,
        },
        energyMarket: {
          contractId: deploymentResult.marketContract.contractId,
          contractAddress: deploymentResult.marketContract.contractAddress,
          transactionId: deploymentResult.marketContract.transactionId,
        },
        energyOracle: {
          contractId: deploymentResult.oracleContract.contractId,
          contractAddress: deploymentResult.oracleContract.contractAddress,
          transactionId: deploymentResult.oracleContract.transactionId,
        },
      },
    }
    
    // Save deployment results
    const deploymentDir = path.join(__dirname, '../deployments')
    if (!fs.existsSync(deploymentDir)) {
      fs.mkdirSync(deploymentDir, { recursive: true })
    }
    
    const deploymentFile = path.join(
      deploymentDir,
      `maschain-${config.environment}-${Date.now()}.json`
    )
    
    fs.writeFileSync(deploymentFile, JSON.stringify(deployment, null, 2))
    
    // Update environment file with contract addresses
    await updateEnvironmentFile(deployment)
    
    // Display deployment summary
    console.log('\n🎉 Deployment completed successfully!')
    console.log('=' .repeat(60))
    console.log(`📊 Deployment Summary`)
    console.log('=' .repeat(60))
    console.log(`Environment: ${deployment.environment}`)
    console.log(`Timestamp: ${deployment.timestamp}`)
    console.log(`Deployment file: ${deploymentFile}`)
    console.log('')
    
    console.log('📋 Contract Details:')
    console.log(`Energy Token Contract:`)
    console.log(`  Contract ID: ${deployment.contracts.energyToken.contractId}`)
    console.log(`  Address: ${deployment.contracts.energyToken.contractAddress}`)
    console.log(`  Transaction: ${config.explorerUrl}/tx/${deployment.contracts.energyToken.transactionId}`)
    console.log('')
    
    console.log(`Energy Market Contract:`)
    console.log(`  Contract ID: ${deployment.contracts.energyMarket.contractId}`)
    console.log(`  Address: ${deployment.contracts.energyMarket.contractAddress}`)
    console.log(`  Transaction: ${config.explorerUrl}/tx/${deployment.contracts.energyMarket.transactionId}`)
    console.log('')
    
    console.log(`Energy Oracle Contract:`)
    console.log(`  Contract ID: ${deployment.contracts.energyOracle.contractId}`)
    console.log(`  Address: ${deployment.contracts.energyOracle.contractAddress}`)
    console.log(`  Transaction: ${config.explorerUrl}/tx/${deployment.contracts.energyOracle.transactionId}`)
    console.log('')
    
    console.log('🔗 Explorer Links:')
    console.log(`Explorer: ${config.explorerUrl}`)
    console.log(`API: ${config.baseUrl}`)
    console.log('')
    
    console.log('✅ Next Steps:')
    console.log('1. Update your .env file with the new contract addresses')
    console.log('2. Test the contracts using the MasChain explorer')
    console.log('3. Update your frontend to use the new contract addresses')
    console.log('4. Run integration tests to verify functionality')
    
  } catch (error) {
    console.error('❌ Deployment failed:', error)
    process.exit(1)
  }
}

async function updateEnvironmentFile(deployment: DeploymentResult): Promise<void> {
  try {
    const envPath = path.join(__dirname, '../.env')
    const envExamplePath = path.join(__dirname, '../.env.example')
    
    // Read current .env file or use .env.example as template
    let envContent = ''
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
    } else if (fs.existsSync(envExamplePath)) {
      envContent = fs.readFileSync(envExamplePath, 'utf8')
    }
    
    // Update contract IDs
    envContent = updateEnvVariable(envContent, 'ENERGY_CREDIT_CONTRACT_ID', deployment.contracts.energyToken.contractId)
    envContent = updateEnvVariable(envContent, 'ENERGY_MARKET_CONTRACT_ID', deployment.contracts.energyMarket.contractId)
    envContent = updateEnvVariable(envContent, 'ENERGY_ORACLE_CONTRACT_ID', deployment.contracts.energyOracle.contractId)
    
    // Write updated .env file
    fs.writeFileSync(envPath, envContent)
    console.log('✅ Updated .env file with contract addresses')
    
  } catch (error) {
    console.warn('⚠️ Could not update .env file:', error)
  }
}

function updateEnvVariable(content: string, key: string, value: string): string {
  const regex = new RegExp(`^${key}=.*$`, 'm')
  const newLine = `${key}=${value}`
  
  if (regex.test(content)) {
    return content.replace(regex, newLine)
  } else {
    return content + `\n${newLine}`
  }
}

async function verifyDeployment(deployment: DeploymentResult): Promise<void> {
  console.log('🔍 Verifying contract deployment...')
  
  try {
    // Verify each contract
    const contracts = [
      { name: 'Energy Token', id: deployment.contracts.energyToken.contractId },
      { name: 'Energy Market', id: deployment.contracts.energyMarket.contractId },
      { name: 'Energy Oracle', id: deployment.contracts.energyOracle.contractId },
    ]
    
    for (const contract of contracts) {
      const info = await masChainContractService.getContractInfo(contract.id)
      if (info.status === 'deployed') {
        console.log(`✅ ${contract.name} contract verified`)
      } else {
        console.warn(`⚠️ ${contract.name} contract status: ${info.status}`)
      }
    }
    
  } catch (error) {
    console.warn('⚠️ Could not verify all contracts:', error)
  }
}

// Main execution
if (require.main === module) {
  deployContracts()
    .then(() => {
      console.log('🎉 Deployment script completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Deployment script failed:', error)
      process.exit(1)
    })
}

export { deployContracts, DeploymentResult }
