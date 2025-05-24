use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("EnergyMarket1111111111111111111111111111111");

#[program]
pub mod energy_market {
    use super::*;

    /// Initialize the energy market
    pub fn initialize_market(ctx: Context<InitializeMarket>) -> Result<()> {
        let market = &mut ctx.accounts.market;
        market.authority = ctx.accounts.authority.key();
        market.total_offers = 0;
        market.total_volume_traded = 0;
        market.is_active = true;
        
        msg!("Energy market initialized");
        Ok(())
    }

    /// Create an energy offer (sell order)
    pub fn create_offer(
        ctx: Context<CreateOffer>,
        energy_amount: u64,
        price_per_kwh: u64,
        offer_type: OfferType,
        duration_hours: u32,
    ) -> Result<()> {
        require!(energy_amount > 0, ErrorCode::InvalidAmount);
        require!(price_per_kwh > 0, ErrorCode::InvalidPrice);
        require!(duration_hours > 0 && duration_hours <= 168, ErrorCode::InvalidDuration); // Max 1 week

        let offer = &mut ctx.accounts.offer;
        let market = &mut ctx.accounts.market;
        
        offer.seller = ctx.accounts.seller.key();
        offer.energy_amount = energy_amount;
        offer.price_per_kwh = price_per_kwh;
        offer.offer_type = offer_type;
        offer.status = OfferStatus::Active;
        offer.created_at = Clock::get()?.unix_timestamp;
        offer.expires_at = offer.created_at + (duration_hours as i64 * 3600);
        offer.filled_amount = 0;

        market.total_offers += 1;

        emit!(OfferCreatedEvent {
            offer_id: offer.key(),
            seller: offer.seller,
            energy_amount,
            price_per_kwh,
            offer_type,
            expires_at: offer.expires_at,
        });

        msg!("Created energy offer: {} kWh at {} credits/kWh", energy_amount, price_per_kwh);
        Ok(())
    }

    /// Execute a trade (buy energy)
    pub fn execute_trade(
        ctx: Context<ExecuteTrade>,
        energy_amount: u64,
    ) -> Result<()> {
        require!(energy_amount > 0, ErrorCode::InvalidAmount);
        
        let offer = &mut ctx.accounts.offer;
        let market = &mut ctx.accounts.market;
        
        // Check if offer is still valid
        require!(offer.status == OfferStatus::Active, ErrorCode::OfferNotActive);
        require!(Clock::get()?.unix_timestamp < offer.expires_at, ErrorCode::OfferExpired);
        
        let available_amount = offer.energy_amount - offer.filled_amount;
        require!(energy_amount <= available_amount, ErrorCode::InsufficientEnergy);
        
        let total_cost = energy_amount
            .checked_mul(offer.price_per_kwh)
            .ok_or(ErrorCode::Overflow)?;

        // Transfer payment from buyer to seller
        let cpi_accounts = Transfer {
            from: ctx.accounts.buyer_token_account.to_account_info(),
            to: ctx.accounts.seller_token_account.to_account_info(),
            authority: ctx.accounts.buyer.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, total_cost)?;

        // Update offer
        offer.filled_amount += energy_amount;
        if offer.filled_amount >= offer.energy_amount {
            offer.status = OfferStatus::Completed;
        }

        // Update market stats
        market.total_volume_traded += energy_amount;

        emit!(TradeExecutedEvent {
            offer_id: offer.key(),
            buyer: ctx.accounts.buyer.key(),
            seller: offer.seller,
            energy_amount,
            total_cost,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Trade executed: {} kWh for {} credits", energy_amount, total_cost);
        Ok(())
    }

    /// Cancel an active offer
    pub fn cancel_offer(ctx: Context<CancelOffer>) -> Result<()> {
        let offer = &mut ctx.accounts.offer;
        
        require!(offer.status == OfferStatus::Active, ErrorCode::OfferNotActive);
        require!(offer.seller == ctx.accounts.seller.key(), ErrorCode::Unauthorized);
        
        offer.status = OfferStatus::Cancelled;

        emit!(OfferCancelledEvent {
            offer_id: offer.key(),
            seller: offer.seller,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Offer cancelled");
        Ok(())
    }

    /// Update market settings (admin only)
    pub fn update_market_settings(
        ctx: Context<UpdateMarketSettings>,
        is_active: bool,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        require!(market.authority == ctx.accounts.authority.key(), ErrorCode::Unauthorized);
        
        market.is_active = is_active;
        
        msg!("Market settings updated: active = {}", is_active);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeMarket<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Market::INIT_SPACE
    )]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateOffer<'info> {
    #[account(
        init,
        payer = seller,
        space = 8 + EnergyOffer::INIT_SPACE
    )]
    pub offer: Account<'info, EnergyOffer>,
    
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub seller: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteTrade<'info> {
    #[account(mut)]
    pub offer: Account<'info, EnergyOffer>,
    
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub seller_token_account: Account<'info, TokenAccount>,
    
    pub buyer: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CancelOffer<'info> {
    #[account(mut)]
    pub offer: Account<'info, EnergyOffer>,
    
    pub seller: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateMarketSettings<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Market {
    pub authority: Pubkey,
    pub total_offers: u64,
    pub total_volume_traded: u64,
    pub is_active: bool,
}

#[account]
#[derive(InitSpace)]
pub struct EnergyOffer {
    pub seller: Pubkey,
    pub energy_amount: u64,
    pub price_per_kwh: u64,
    pub offer_type: OfferType,
    pub status: OfferStatus,
    pub created_at: i64,
    pub expires_at: i64,
    pub filled_amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum OfferType {
    Immediate,
    Scheduled,
    Recurring,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum OfferStatus {
    Active,
    Completed,
    Cancelled,
    Expired,
}

#[event]
pub struct OfferCreatedEvent {
    pub offer_id: Pubkey,
    pub seller: Pubkey,
    pub energy_amount: u64,
    pub price_per_kwh: u64,
    pub offer_type: OfferType,
    pub expires_at: i64,
}

#[event]
pub struct TradeExecutedEvent {
    pub offer_id: Pubkey,
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub energy_amount: u64,
    pub total_cost: u64,
    pub timestamp: i64,
}

#[event]
pub struct OfferCancelledEvent {
    pub offer_id: Pubkey,
    pub seller: Pubkey,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid amount specified")]
    InvalidAmount,
    #[msg("Invalid price specified")]
    InvalidPrice,
    #[msg("Invalid duration specified")]
    InvalidDuration,
    #[msg("Offer is not active")]
    OfferNotActive,
    #[msg("Offer has expired")]
    OfferExpired,
    #[msg("Insufficient energy available")]
    InsufficientEnergy,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Unauthorized access")]
    Unauthorized,
}
