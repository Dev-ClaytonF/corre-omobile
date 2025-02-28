import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { supabase } from '../utils/supabase';
import { useLocation } from 'react-router-dom';

const ReferralBanner = () => {
    const activeAccount = useActiveAccount();
    const [referrerCode, setReferrerCode] = useState<string | null>(null);
    const [referrerName, setReferrerName] = useState<string | null>(null);
    const [, setShowExistingReferralMessage] = useState(false);
    const location = useLocation();

   
    const isPresalePage = location.pathname === '/presale';

   
    const saveTempReferralCode = (code: string) => {
        localStorage.setItem('temp_referral_code', code);
    };

    
    const getTempReferralCode = () => {
        return localStorage.getItem('temp_referral_code');
    };

    
    const saveReferralUsed = async (code: string) => {
        if (!activeAccount) return;

        try {
            const walletAddress = activeAccount.address;
            console.log('Saving referral for wallet:', walletAddress);

        
            const { data: existingWallet, error: fetchError } = await supabase
                .from('wallets')
                .select('*')
                .eq('wallet_address', walletAddress)
                .single();

            console.log('Existing wallet check:', { existingWallet, fetchError });

            if (existingWallet) {
                
                if (existingWallet.referral_used) {
                    console.log('Wallet already has referral:', existingWallet.referral_used);
                    setReferrerCode(existingWallet.referral_used);
                    fetchReferrerInfo(existingWallet.referral_used);
                    setShowExistingReferralMessage(true);
                    
                    localStorage.removeItem('temp_referral_code');
                    return;
                }

               
                const { error: updateError } = await supabase
                    .from('wallets')
                    .update({ 
                        referral_used: code,
                        updated_at: new Date().toISOString()
                    })
                    .eq('wallet_address', walletAddress);

                console.log('Update wallet with referral result:', { updateError });

                if (updateError) {
                    console.error('Error updating wallet with referral:', updateError);
                    return;
                }
            } else {
               
                const { error: insertError } = await supabase
                    .from('wallets')
                    .insert([{
                        wallet_address: walletAddress,
                        referral_used: code,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }]);

                console.log('Insert new wallet with referral result:', { insertError });

                if (insertError) {
                    console.error('Error inserting wallet with referral:', insertError);
                    return;
                }
            }

            // Se chegou aqui, o referral foi salvo com sucesso
            localStorage.removeItem('temp_referral_code');
            setReferrerCode(code);
            fetchReferrerInfo(code);

            // Confirma se o referral foi salvo
            const { data: confirmData } = await supabase
                .from('wallets')
                .select('referral_used')
                .eq('wallet_address', walletAddress)
                .single();

            console.log('Final confirmation - referral saved:', confirmData);
        } catch (error) {
            console.error('Error in saveReferralUsed:', error);
        }
    };

    // Função para buscar código usado anteriormente
    const fetchReferralUsed = async () => {
        if (!activeAccount) return null;

        try {
            const { data, error } = await supabase
                .from('wallets')
                .select('referral_used')
                .eq('wallet_address', activeAccount.address)
                .single();

            if (error) {
                console.error('Error fetching referral used:', error);
                return null;
            }

            return data?.referral_used || null;
        } catch (error) {
            console.error('Error in fetchReferralUsed:', error);
            return null;
        }
    };

    useEffect(() => {
        if (!isPresalePage) return;

        const initializeReferral = async () => {
            // Se tem wallet conectada, SEMPRE verifica primeiro no banco
            if (activeAccount) {
                const savedCode = await fetchReferralUsed();
                if (savedCode) {
                    console.log('Found existing referral in database:', savedCode);
                    setReferrerCode(savedCode);
                    fetchReferrerInfo(savedCode);
                    // Limpa qualquer código temporário, pois o do banco tem prioridade
                    localStorage.removeItem('temp_referral_code');
                    setShowExistingReferralMessage(true);
                    return;
                }
            }

            // Se não tem código no banco, aí sim verifica URL e localStorage
            const params = new URLSearchParams(window.location.search);
            const urlCode = params.get('ref');
            const tempCode = getTempReferralCode();

            // Prioriza código da URL sobre o do localStorage
            const codeToUse = urlCode || tempCode;

            if (codeToUse) {
                console.log('Using new referral code:', codeToUse);
                // Sempre atualiza o localStorage com o código mais recente
                saveTempReferralCode(codeToUse);
                setReferrerCode(codeToUse);
                fetchReferrerInfo(codeToUse);
                
                // Se tiver wallet conectada e não tem código no banco, salva
                if (activeAccount) {
                    await saveReferralUsed(codeToUse);
                }
            }
        };

        initializeReferral();
    }, [activeAccount, isPresalePage]);

    const fetchReferrerInfo = async (code: string) => {
        try {
            const { data, error } = await supabase
                .from('wallets')
                .select('name')
                .eq('referral_code', code)
                .single();

            if (data && !error) {
                setReferrerName(data.name);
            }
        } catch (error) {
            console.error('Error fetching referrer info:', error);
        }
    };

    // Mostra o banner se tiver código, mesmo sem wallet conectada
    if (!isPresalePage || !referrerCode) return null;

    return (
        <div className="w-full bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-lg border border-white/10 p-3">
            <div className="flex flex-col items-center gap-2">
                {/* Status do Código */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <div className="bg-purple-500/10 px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs">
                        <span className="text-gray-400">Code:</span>
                        <span className="text-white font-semibold">{referrerCode}</span>
                    </div>
                    
                    {referrerName && (
                        <div className="bg-pink-500/10 px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs">
                            <span className="text-gray-400">Indicated by:</span>
                            <span className="text-white font-semibold">{referrerName}</span>
                        </div>
                    )}
                </div>

                {/* Mensagens de Status */}
                <div className="flex flex-wrap justify-center gap-2">
                    {!activeAccount && (
                        <div className="bg-yellow-500/10 px-3 py-1.5 rounded-md flex items-center">
                            <span className="text-yellow-300 text-xs">
                                ⚠️ Connect your wallet
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReferralBanner; 