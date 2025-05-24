# Maschain Energy Trading Platform - Setup Guide

This guide will help you set up and run the Maschain Energy Trading Platform on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Rust** (v1.70 or higher)
- **Docker** and **Docker Compose** (optional, for containerized setup)
- **Git**

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd maschain
```

### 2. Environment Setup

Copy the environment configuration:

```bash
cp .env.example .env
```

Edit the `.env` file with your specific configuration values.

### 3. Install Dependencies

#### Frontend and Backend Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

#### IoT Integration Dependencies
```bash
# Install Python dependencies
cd iot-integration
pip install -r requirements.txt
cd ..
```

#### Smart Contracts Dependencies
```bash
# Build smart contracts
cd smart-contracts
cargo build
cd ..
```

### 4. Database Setup

#### Option A: Using Docker (Recommended)
```bash
# Start database services
docker-compose up -d postgres redis mosquitto
```

#### Option B: Local Installation
- Install PostgreSQL and create a database named `maschain_energy`
- Install Redis
- Install Mosquitto MQTT broker

### 5. Start the Development Environment

#### Option A: Using Docker Compose (Full Stack)
```bash
# Start all services
docker-compose up
```

#### Option B: Manual Start (Individual Services)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Terminal 3 - IoT Simulator:**
```bash
cd iot-integration
python meter-client/meter_client.py
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## Development Workflow

### Smart Contract Development

1. **Build Contracts:**
   ```bash
   cd smart-contracts
   cargo build-bpf
   ```

2. **Test Contracts:**
   ```bash
   cargo test
   ```

3. **Deploy to Devnet:**
   ```bash
   # Deploy energy credit contract
   solana program deploy target/deploy/energy_credit.so

   # Deploy energy market contract
   solana program deploy target/deploy/energy_market.so

   # Deploy energy oracle contract
   solana program deploy target/deploy/energy_oracle.so
   ```

### Frontend Development

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Build for Production:**
   ```bash
   npm run build
   ```

3. **Run Tests:**
   ```bash
   npm test
   ```

### Backend Development

1. **Start Development Server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Build TypeScript:**
   ```bash
   npm run build
   ```

3. **Run Tests:**
   ```bash
   npm test
   ```

### IoT Integration

1. **Configure Meters:**
   Edit `iot-integration/meter_config.json` with your meter configurations.

2. **Start Meter Client:**
   ```bash
   cd iot-integration
   python meter-client/meter_client.py
   ```

3. **Simulate Meter Data:**
   The system includes built-in simulators for testing without physical meters.

## Configuration

### Wallet Setup

1. **Generate Wallet:**
   ```bash
   solana-keygen new --outfile wallet.json
   ```

2. **Fund Wallet (Devnet):**
   ```bash
   solana airdrop 2 --url devnet
   ```

### Program IDs

After deploying smart contracts, update the program IDs in your `.env` file:

```env
ENERGY_CREDIT_PROGRAM_ID=<your-deployed-program-id>
ENERGY_MARKET_PROGRAM_ID=<your-deployed-program-id>
ENERGY_ORACLE_PROGRAM_ID=<your-deployed-program-id>
```

## Testing

### Unit Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend && npm test

# Smart contract tests
cd smart-contracts && cargo test
```

### Integration Tests
```bash
# Start test environment
docker-compose -f docker-compose.test.yml up

# Run integration tests
npm run test:integration
```

## Deployment

### Production Deployment

1. **Build Applications:**
   ```bash
   npm run build
   cd backend && npm run build
   ```

2. **Deploy Smart Contracts to Mainnet:**
   ```bash
   cd smart-contracts
   solana program deploy --url mainnet-beta target/deploy/energy_credit.so
   ```

3. **Deploy Backend:**
   - Configure production environment variables
   - Deploy to your preferred cloud provider (AWS, GCP, Azure)

4. **Deploy Frontend:**
   - Build static files: `npm run build`
   - Deploy to CDN or static hosting service

## Troubleshooting

### Common Issues

1. **Wallet Connection Issues:**
   - Ensure you have a Solana wallet extension installed
   - Check that you're connected to the correct network (devnet/mainnet)

2. **Smart Contract Deployment Fails:**
   - Verify you have sufficient SOL for deployment
   - Check that Rust and Solana CLI are properly installed

3. **Database Connection Issues:**
   - Verify PostgreSQL is running
   - Check database credentials in `.env` file

4. **IoT Connection Issues:**
   - Verify MQTT broker is running
   - Check meter configuration in `meter_config.json`

### Getting Help

- Check the [documentation](./docs/)
- Review [common issues](./docs/TROUBLESHOOTING.md)
- Open an issue on GitHub

## Next Steps

1. **Configure Real Meters:** Replace simulators with actual IoT meter integrations
2. **Deploy to Testnet:** Test with real blockchain transactions
3. **Security Audit:** Conduct thorough security review before mainnet deployment
4. **Scale Infrastructure:** Set up production-grade infrastructure
5. **User Onboarding:** Implement user registration and KYC processes

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
