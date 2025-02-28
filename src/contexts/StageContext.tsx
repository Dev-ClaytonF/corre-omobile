import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

interface StageContextType {
  activeStage: any;
  nextStage: any;
  loading: boolean;
  setActiveStage: React.Dispatch<React.SetStateAction<any>>;
  setNextStage: React.Dispatch<React.SetStateAction<any>>;
}

const StageContext = createContext<StageContextType | undefined>(undefined);

export const StageProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeStage, setActiveStage] = useState<any>(null);
  const [nextStage, setNextStage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const { data, error } = await supabase
          .from('sale_stages')
          .select('*')
          .order('stage_number');

        if (error) throw error;

        const active = data?.find(stage => stage.is_active);
        if (active) {
          setActiveStage(active);
          const next = data?.find(stage => stage.stage_number === active.stage_number + 1);
          setNextStage(next);
        }
      } catch (error) {
        console.error('Erro ao buscar estágios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStages();

    // Inscreve para atualizações em tempo real
    const subscription = supabase
      .channel('sale_stages')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sale_stages' },
        fetchStages
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <StageContext.Provider value={{ activeStage, nextStage, loading, setActiveStage, setNextStage }}>
      {children}
    </StageContext.Provider>
  );
};

export const useStage = () => {
  const context = useContext(StageContext);
  if (!context) {
    throw new Error('useStage must be used within a StageProvider');
  }
  return {
    activeStage: context.activeStage,
    nextStage: context.nextStage,
    loading: context.loading,
    setActiveStage: context.setActiveStage,
    setNextStage: context.setNextStage
  };
}; 