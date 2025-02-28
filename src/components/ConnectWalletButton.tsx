import { useWallet } from '../contexts/WalletContext';
import { ConnectButton, darkTheme } from 'thirdweb/react';
import { createThirdwebClient } from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import { useState } from 'react';
import BuyTokenModal from './BuyTokenModal';
import { createClient } from '@supabase/supabase-js';

const client = createThirdwebClient({
  clientId: import.meta.env.VITE_TEMPLATE_CLIENT_ID
});

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.binance"),
  createWallet("com.coinbase.wallet"),
  createWallet("com.trustwallet.app"),
];

const supabase = createClient(
    'https://bdvscuvugnvcfvwpvfxw.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdnNjdXZ1Z252Y2Z2d3B2Znh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4Mzc4NDYsImV4cCI6MjA1NTQxMzg0Nn0.i4yU5gP120R9dRpb7ZNT2JQEEU1jmE3BUNLjKqxHNFY'
);

const registerWallet = async (walletAddress: string) => {
    try {
        // Verifica se a wallet já existe
        const { data: existingWallet } = await supabase
            .from('wallets')
            .select('id')
            .eq('wallet_address', walletAddress)
            .single();

        if (!existingWallet) {
            // Se não existir, cria um novo registro
            const { data, error } = await supabase
                .from('wallets')
                .insert([
                    { 
                        wallet_address: walletAddress,
                        referral_link: `https://startupx.com?ref=${walletAddress}` // Link de referral básico
                    }
                ])
                .select();

            if (error) {
                console.error('Error registering wallet:', error);
            } else {
                console.log('Wallet registered successfully:', data);
            }
        }
    } catch (error) {
        console.error('Error in registerWallet:', error);
    }
};

interface ConnectWalletButtonProps {
  variant?: 'header' | 'default';
  showBuyNow?: boolean;
}

const ConnectWalletButton = ({ variant = 'default', showBuyNow = false }: ConnectWalletButtonProps) => {
  const { activeAccount, handleConnect, handleDisconnect, formatAddress } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonStyles = {
    header: "relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-white rounded-md group bg-gradient-to-br from-purple-500 to-pink-500",
    default: `bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm py-3 
      ${showBuyNow ? 'px-16 w-64' : 'px-8'} 
      rounded-full shadow-lg`
  };

  const spanStyles = {
    header: "relative px-2 py-1 transition-all ease-in duration-75 rounded-md bg-black text-white text-xs",
    default: ""
  };

  const pulseAnimation = showBuyNow && activeAccount ? "animate-pulse" : "";

  const handleBuyClick = () => {
    setIsModalOpen(true);
  };

  const handleConnectWallet = async () => {
    try {
      await handleConnect();
      
      // Após conectar com sucesso, registre a wallet
      if (activeAccount) {
        await registerWallet(activeAccount.address);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <div className={`flex ${variant === 'header' ? 'flex-row gap-2 items-center' : 'flex-col items-center'}`}>
      <button
        className={`${buttonStyles[variant]} ${pulseAnimation}`}
        onClick={activeAccount ? (showBuyNow ? handleBuyClick : handleConnectWallet) : handleConnectWallet}
      >
        <span className={spanStyles[variant]}>
          {activeAccount 
            ? (showBuyNow ? 'Buy Now' : formatAddress(activeAccount.address))
            : 'Connect Wallet'
          }
        </span>
      </button>

      {variant === 'header' && activeAccount && (
        <button
          onClick={handleDisconnect}
          className="px-2 py-0.5 text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md shadow-sm"
        >
          Disconnect
        </button>
      )}

      {variant === 'default' && activeAccount && showBuyNow && (
        <>
          <p className="text-white text-sm mt-2 mb-2">
            Your Wallet: {formatAddress(activeAccount.address)}
          </p>
          <button
            onClick={handleDisconnect}
            className="px-3 py-0.5 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-md"
          >
            Disconnect
          </button>
        </>
      )}

      <div style={{ display: 'none' }}>
        <ConnectButton
          client={client}
          wallets={wallets}
          theme={darkTheme()}
          connectModal={{
            size: "compact",
            title: "StartUpX",
            showThirdwebBranding: false,
          }}
        />
      </div>

      {showBuyNow && (
        <BuyTokenModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ConnectWalletButton; 