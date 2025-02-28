import { createContext, useContext, useRef, useEffect } from 'react';
import { useActiveAccount, useDisconnect, useActiveWallet } from 'thirdweb/react';
import { supabase } from '../utils/supabase';

interface WalletContextType {
    activeAccount: any;
    handleConnect: () => void;
    handleDisconnect: () => void;
    formatAddress: (address: string) => string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const activeAccount = useActiveAccount();
    const { disconnect } = useDisconnect();
    const activeWallet = useActiveWallet();
    const thirdwebButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const findThirdwebButton = () => {
            let button = document.querySelector('[data-test="connect-wallet-button"]') as HTMLButtonElement | null;
            thirdwebButtonRef.current = button;
        };

        findThirdwebButton();

        const observer = new MutationObserver(() => {
            findThirdwebButton();
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });

        return () => observer.disconnect();
    }, [activeAccount]);

    // Efeito para registrar a wallet quando conectada
    useEffect(() => {
        const registerWallet = async () => {
            if (activeAccount?.address) {
                try {
                    const walletAddress = activeAccount.address;

                    console.log('Registering wallet:', walletAddress);

                    // Verifica se a wallet já existe
                    const { data: existingWallet, error: fetchError } = await supabase
                        .from('wallets')
                        .select('*')
                        .eq('wallet_address', walletAddress)
                        .single();

                    console.log('Existing wallet check:', { existingWallet, fetchError });

                    if (!existingWallet) {
                        // Se não existir, cria um registro básico
                        const { error: insertError } = await supabase
                            .from('wallets')
                            .insert([{ 
                                wallet_address: walletAddress,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            }])
                            .select();

                        console.log('Wallet registration result:', { insertError });

                        if (insertError && insertError.code !== '23505') { // Ignora erro de duplicata
                            console.error('Error registering wallet:', insertError);
                        }
                    }
                } catch (error) {
                    console.error('Error in registerWallet:', error);
                }
            }
        };

        registerWallet();
    }, [activeAccount]);

    const handleConnect = () => {
        if (!thirdwebButtonRef.current) {
            console.warn("Botão Connect da Thirdweb não encontrado no DOM.");
            return;
        }

        thirdwebButtonRef.current.click();
    };

    const handleDisconnect = () => {
        if (activeWallet) {
            disconnect(activeWallet);
        }
    };

    const formatAddress = (address: string) => {
        if (!address) return "";
        return `${address.substring(0, 3)}...${address.substring(address.length - 4)}`;
    };

    return (
        <WalletContext.Provider value={{
            activeAccount,
            handleConnect,
            handleDisconnect,
            formatAddress
        }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}; 