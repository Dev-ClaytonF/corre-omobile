import { useEffect, useState } from 'react';

interface LoadingTransitionProps {
  onComplete: () => void;
}

const LoadingTransition = ({ onComplete }: LoadingTransitionProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 4000; // 4 segundos
    const interval = 10; // atualiza a cada 10ms
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      setProgress(Math.min(currentProgress, 100));
      
      if (currentProgress >= 100) {
        clearInterval(timer);
        onComplete();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="w-[60%] max-w-xl relative">
        {/* Barra de progresso principal */}
        <div className="h-1 w-full bg-purple-900/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 rounded-full"
            style={{ 
              width: `${progress}%`,
              transition: 'width 0.1s linear',
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.5)'
            }}
          />
        </div>
        
        {/* Efeito de brilho */}
        <div 
          className="absolute top-0 h-1 bg-purple-500/50 blur-sm rounded-full"
          style={{ 
            width: `${progress}%`,
            transition: 'width 0.1s linear'
          }}
        />
        
        {/* Texto de loading */}
        <div className="absolute -top-8 left-0 right-0 text-center">
          <span className="text-purple-400 text-sm font-light tracking-wider">
            LOADING NEO AI
          </span>
        </div>
        
        {/* Porcentagem */}
        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <span className="text-purple-500 text-xs">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingTransition; 