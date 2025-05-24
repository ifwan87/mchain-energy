use anchor_lang::prelude::*;

declare_id!("EnergyOracle111111111111111111111111111111");

#[program]
pub mod energy_oracle {
    use super::*;

    /// Initialize the oracle service
    pub fn initialize_oracle(ctx: Context<InitializeOracle>) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
        oracle.authority = ctx.accounts.authority.key();
        oracle.total_meters = 0;
        oracle.total_readings = 0;
        oracle.is_active = true;
        
        msg!("Energy oracle initialized");
        Ok(())
    }

    /// Register a new energy meter
    pub fn register_meter(
        ctx: Context<RegisterMeter>,
        meter_id: String,
        meter_type: MeterType,
        location: String,
        owner: Pubkey,
    ) -> Result<()> {
        require!(!meter_id.is_empty(), ErrorCode::InvalidMeterId);
        require!(!location.is_empty(), ErrorCode::InvalidLocation);

        let meter = &mut ctx.accounts.meter;
        let oracle = &mut ctx.accounts.oracle;
        
        meter.meter_id = meter_id.clone();
        meter.meter_type = meter_type;
        meter.location = location.clone();
        meter.owner = owner;
        meter.is_authorized = true;
        meter.registered_at = Clock::get()?.unix_timestamp;
        meter.last_reading_at = 0;
        meter.total_readings = 0;

        oracle.total_meters += 1;

        emit!(MeterRegisteredEvent {
            meter_id: meter_id.clone(),
            meter_type,
            owner,
            location,
            timestamp: meter.registered_at,
        });

        msg!("Registered energy meter: {}", meter_id);
        Ok(())
    }

    /// Submit energy meter reading
    pub fn submit_reading(
        ctx: Context<SubmitReading>,
        meter_id: String,
        reading_value: u64,
        reading_type: ReadingType,
        signature: Vec<u8>,
    ) -> Result<()> {
        require!(!meter_id.is_empty(), ErrorCode::InvalidMeterId);
        require!(reading_value > 0, ErrorCode::InvalidReading);
        require!(!signature.is_empty(), ErrorCode::InvalidSignature);

        let meter = &mut ctx.accounts.meter;
        let oracle = &mut ctx.accounts.oracle;
        let reading = &mut ctx.accounts.reading;
        
        // Verify meter is authorized
        require!(meter.is_authorized, ErrorCode::MeterNotAuthorized);
        require!(meter.meter_id == meter_id, ErrorCode::MeterIdMismatch);

        let current_time = Clock::get()?.unix_timestamp;
        
        // Prevent duplicate readings within short time window (5 minutes)
        require!(
            current_time - meter.last_reading_at > 300,
            ErrorCode::ReadingTooFrequent
        );

        // Store the reading
        reading.meter_id = meter_id.clone();
        reading.reading_value = reading_value;
        reading.reading_type = reading_type;
        reading.timestamp = current_time;
        reading.signature = signature;
        reading.is_verified = true; // In production, implement proper signature verification

        // Update meter stats
        meter.last_reading_at = current_time;
        meter.total_readings += 1;
        
        // Update oracle stats
        oracle.total_readings += 1;

        emit!(ReadingSubmittedEvent {
            meter_id,
            reading_value,
            reading_type,
            timestamp: current_time,
            verified: reading.is_verified,
        });

        msg!("Submitted reading: {} {} for meter {}", reading_value, 
             match reading_type {
                 ReadingType::Production => "kWh produced",
                 ReadingType::Consumption => "kWh consumed",
             }, 
             reading.meter_id);
        Ok(())
    }

    /// Authorize or deauthorize a meter
    pub fn update_meter_authorization(
        ctx: Context<UpdateMeterAuth>,
        is_authorized: bool,
    ) -> Result<()> {
        let meter = &mut ctx.accounts.meter;
        let oracle = &ctx.accounts.oracle;
        
        require!(oracle.authority == ctx.accounts.authority.key(), ErrorCode::Unauthorized);
        
        meter.is_authorized = is_authorized;

        emit!(MeterAuthUpdatedEvent {
            meter_id: meter.meter_id.clone(),
            is_authorized,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Updated meter authorization: {} = {}", meter.meter_id, is_authorized);
        Ok(())
    }

    /// Get latest reading for a meter
    pub fn get_latest_reading(
        ctx: Context<GetLatestReading>,
    ) -> Result<ReadingData> {
        let reading = &ctx.accounts.reading;
        
        Ok(ReadingData {
            meter_id: reading.meter_id.clone(),
            reading_value: reading.reading_value,
            reading_type: reading.reading_type,
            timestamp: reading.timestamp,
            is_verified: reading.is_verified,
        })
    }

    /// Update oracle settings
    pub fn update_oracle_settings(
        ctx: Context<UpdateOracleSettings>,
        is_active: bool,
    ) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
        require!(oracle.authority == ctx.accounts.authority.key(), ErrorCode::Unauthorized);
        
        oracle.is_active = is_active;
        
        msg!("Oracle settings updated: active = {}", is_active);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeOracle<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Oracle::INIT_SPACE
    )]
    pub oracle: Account<'info, Oracle>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterMeter<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + EnergyMeter::INIT_SPACE
    )]
    pub meter: Account<'info, EnergyMeter>,
    
    #[account(mut)]
    pub oracle: Account<'info, Oracle>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitReading<'info> {
    #[account(
        init,
        payer = submitter,
        space = 8 + MeterReading::INIT_SPACE
    )]
    pub reading: Account<'info, MeterReading>,
    
    #[account(mut)]
    pub meter: Account<'info, EnergyMeter>,
    
    #[account(mut)]
    pub oracle: Account<'info, Oracle>,
    
    #[account(mut)]
    pub submitter: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateMeterAuth<'info> {
    #[account(mut)]
    pub meter: Account<'info, EnergyMeter>,
    
    pub oracle: Account<'info, Oracle>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetLatestReading<'info> {
    pub reading: Account<'info, MeterReading>,
}

#[derive(Accounts)]
pub struct UpdateOracleSettings<'info> {
    #[account(mut)]
    pub oracle: Account<'info, Oracle>,
    
    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Oracle {
    pub authority: Pubkey,
    pub total_meters: u64,
    pub total_readings: u64,
    pub is_active: bool,
}

#[account]
#[derive(InitSpace)]
pub struct EnergyMeter {
    #[max_len(64)]
    pub meter_id: String,
    pub meter_type: MeterType,
    #[max_len(128)]
    pub location: String,
    pub owner: Pubkey,
    pub is_authorized: bool,
    pub registered_at: i64,
    pub last_reading_at: i64,
    pub total_readings: u64,
}

#[account]
#[derive(InitSpace)]
pub struct MeterReading {
    #[max_len(64)]
    pub meter_id: String,
    pub reading_value: u64,
    pub reading_type: ReadingType,
    pub timestamp: i64,
    #[max_len(128)]
    pub signature: Vec<u8>,
    pub is_verified: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum MeterType {
    Solar,
    Wind,
    Battery,
    Grid,
    Consumption,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum ReadingType {
    Production,
    Consumption,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ReadingData {
    pub meter_id: String,
    pub reading_value: u64,
    pub reading_type: ReadingType,
    pub timestamp: i64,
    pub is_verified: bool,
}

#[event]
pub struct MeterRegisteredEvent {
    #[index]
    pub meter_id: String,
    pub meter_type: MeterType,
    pub owner: Pubkey,
    pub location: String,
    pub timestamp: i64,
}

#[event]
pub struct ReadingSubmittedEvent {
    #[index]
    pub meter_id: String,
    pub reading_value: u64,
    pub reading_type: ReadingType,
    pub timestamp: i64,
    pub verified: bool,
}

#[event]
pub struct MeterAuthUpdatedEvent {
    #[index]
    pub meter_id: String,
    pub is_authorized: bool,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid meter ID")]
    InvalidMeterId,
    #[msg("Invalid location")]
    InvalidLocation,
    #[msg("Invalid reading value")]
    InvalidReading,
    #[msg("Invalid signature")]
    InvalidSignature,
    #[msg("Meter not authorized")]
    MeterNotAuthorized,
    #[msg("Meter ID mismatch")]
    MeterIdMismatch,
    #[msg("Reading submitted too frequently")]
    ReadingTooFrequent,
    #[msg("Unauthorized access")]
    Unauthorized,
}
