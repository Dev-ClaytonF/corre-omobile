export interface Purchase {
    id?: number;
    hash: string;
    buyer_wallet: string;
    currency: 'BNB' | 'USDT' | 'BRL';
    amount: string;
    token_amount: string;
    referral_code?: string;
    referral_earnings?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
    transaction_id?: string;
    payment_method?: 'CRYPTO' | 'PIX';
} 