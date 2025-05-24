#!/bin/bash

# Maschain Energy Trading Platform Setup Script
echo "🚀 Setting up Maschain Energy Trading Platform..."

# Check if required tools are installed
check_dependency() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed. Please install it first."
        exit 1
    fi
}

echo "📋 Checking dependencies..."
check_dependency "node"
check_dependency "npm"
check_dependency "python3"
check_dependency "pip3"
check_dependency "cargo"
check_dependency "docker"
check_dependency "docker-compose"

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ All dependencies are installed"

# Create environment file
echo "📝 Creating environment configuration..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo "⚠️  Please update the .env file with your configuration"
else
    echo "✅ .env file already exists"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install IoT integration dependencies
echo "📦 Installing IoT integration dependencies..."
cd iot-integration
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install IoT integration dependencies"
    exit 1
fi
cd ..

# Build smart contracts
echo "🔨 Building smart contracts..."
cd smart-contracts
cargo build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build smart contracts"
    exit 1
fi
cd ..

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p data/postgres
mkdir -p data/redis
mkdir -p mqtt

# Create MQTT configuration
echo "📝 Creating MQTT configuration..."
cat > mqtt/mosquitto.conf << EOF
# Mosquitto configuration for Maschain Energy Trading
listener 1883
allow_anonymous true
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log
log_type error
log_type warning
log_type notice
log_type information
connection_messages true
log_timestamp true
EOF

# Set up database initialization script
echo "📝 Creating database initialization script..."
mkdir -p database
cat > database/init.sql << EOF
-- Maschain Energy Trading Platform Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    public_key VARCHAR(44) UNIQUE NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Energy meters table
CREATE TABLE IF NOT EXISTS energy_meters (
    id SERIAL PRIMARY KEY,
    meter_id VARCHAR(64) UNIQUE NOT NULL,
    owner_public_key VARCHAR(44) NOT NULL,
    meter_type VARCHAR(20) NOT NULL,
    location TEXT,
    is_authorized BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meter readings table
CREATE TABLE IF NOT EXISTS meter_readings (
    id SERIAL PRIMARY KEY,
    meter_id VARCHAR(64) NOT NULL,
    reading_value DECIMAL(10,3) NOT NULL,
    reading_type VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    signature TEXT,
    is_verified BOOLEAN DEFAULT false,
    blockchain_tx VARCHAR(88),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Energy offers table
CREATE TABLE IF NOT EXISTS energy_offers (
    id SERIAL PRIMARY KEY,
    offer_id VARCHAR(64) UNIQUE NOT NULL,
    seller_public_key VARCHAR(44) NOT NULL,
    energy_amount DECIMAL(10,3) NOT NULL,
    price_per_kwh DECIMAL(8,6) NOT NULL,
    offer_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    filled_amount DECIMAL(10,3) DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    blockchain_tx VARCHAR(88),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trades table
CREATE TABLE IF NOT EXISTS trades (
    id SERIAL PRIMARY KEY,
    trade_id VARCHAR(64) UNIQUE NOT NULL,
    offer_id VARCHAR(64) NOT NULL,
    buyer_public_key VARCHAR(44) NOT NULL,
    seller_public_key VARCHAR(44) NOT NULL,
    energy_amount DECIMAL(10,3) NOT NULL,
    price_per_kwh DECIMAL(8,6) NOT NULL,
    total_cost DECIMAL(12,6) NOT NULL,
    blockchain_tx VARCHAR(88),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_meter_readings_meter_id ON meter_readings(meter_id);
CREATE INDEX IF NOT EXISTS idx_meter_readings_timestamp ON meter_readings(timestamp);
CREATE INDEX IF NOT EXISTS idx_energy_offers_seller ON energy_offers(seller_public_key);
CREATE INDEX IF NOT EXISTS idx_energy_offers_status ON energy_offers(status);
CREATE INDEX IF NOT EXISTS idx_trades_buyer ON trades(buyer_public_key);
CREATE INDEX IF NOT EXISTS idx_trades_seller ON trades(seller_public_key);

-- Insert sample data
INSERT INTO users (public_key, email) VALUES 
('11111111111111111111111111111111111111111111', 'demo@maschain.energy')
ON CONFLICT (public_key) DO NOTHING;
EOF

echo "✅ Database initialization script created"

# Make scripts executable
chmod +x scripts/*.sh

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update the .env file with your configuration"
echo "2. Start the development environment:"
echo "   npm run dev"
echo ""
echo "Or use Docker:"
echo "   docker-compose up -d"
echo ""
echo "📚 Documentation: ./docs/README.md"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:3001"
echo "📊 Health Check: http://localhost:3001/health"
