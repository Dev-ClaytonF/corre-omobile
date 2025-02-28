import { Navigate } from 'react-router-dom';
import { useSuperUser } from '../contexts/SuperUserContext';
import { useWallet } from '../contexts/WalletContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSuperUser, isLoading } = useSuperUser();
  const { activeAccount } = useWallet();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!activeAccount) {
    return (
      <div className="min-h-screen bg-black pt-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acesso Restrito</h1>
          <p className="text-white">Por favor, conecte sua carteira para continuar.</p>
        </div>
      </div>
    );
  }

  if (!isSuperUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 