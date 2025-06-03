# Blockchain-Based Energy Trading Platform Using MasChain L1

A comprehensive platform for peer-to-peer energy trading using MasChain L1 blockchain technology, IoT integration, and smart contracts.

## Architecture Overview

### Core Components

1. **MasChain L1 Blockchain Layer**
   - Smart contracts for energy trading via MasChain API
   - Energy Credit (EC) tokens for peer-to-peer trading
   - Proof of Authority consensus for energy efficiency
   - Enterprise-grade security and compliance

2. **IoT Integration Layer**
   - Energy meter data collection
   - Oracle services for secure data transmission
   - Real-time consumption/production monitoring

3. **Application Layer**
   - Web/mobile interfaces for users
   - Trading marketplace
   - Analytics dashboard

4. **Integration Layer**
   - APIs for utility grid systems
   - Weather data services
   - Payment settlement systems

## Project Structure

```
maschain/
├── smart-contracts/          # Rust smart contracts
│   ├── energy-credit/        # Token implementation
│   ├── energy-market/        # Trading marketplace
│   └── energy-oracle/        # Oracle services
├── iot-integration/          # Python IoT services
│   ├── meter-client/         # Energy meter integration
│   └── oracle-service/       # Data validation service
├── frontend/                 # React/Next.js application
│   ├── components/           # Reusable components
│   ├── pages/               # Application pages
│   └── utils/               # Utility functions
├── backend/                  # Node.js backend services
│   ├── api/                 # REST API endpoints
│   ├── services/            # Business logic
│   └── middleware/          # Authentication & validation
└── docs/                    # Documentation
```

## Implementation Phases

### Phase 1: Core Infrastructure (Weeks 1-4)
- [x] Project setup and structure
- [x] Smart contract implementation
- [x] Oracle service development
- [x] IoT meter simulation

### Phase 2: Application Development (Weeks 5-8)
- [x] Frontend dashboard
- [x] Wallet integration
- [x] Trading marketplace
- [ ] Analytics features

### Phase 3: Integration & Testing (Weeks 9-12)
- [ ] IoT device integration
- [ ] Weather API integration
- [ ] Grid integration
- [ ] Security audits

### Phase 4: Pilot Deployment (Weeks 13-16)
- [ ] Testnet deployment
- [ ] User onboarding
- [ ] Performance monitoring
- [ ] Feedback collection

### Phase 5: Production Launch (Weeks 17-20)
- [ ] Mainnet deployment
- [ ] Scaling implementation
- [ ] Feature expansion
- [ ] Documentation

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Rust 1.70+
- Maaschain SDK

### Installation
```bash
# Clone the repository
git clone https://github.com/ifwan87/mchain-energy.git
cd mchain-energy

# Install dependencies
npm install
pip install -r requirements.txt

# Setup smart contracts
cd smart-contracts
cargo build

# Start development servers
npm run dev
```

## Key Features

- **Real-time Energy Trading**: Peer-to-peer energy transactions
- **IoT Integration**: Automated meter readings and data validation
- **Smart Contracts**: Secure and transparent trading logic
- **Analytics Dashboard**: Comprehensive energy usage insights
- **Oracle Services**: Reliable external data integration

## Technology Stack

- **Blockchain**: Maaschain
- **Smart Contracts**: Rust
- **Frontend**: React/Next.js
- **Backend**: Node.js/Express
- **IoT Integration**: Python
- **Database**: PostgreSQL/MongoDB
- **Oracle**: Custom Python/Node.js service

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Rust 1.70+
- Docker & Docker Compose
- Git

### Installation

1. **Clone and setup the project:**
```bash
git clone <repository-url>
cd maschain
./scripts/setup.sh
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start development environment:**
```bash
# Option 1: Local development
npm run dev

# Option 2: Docker environment
docker-compose up -d
```

4. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## Development Workflow

### Smart Contracts
```bash
cd smart-contracts
cargo build                 # Build contracts
cargo test                  # Run tests
```

### Frontend Development
```bash
npm run dev                  # Start development server
npm run build               # Build for production
npm run lint                # Run linting
```

### Backend Development
```bash
cd backend
npm run dev                  # Start development server
npm run build               # Build TypeScript
npm test                    # Run tests
```

### IoT Integration
```bash
cd iot-integration
python meter-client/meter_client.py  # Start meter client
```

## Architecture Details

### Smart Contract Layer
- **EnergyCredit.rs**: Token contract for energy credits
- **EnergyMarket.rs**: Trading marketplace contract
- **EnergyOracle.rs**: Oracle for IoT data validation

### Application Layer
- **Frontend**: React/Next.js with Tailwind CSS
- **Backend**: Node.js/Express with TypeScript
- **Database**: PostgreSQL with Redis caching
- **WebSocket**: Real-time updates

### IoT Integration
- **MQTT**: Real-time meter data streaming
- **Python Client**: Meter data collection and validation
- **Oracle Service**: Secure data submission to blockchain

## API Documentation

### Energy Endpoints
- `GET /api/energy/stats` - Get energy statistics
- `GET /api/energy/readings` - Get meter readings
- `POST /api/energy/readings` - Submit new reading

### Market Endpoints
- `GET /api/market/offers` - Get active offers
- `POST /api/market/offers` - Create new offer
- `POST /api/market/trade` - Execute trade

### Oracle Endpoints
- `POST /api/oracle/register-meter` - Register energy meter
- `POST /api/oracle/submit-reading` - Submit meter reading

## Testing

### Unit Tests
```bash
npm test                     # Frontend tests
cd backend && npm test       # Backend tests
cd smart-contracts && cargo test  # Smart contract tests
```

### Integration Tests
```bash
npm run test:integration     # Full integration tests
```

### Load Testing
```bash
npm run test:load           # Load testing with k6
```

## Deployment

### Testnet Deployment
```bash
npm run deploy:testnet
```

### Production Deployment
```bash
npm run deploy:production
```

## Monitoring & Logging

- **Health Checks**: `/health` endpoint
- **Metrics**: Prometheus metrics at `/metrics`
- **Logs**: Structured logging with Winston
- **Alerts**: Configurable alerts for system events

## Security

- **Wallet Security**: Hardware wallet support
- **API Security**: Rate limiting, CORS, Helmet
- **Data Validation**: Joi schema validation
- **Encryption**: TLS/SSL for all communications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Troubleshooting

### Common Issues

**Wallet Connection Issues:**
- Ensure you have a Solana wallet installed
- Check network configuration in .env

**Smart Contract Deployment:**
- Verify Rust toolchain installation
- Check Solana CLI configuration

**IoT Integration:**
- Verify MQTT broker connectivity
- Check meter API endpoints

### Support

- Documentation: `./docs/`
- Issues: GitHub Issues
- Community: Discord/Telegram

## Roadmap

### Phase 1 (Current)
- ✅ Core smart contracts
- ✅ Basic frontend interface
- ✅ IoT integration framework
- ✅ Development environment

### Phase 2 (Next 4 weeks)
- [ ] Advanced trading features
- [ ] Mobile application
- [ ] Grid integration APIs
- [ ] Enhanced analytics

### Phase 3 (8-12 weeks)
- [ ] Cross-chain compatibility
- [ ] AI-powered forecasting
- [ ] Carbon credit trading
- [ ] Enterprise features

## License

MIT License - see LICENSE file for details
