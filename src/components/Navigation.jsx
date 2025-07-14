import { useState, useEffect } from 'react';

export default function Navigation({ currentScreen, onNavigate, children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('left');

  const handleNavigate = (newScreen, dir = 'left') => {
    setDirection(dir);
    setIsTransitioning(true);
    
    setTimeout(() => {
      onNavigate(newScreen);
      setIsTransitioning(false);
    }, 300); // Duración de la transición
  };

  const goBack = () => {
    handleNavigate('home', 'right');
  };

  return (
    <div className="min-h-screen bg-black/80 text-white overflow-hidden">
      {/* Transición overlay */}
      {isTransitioning && (
        <div 
          className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
            isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      
      {/* Contenido principal con transición */}
      <div 
        className={`transition-transform duration-300 ease-in-out ${
          isTransitioning 
            ? direction === 'left' 
              ? '-translate-x-full' 
              : 'translate-x-full'
            : 'translate-x-0'
        }`}
      >
        {/* Header con botón de volver (excepto en home) */}
        {currentScreen !== 'home' && (
          <div className="p-4 border-b border-white/10">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
        )}
        
        {/* Contenido de la pantalla */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
} 