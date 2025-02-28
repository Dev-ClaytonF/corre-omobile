import { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000; // 4 seconds
    const interval = 40; // Update every 40ms for smooth animation
    const steps = duration / interval;
    const incrementValue = 100 / steps;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + incrementValue;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, interval);

    const timer = setTimeout(() => {
      setShow(false);
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="min-h-screen bg-black fixed inset-0 z-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Welcome to StartupX
          </h2>
        </div>
        
        <div className="relative">
          {/* Background bar */}
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            {/* Progress bar with gradient and glow effect */}
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Percentage text */}
          <div className="mt-4 text-center">
            <span className="text-purple-400 font-medium">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Preparing your experience...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 