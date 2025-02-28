import { useWallet } from '../contexts/WalletContext';
import ConnectWalletButton from './ConnectWalletButton';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { activeAccount } = useWallet();

  if (!activeAccount) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="text-white text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">AI NEO</h2>
          <p className="text-gray-400">Para acessar o AI NEO, você precisa conectar sua carteira.</p>
        </div>
        <ConnectWalletButton variant="default" showBuyNow={false} />
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute; 