import { useState, useEffect, useCallback } from 'react';

const MouseTracker = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newPosition = {
      x: e.clientX,
      y: e.clientY
    };
    
    setPosition(newPosition);
    setTrail(prevTrail => [
      { x: newPosition.x, y: newPosition.y, id: Date.now() },
      ...prevTrail.slice(0, 4) // Reduzindo para 5 pontos para melhor performance
    ]);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <>
      {/* Rastro */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="pointer-events-none fixed z-40"
          style={{
            left: point.x,
            top: point.y,
            transform: 'translate(-50%, -50%)',
            opacity: 1 - (index * 0.2),
            transition: 'all 0.1s linear'
          }}
        >
          <div 
            className="w-3 h-3 rounded-full blur-sm"
            style={{
              backgroundColor: `rgba(168, 85, 247, ${0.3 - (index * 0.05)})`
            }}
          />
        </div>
      ))}

      {/* Cursor principal */}
      <div 
        className="pointer-events-none fixed z-50"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.05s linear'
        }}
      >
        <div className="w-2 h-2 bg-purple-500 rounded-full opacity-50 blur-[1px]" />
        <div className="absolute top-0 left-0 w-2 h-2 bg-purple-500/30 rounded-full animate-ping" />
      </div>
    </>
  );
};

export default MouseTracker; 