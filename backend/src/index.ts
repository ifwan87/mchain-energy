import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'

import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'
import energyRoutes from './routes/energy'
import marketRoutes from './routes/market'
import oracleRoutes from './routes/oracle'
import { initializeDatabase } from './config/database'
import { initializeBlockchain } from './config/blockchain'
import { WebSocketManager } from './services/websocket'
import { startCronJobs } from './services/cron'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(rateLimiter)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0'
  })
})

// API Routes
app.use('/api/energy', energyRoutes)
app.use('/api/market', marketRoutes)
app.use('/api/oracle', oracleRoutes)

// Error handling
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Create HTTP server
const server = createServer(app)

// Initialize WebSocket server
const wss = new WebSocketServer({ server })
const wsManager = new WebSocketManager(wss)

async function startServer() {
  try {
    // Initialize database
    await initializeDatabase()
    console.log('✅ Database connected')

    // Initialize blockchain connection
    await initializeBlockchain()
    console.log('✅ Blockchain connected')

    // Start cron jobs
    startCronJobs()
    console.log('✅ Cron jobs started')

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/health`)
      console.log(`🔌 WebSocket server ready`)
    })

  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
    process.exit(0)
  })
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

startServer()
