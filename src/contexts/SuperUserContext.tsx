import { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from './WalletContext';
import { supabase } from '../utils/supabase';

interface SuperUserContextType {
  isSuperUser: boolean;
  isLoading: boolean;
}

const SuperUserContext = createContext<SuperUserContextType>({
  isSuperUser: false,
  isLoading: true,
});

export const SuperUserProvider = ({ children }: { children: React.ReactNode }) => {
  const { activeAccount } = useWallet();
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSuperUser = async () => {
      if (!activeAccount) {
        setIsSuperUser(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('super_users')
          .select('wallet_address')
          .eq('wallet_address', activeAccount.address)
          .single();

        if (error) {
          console.error('Erro ao verificar superusuário:', error);
          setIsSuperUser(false);
        } else {
          setIsSuperUser(!!data);
        }
      } catch (error) {
        console.error('Erro ao verificar superusuário:', error);
        setIsSuperUser(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSuperUser();
  }, [activeAccount]);

  return (
    <SuperUserContext.Provider value={{ isSuperUser, isLoading }}>
      {children}
    </SuperUserContext.Provider>
  );
};

export const useSuperUser = () => useContext(SuperUserContext); 