#!/usr/bin/env python3
"""
Energy Meter Client for Maaschain Energy Trading Platform
Connects to physical energy meters and submits readings to blockchain
"""

import asyncio
import json
import logging
import time
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass
from pathlib import Path

import requests
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives.serialization import Encoding, PrivateFormat, NoEncryption
import paho.mqtt.client as mqtt
from solana.rpc.async_api import AsyncClient
from solana.keypair import Keypair
from anchorpy import Program, Provider, Wallet

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class MeterReading:
    """Represents an energy meter reading"""
    meter_id: str
    reading_value: float
    reading_type: str  # 'production' or 'consumption'
    timestamp: int
    unit: str = "kWh"

@dataclass
class MeterConfig:
    """Configuration for an energy meter"""
    meter_id: str
    meter_type: str  # 'solar', 'wind', 'battery', 'grid', 'consumption'
    api_endpoint: str
    api_key: Optional[str] = None
    mqtt_topic: Optional[str] = None
    location: str = ""
    owner_pubkey: str = ""

class EnergyMeterClient:
    """Client for reading energy meter data and submitting to blockchain"""
    
    def __init__(self, config_file: str = "meter_config.json"):
        self.config_file = Path(config_file)
        self.meters: Dict[str, MeterConfig] = {}
        self.blockchain_client: Optional[AsyncClient] = None
        self.wallet: Optional[Wallet] = None
        self.oracle_program: Optional[Program] = None
        self.mqtt_client: Optional[mqtt.Client] = None
        self.running = False
        
        # Load configuration
        self._load_config()
        
    def _load_config(self):
        """Load meter configuration from file"""
        try:
            if self.config_file.exists():
                with open(self.config_file, 'r') as f:
                    config_data = json.load(f)
                    
                # Load meters
                for meter_data in config_data.get('meters', []):
                    meter_config = MeterConfig(**meter_data)
                    self.meters[meter_config.meter_id] = meter_config
                    
                # Load blockchain config
                self.rpc_url = config_data.get('rpc_url', 'https://api.devnet.solana.com')
                self.oracle_program_id = config_data.get('oracle_program_id', '')
                
                logger.info(f"Loaded configuration for {len(self.meters)} meters")
            else:
                logger.warning(f"Config file {self.config_file} not found, creating default")
                self._create_default_config()
                
        except Exception as e:
            logger.error(f"Error loading config: {e}")
            self._create_default_config()
    
    def _create_default_config(self):
        """Create a default configuration file"""
        default_config = {
            "rpc_url": "https://api.devnet.solana.com",
            "oracle_program_id": "EnergyOracle111111111111111111111111111111",
            "meters": [
                {
                    "meter_id": "SOLAR_001",
                    "meter_type": "solar",
                    "api_endpoint": "http://localhost:8080/api/solar/reading",
                    "location": "Rooftop Solar Panel",
                    "owner_pubkey": ""
                },
                {
                    "meter_id": "CONSUMPTION_001", 
                    "meter_type": "consumption",
                    "api_endpoint": "http://localhost:8080/api/consumption/reading",
                    "location": "Main Building",
                    "owner_pubkey": ""
                }
            ]
        }
        
        with open(self.config_file, 'w') as f:
            json.dump(default_config, f, indent=2)
        
        logger.info(f"Created default config file: {self.config_file}")
    
    async def initialize_blockchain(self, private_key_file: str = "wallet.json"):
        """Initialize blockchain connection and wallet"""
        try:
            # Load or create wallet
            wallet_path = Path(private_key_file)
            if wallet_path.exists():
                with open(wallet_path, 'r') as f:
                    keypair_data = json.load(f)
                    keypair = Keypair.from_secret_key(bytes(keypair_data))
            else:
                # Generate new keypair
                keypair = Keypair.generate()
                with open(wallet_path, 'w') as f:
                    json.dump(list(keypair.secret_key), f)
                logger.info(f"Generated new wallet: {keypair.public_key}")
            
            # Initialize blockchain client
            self.blockchain_client = AsyncClient(self.rpc_url)
            self.wallet = Wallet(keypair)
            
            # Initialize oracle program
            provider = Provider(self.blockchain_client, self.wallet)
            # Note: In production, load the actual IDL
            self.oracle_program = Program(
                program_id=self.oracle_program_id,
                provider=provider
            )
            
            logger.info("Blockchain connection initialized")
            
        except Exception as e:
            logger.error(f"Error initializing blockchain: {e}")
            raise
    
    def setup_mqtt(self, broker_host: str = "localhost", broker_port: int = 1883):
        """Setup MQTT client for real-time meter data"""
        try:
            self.mqtt_client = mqtt.Client()
            self.mqtt_client.on_connect = self._on_mqtt_connect
            self.mqtt_client.on_message = self._on_mqtt_message
            
            self.mqtt_client.connect(broker_host, broker_port, 60)
            self.mqtt_client.loop_start()
            
            logger.info(f"MQTT client connected to {broker_host}:{broker_port}")
            
        except Exception as e:
            logger.error(f"Error setting up MQTT: {e}")
    
    def _on_mqtt_connect(self, client, userdata, flags, rc):
        """MQTT connection callback"""
        if rc == 0:
            logger.info("Connected to MQTT broker")
            # Subscribe to meter topics
            for meter in self.meters.values():
                if meter.mqtt_topic:
                    client.subscribe(meter.mqtt_topic)
                    logger.info(f"Subscribed to topic: {meter.mqtt_topic}")
        else:
            logger.error(f"Failed to connect to MQTT broker: {rc}")
    
    def _on_mqtt_message(self, client, userdata, msg):
        """MQTT message callback"""
        try:
            topic = msg.topic
            payload = json.loads(msg.payload.decode())
            
            # Find meter by topic
            meter = None
            for m in self.meters.values():
                if m.mqtt_topic == topic:
                    meter = m
                    break
            
            if meter:
                reading = MeterReading(
                    meter_id=meter.meter_id,
                    reading_value=payload.get('value', 0),
                    reading_type=payload.get('type', 'consumption'),
                    timestamp=int(time.time())
                )
                
                # Submit reading to blockchain
                asyncio.create_task(self._submit_reading_to_blockchain(reading))
                
        except Exception as e:
            logger.error(f"Error processing MQTT message: {e}")
    
    async def read_meter_data(self, meter_id: str) -> Optional[MeterReading]:
        """Read data from a specific meter"""
        if meter_id not in self.meters:
            logger.error(f"Meter {meter_id} not found in configuration")
            return None
        
        meter = self.meters[meter_id]
        
        try:
            # Make API request to meter
            headers = {}
            if meter.api_key:
                headers['Authorization'] = f"Bearer {meter.api_key}"
            
            response = requests.get(meter.api_endpoint, headers=headers, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # Parse response based on meter type
            reading_value = data.get('value', 0)
            reading_type = 'production' if meter.meter_type in ['solar', 'wind'] else 'consumption'
            
            reading = MeterReading(
                meter_id=meter_id,
                reading_value=reading_value,
                reading_type=reading_type,
                timestamp=int(time.time())
            )
            
            logger.info(f"Read from {meter_id}: {reading_value} kWh ({reading_type})")
            return reading
            
        except Exception as e:
            logger.error(f"Error reading from meter {meter_id}: {e}")
            return None
    
    async def _submit_reading_to_blockchain(self, reading: MeterReading):
        """Submit meter reading to blockchain oracle"""
        try:
            if not self.oracle_program:
                logger.error("Oracle program not initialized")
                return
            
            # Create signature for the reading
            signature = self._sign_reading(reading)
            
            # Submit to blockchain
            # Note: This is a simplified version - actual implementation would use proper Anchor calls
            tx_signature = await self.oracle_program.rpc["submit_reading"](
                reading.meter_id,
                int(reading.reading_value * 1000),  # Convert to integer (mWh)
                reading.reading_type,
                signature,
                ctx={
                    "accounts": {
                        # Account addresses would be provided here
                    }
                }
            )
            
            logger.info(f"Submitted reading to blockchain: {tx_signature}")
            
        except Exception as e:
            logger.error(f"Error submitting reading to blockchain: {e}")
    
    def _sign_reading(self, reading: MeterReading) -> bytes:
        """Create cryptographic signature for meter reading"""
        try:
            # Create message to sign
            message = f"{reading.meter_id}:{reading.reading_value}:{reading.timestamp}"
            message_bytes = message.encode('utf-8')
            
            # Sign with wallet private key
            signature = self.wallet.payer.sign(message_bytes)
            return signature.signature
            
        except Exception as e:
            logger.error(f"Error signing reading: {e}")
            return b""
    
    async def start_monitoring(self, interval_seconds: int = 300):
        """Start continuous monitoring of all meters"""
        logger.info(f"Starting meter monitoring (interval: {interval_seconds}s)")
        self.running = True
        
        while self.running:
            try:
                # Read from all configured meters
                for meter_id in self.meters.keys():
                    reading = await self.read_meter_data(meter_id)
                    if reading:
                        await self._submit_reading_to_blockchain(reading)
                
                # Wait for next interval
                await asyncio.sleep(interval_seconds)
                
            except Exception as e:
                logger.error(f"Error in monitoring loop: {e}")
                await asyncio.sleep(10)  # Short delay before retry
    
    def stop_monitoring(self):
        """Stop meter monitoring"""
        logger.info("Stopping meter monitoring")
        self.running = False
        
        if self.mqtt_client:
            self.mqtt_client.loop_stop()
            self.mqtt_client.disconnect()

async def main():
    """Main function for running the meter client"""
    client = EnergyMeterClient()
    
    try:
        # Initialize blockchain connection
        await client.initialize_blockchain()
        
        # Setup MQTT for real-time data
        client.setup_mqtt()
        
        # Start monitoring
        await client.start_monitoring(interval_seconds=300)  # 5 minutes
        
    except KeyboardInterrupt:
        logger.info("Received interrupt signal")
    except Exception as e:
        logger.error(f"Error in main: {e}")
    finally:
        client.stop_monitoring()

if __name__ == "__main__":
    asyncio.run(main())
