use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("EnergyCredit11111111111111111111111111111111");

#[program]
pub mod energy_credit {
    use super::*;

    /// Initialize the energy credit token
    pub fn initialize(
        ctx: Context<Initialize>,
        decimals: u8,
        name: String,
        symbol: String,
    ) -> Result<()> {
        let token_info = &mut ctx.accounts.token_info;
        token_info.authority = ctx.accounts.authority.key();
        token_info.mint = ctx.accounts.mint.key();
        token_info.decimals = decimals;
        token_info.name = name;
        token_info.symbol = symbol;
        token_info.total_supply = 0;
        
        msg!("Energy Credit Token initialized: {} ({})", token_info.name, token_info.symbol);
        Ok(())
    }

    /// Mint energy credits to a user account
    pub fn mint_credits(
        ctx: Context<MintCredits>,
        amount: u64,
        energy_produced: u64,
        meter_id: String,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        require!(!meter_id.is_empty(), ErrorCode::InvalidMeterId);

        let token_info = &mut ctx.accounts.token_info;
        token_info.total_supply = token_info.total_supply
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;

        // Mint tokens to user account
        let cpi_accounts = token::MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::mint_to(cpi_ctx, amount)?;

        // Record the energy production event
        emit!(EnergyProductionEvent {
            user: ctx.accounts.user.key(),
            meter_id,
            energy_produced,
            credits_minted: amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Minted {} energy credits for {} kWh produced", amount, energy_produced);
        Ok(())
    }

    /// Transfer energy credits between users
    pub fn transfer_credits(
        ctx: Context<TransferCredits>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);

        let cpi_accounts = Transfer {
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.from_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        emit!(CreditTransferEvent {
            from: ctx.accounts.from_authority.key(),
            to: ctx.accounts.to_authority.key(),
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Transferred {} energy credits", amount);
        Ok(())
    }

    /// Burn energy credits when energy is consumed
    pub fn burn_credits(
        ctx: Context<BurnCredits>,
        amount: u64,
        energy_consumed: u64,
        meter_id: String,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);
        require!(!meter_id.is_empty(), ErrorCode::InvalidMeterId);

        let token_info = &mut ctx.accounts.token_info;
        token_info.total_supply = token_info.total_supply
            .checked_sub(amount)
            .ok_or(ErrorCode::InsufficientSupply)?;

        // Burn tokens from user account
        let cpi_accounts = token::Burn {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::burn(cpi_ctx, amount)?;

        emit!(EnergyConsumptionEvent {
            user: ctx.accounts.user.key(),
            meter_id,
            energy_consumed,
            credits_burned: amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Burned {} energy credits for {} kWh consumed", amount, energy_consumed);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + TokenInfo::INIT_SPACE
    )]
    pub token_info: Account<'info, TokenInfo>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintCredits<'info> {
    #[account(mut)]
    pub token_info: Account<'info, TokenInfo>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: User account receiving credits
    pub user: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct TransferCredits<'info> {
    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub to_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Destination authority
    pub to_authority: AccountInfo<'info>,
    
    pub from_authority: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct BurnCredits<'info> {
    #[account(mut)]
    pub token_info: Account<'info, TokenInfo>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct TokenInfo {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub decimals: u8,
    #[max_len(32)]
    pub name: String,
    #[max_len(8)]
    pub symbol: String,
    pub total_supply: u64,
}

#[event]
pub struct EnergyProductionEvent {
    pub user: Pubkey,
    #[index]
    pub meter_id: String,
    pub energy_produced: u64,
    pub credits_minted: u64,
    pub timestamp: i64,
}

#[event]
pub struct EnergyConsumptionEvent {
    pub user: Pubkey,
    #[index]
    pub meter_id: String,
    pub energy_consumed: u64,
    pub credits_burned: u64,
    pub timestamp: i64,
}

#[event]
pub struct CreditTransferEvent {
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid amount specified")]
    InvalidAmount,
    #[msg("Invalid meter ID")]
    InvalidMeterId,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Insufficient token supply")]
    InsufficientSupply,
}
