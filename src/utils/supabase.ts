import { createClient } from '@supabase/supabase-js';
import { Purchase } from '../types/purchase';
import { calculateReferralEarnings } from './referralCalculations';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Função para gerar código de referral único (5 letras + 3 números)
const generateReferralCode = async (): Promise<string> => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    let isUnique = false;
    let code = '';
    
    while (!isUnique) {
        // Gera 5 letras aleatórias
        let letterPart = '';
        for (let i = 0; i < 5; i++) {
            letterPart += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        
        // Gera 3 números aleatórios
        let numberPart = '';
        for (let i = 0; i < 3; i++) {
            numberPart += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        
        code = `${letterPart}${numberPart}`;
        
        // Verifica se o código já existe
        const { data } = await supabase
            .from('wallets')
            .select('referral_code')
            .eq('referral_code', code);
            
        if (!data || data.length === 0) {
            isUnique = true;
        }
    }
    
    return code;
};

// Função para registrar wallet (apenas wallet_address)
export const registerWallet = async (walletAddress: string) => {
    try {
        // Verifica se a wallet já existe
        const { data: existingWallet } = await supabase
            .from('wallets')
            .select('id, wallet_address')
            .eq('wallet_address', walletAddress)
            .single();

        if (!existingWallet) {
            // Se não existir, cria um novo registro apenas com wallet_address
            const { data, error } = await supabase
                .from('wallets')
                .insert([{ wallet_address: walletAddress }])
                .select();

            if (error) {
                console.error('Error registering wallet:', error);
                throw error;
            }

            console.log('Wallet registered successfully:', data);
            return data;
        }

        return existingWallet;
    } catch (error) {
        console.error('Error in registerWallet:', error);
        throw error;
    }
};

// Função para gerar e salvar código de referral
export const generateAndSaveReferralCode = async (walletAddress: string, name: string, email: string) => {
    try {
        // Verifica se a wallet existe e já tem um código
        const { data: existingWallet, error: fetchError } = await supabase
            .from('wallets')
            .select('*')  // Seleciona todos os campos para debug
            .eq('wallet_address', walletAddress)
            .single();

        console.log('Existing wallet data:', existingWallet);
        console.log('Fetch error:', fetchError);

        if (fetchError) {
            console.error('Error fetching wallet:', fetchError);
            throw new Error('Erro ao verificar wallet. Tente novamente.');
        }

        if (existingWallet?.referral_code) {
            return existingWallet.referral_code;
        }

        // Gera novo código único
        const newCode = await generateReferralCode();
        if (!newCode) {
            throw new Error('Erro ao gerar código único. Tente novamente.');
        }

        console.log('Generated code:', newCode);
        console.log('Updating wallet with:', {
            referral_code: newCode,
            name,
            email,
            wallet_address: walletAddress
        });

        // Atualiza a wallet com o novo código e informações do usuário
        const { data, error: updateError } = await supabase
            .from('wallets')
            .update({ 
                referral_code: newCode,
                name: name,
                email: email
            })
            .eq('wallet_address', walletAddress)
            .select();

        console.log('Update response:', { data, error: updateError });

        if (updateError) {
            console.error('Error updating wallet:', updateError);
            // Adiciona mais detalhes ao erro
            throw new Error(`Erro ao salvar informações: ${updateError.message}`);
        }

        if (!data || data.length === 0) {
            throw new Error('Erro ao atualizar wallet. Nenhum dado retornado.');
        }

        return newCode;
    } catch (error) {
        console.error('Error in generateAndSaveReferralCode:', error);
        throw error;
    }
};

// Função para buscar código de referral existente
export const fetchReferralCode = async (walletAddress: string): Promise<string | null> => {
    try {
        const { data, error } = await supabase
            .from('wallets')
            .select('referral_code')
            .eq('wallet_address', walletAddress)
            .single();

        if (error) {
            console.error('Error fetching referral code:', error);
            return null;
        }

        return data?.referral_code || null;
    } catch (error) {
        console.error('Error in fetchReferralCode:', error);
        return null;
    }
};

// Função para buscar a wallet que fez o referral
export const fetchReferrerWallet = async (referralCode: string) => {
    try {
        const { data, error } = await supabase
            .from('wallets')
            .select('wallet_address')
            .eq('referral_code', referralCode)
            .single();

        if (error) {
            console.error('Error fetching referrer wallet:', error);
            return null;
        }

        return data?.wallet_address || null;
    } catch (error) {
        console.error('Error in fetchReferrerWallet:', error);
        return null;
    }
};

// Função para atualizar o total de vendas
const updateTokenSalesTotal = async (newTokenAmount: string, newUsdtValue: string) => {
    try {
        // Busca os valores atuais
        const { data: currentTotal, error: fetchError } = await supabase
            .from('token_sales_total')
            .select('total_tokens, total_usdt_value')
            .eq('id', 1)
            .single();

        if (fetchError) {
            console.error('Error fetching current totals:', fetchError);
            return;
        }

        // Se não existir registro, usa valores zerados
        const currentTokens = currentTotal?.total_tokens || '0';
        const currentUsdt = currentTotal?.total_usdt_value || '0';

        // Calcula os novos totais com precisão de 2 casas decimais
        const updatedTokens = (parseFloat(currentTokens) + parseFloat(newTokenAmount)).toFixed(2);
        const updatedUsdt = (parseFloat(currentUsdt) + parseFloat(newUsdtValue)).toFixed(2);

        // Atualiza o registro
        const { error: updateError } = await supabase
            .from('token_sales_total')
            .update({
                total_tokens: updatedTokens,
                total_usdt_value: updatedUsdt
            })
            .eq('id', 1);

        if (updateError) {
            console.error('Error updating token_sales_total:', updateError);
        } else {
            console.log('Token sales total updated successfully:', {
                total_tokens: updatedTokens,
                total_usdt_value: updatedUsdt
            });
        }
    } catch (error) {
        console.error('Error in updateTokenSalesTotal:', error);
    }
};

// Função para salvar uma compra com informações de referral
export const savePurchaseWithReferral = async (
    walletAddress: string,
    hash: string,
    amount: string,
    currency: 'BNB' | 'USDT',
    tokenAmount: string
) => {
    try {
        console.log('=== Starting Purchase Save Process ===');
        console.log('Input Data:', {
            walletAddress,
            hash,
            amount,
            currency,
            tokenAmount
        });

        // Verifica se já existe uma compra com este hash
        const { data: existingPurchase } = await supabase
            .from('purchases')
            .select('hash')
            .eq('hash', hash)
            .single();

        if (existingPurchase) {
            console.log('Purchase with this hash already exists:', hash);
            return true; // Retorna true pois a compra já existe
        }

        // Busca o código de referral usado pela wallet, se houver
        const { data: walletData, error: walletError } = await supabase
            .from('wallets')
            .select('referral_used')
            .eq('wallet_address', walletAddress)
            .single();

        if (walletError) {
            console.error('Error fetching wallet data:', walletError);
        }

        console.log('Wallet referral data:', walletData);

        // Calcula o valor da comissão no momento da compra
        const referralEarnings = await calculateReferralEarnings(amount, currency);
        console.log('Calculated referral earnings:', referralEarnings);

        // Prepara os dados da compra
        const purchaseData = {
            hash: hash,
            buyer_wallet: walletAddress,
            currency: currency,
            amount: amount,
            token_amount: tokenAmount,
            referral_code: walletData?.referral_used || null,
            referral_earnings: referralEarnings.toFixed(2),
            status: 'completed',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        console.log('Purchase data to be saved:', purchaseData);

        // Tenta salvar a compra
        const { data, error } = await supabase
            .from('purchases')
            .insert([purchaseData])
            .select();

        if (error) {
            console.error('Error saving purchase:', error);
            console.error('Error details:', {
                code: error.code,
                message: error.message,
                details: error.details
            });
            return false;
        }

        console.log('Purchase saved successfully:', data);

        // Calcula o valor em USDT para atualizar o total
        let usdtValue = currency === 'USDT' ? amount : (await calculateReferralEarnings(amount, 'BNB') * 20);
        
        // Atualiza o total de vendas após salvar a compra
        await updateTokenSalesTotal(tokenAmount, usdtValue.toString());

        // Se houver código de referral, atualiza o valor pendente
        if (walletData?.referral_used) {
            console.log('Processing referral for code:', walletData.referral_used);
            try {
                // Busca a wallet do referral
                const { data: referrerData, error: referrerError } = await supabase
                    .from('wallets')
                    .select('wallet_address')
                    .eq('referral_code', walletData.referral_used)
                    .single();

                if (referrerError) {
                    console.error('Error fetching referrer data:', referrerError);
                }

                console.log('Referrer data:', referrerData);

                if (referrerData) {
                    // Primeiro busca o valor pendente atual
                    const { data: currentPending } = await supabase
                        .from('pending_referral_earnings')
                        .select('pending_amount')
                        .eq('wallet_address', referrerData.wallet_address)
                        .single();

                    // Calcula o novo valor total
                    const currentAmount = currentPending ? parseFloat(currentPending.pending_amount) : 0;
                    const newTotalAmount = (currentAmount + referralEarnings).toFixed(2);

                    // Atualiza com o valor total
                    const { error: pendingError } = await supabase
                        .from('pending_referral_earnings')
                        .upsert([{
                            wallet_address: referrerData.wallet_address,
                            pending_amount: newTotalAmount
                        }], {
                            onConflict: 'wallet_address'
                        })
                        .select();

                    if (pendingError) {
                        console.error('Error updating pending amount:', pendingError);
                    } else {
                        console.log('Pending amount updated. Previous:', currentAmount, 'New:', newTotalAmount);
                    }
                }
            } catch (referralError) {
                console.error('Error processing referral:', referralError);
            }
        }

        console.log('=== Purchase Save Process Completed Successfully ===');
        return true;
    } catch (error) {
        console.error('=== Purchase Save Process Failed ===');
        console.error('Critical error in savePurchaseWithReferral:', error);
        return false;
    }
};

// Função para salvar uma compra
export const savePurchase = async (
    walletAddress: string,
    hash: string,
    amount: string,
    currency: 'BNB' | 'USDT',
    tokenAmount: string
) => {
    try {
        const { data, error } = await supabase
            .from('purchases')
            .insert([{
                wallet_address: walletAddress,
                hash: hash,
                amount: amount,
                currency: currency,
                token_amount: tokenAmount,
                timestamp: new Date().toISOString() // Garantindo que o timestamp é uma string ISO
            }])
            .select();

        if (error) {
            console.error('Error saving purchase:', error);
            throw error;
        }

        console.log('Purchase saved successfully:', data);
        return data;
    } catch (error) {
        console.error('Error in savePurchase:', error);
        throw error;
    }
};

// Função para buscar compras de uma wallet
export const fetchPurchases = async (walletAddress: string): Promise<Purchase[]> => {
    try {
        console.log('Buscando compras para wallet:', walletAddress);
        
        // Fetch crypto purchases
        const { data: cryptoPurchases, error: cryptoError } = await supabase
            .from('purchases')
            .select('*')
            .eq('buyer_wallet', walletAddress)
            .order('created_at', { ascending: false });

        if (cryptoError) {
            console.error('Erro ao buscar compras crypto:', cryptoError);
            throw cryptoError;
        }

        // Fetch PIX purchases
        const { data: pixPurchases, error: pixError } = await supabase
            .from('pix_transactions')
            .select('*')
            .eq('wallet_address', walletAddress)
            .eq('status', 'paid')
            .order('created_at', { ascending: false });

        if (pixError) {
            console.error('Erro ao buscar compras PIX:', pixError);
            throw pixError;
        }

        // Process PIX referrals and transform purchases
        const formattedPixPurchases = (pixPurchases || []).map(pix => {
            return {
                id: pix.id,
                hash: pix.transaction_id,
                buyer_wallet: pix.wallet_address,
                currency: 'BRL' as const,
                amount: pix.amount_brl.toString(),
                token_amount: pix.xstp_quantity.toString(),
                status: pix.status,
                created_at: pix.created_at,
                updated_at: pix.updated_at,
                transaction_id: pix.transaction_id,
                payment_method: 'PIX' as const,
                referral_code: pix.referral_code
            };
        });

        // Add payment_method to crypto purchases
        const formattedCryptoPurchases = (cryptoPurchases || []).map(purchase => ({
            ...purchase,
            payment_method: 'CRYPTO' as const
        }));

        // Combine and sort all purchases by date
        const allPurchases = [...formattedCryptoPurchases, ...formattedPixPurchases]
            .sort((a, b) => {
                const dateA = new Date(a.created_at || 0).getTime();
                const dateB = new Date(b.created_at || 0).getTime();
                return dateB - dateA;
            });

        console.log('Todas as compras encontradas:', allPurchases);
        return allPurchases;
    } catch (error) {
        console.error('Erro em fetchPurchases:', error);
        return [];
    }
};

// Função para buscar o preço atual do BNB
const fetchBnbPrice = async (): Promise<number> => {
  const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');
  const data = await response.json();
  return parseFloat(data.price);
};

export const updateRaisedValue = async (amount: string, isBnb: boolean = false) => {
  try {
    // Busca o estágio ativo
    const { data: activeStage, error: stageError } = await supabase
      .from('sale_stages')
      .select('*')
      .eq('is_active', true)
      .single();

    if (stageError) throw stageError;

    // Converte o valor para USDT se for BNB
    let amountInUsdt = amount;
    if (isBnb) {
      const bnbPrice = await fetchBnbPrice();
      amountInUsdt = (parseFloat(amount) * bnbPrice).toString();
    }

    // Calcula o novo valor arrecadado
    const newRaisedValue = (parseFloat(activeStage.raised_value || '0') + parseFloat(amountInUsdt)).toString();

    // Atualiza o valor arrecadado do estágio ativo
    const { error: updateError } = await supabase
      .from('sale_stages')
      .update({ raised_value: newRaisedValue })
      .eq('id', activeStage.id);

    if (updateError) throw updateError;

    // Verifica se atingiu 98% do target para trocar de estágio
    const valorAposVenda = parseFloat(newRaisedValue);
    const limiteParaTroca = parseFloat(activeStage.target_value) * 0.98;

    if (valorAposVenda >= limiteParaTroca) {
      // Busca o próximo estágio
      const { data: nextStage, error: nextError } = await supabase
        .from('sale_stages')
        .select('*')
        .eq('stage_number', activeStage.stage_number + 1)
        .single();

      if (!nextError && nextStage) {
        // Desativa o estágio atual
        await supabase
          .from('sale_stages')
          .update({ is_active: false })
          .eq('id', activeStage.id);

        // Ativa o próximo estágio
        await supabase
          .from('sale_stages')
          .update({ is_active: true })
          .eq('id', nextStage.id);

        console.log(`Stage changed from ${activeStage.stage_number} to ${nextStage.stage_number}`);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating raised value:', error);
    return { success: false, error };
  }
}; 