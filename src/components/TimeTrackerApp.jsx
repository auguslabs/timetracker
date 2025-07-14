import { useState, useEffect } from 'react';
import Navigation from './Navigation.jsx';
import HomeScreen from './HomeScreen.jsx';
import CreateCyclesScreen from './CreateCyclesScreen.jsx';
import TimerScreen from './TimerScreen.jsx';
import HistoryScreen from './HistoryScreen.jsx';
import { useBackgroundTimer } from '../hooks/useBackgroundTimer';

export default function TimeTrackerApp() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isClient, setIsClient] = useState(false);
  const { time, isRunning, startTimer, pauseTimer, resetTimer, isWorkerSupported } = useBackgroundTimer();

  // PWA update banner state
  const [showUpdate, setShowUpdate] = useState(false);
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
      });
      navigator.serviceWorker.getRegistration && navigator.serviceWorker.getRegistration().then(reg => {
        if (!reg) return;
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdate(true);
              }
            });
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-black/80 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-white/80">Uploading...</p>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} isRunning={isRunning} time={time} />;
      case 'create-cycles':
        return <CreateCyclesScreen onNavigate={handleNavigate} />;
      case 'timer':
        return <TimerScreen 
          time={time}
          isRunning={isRunning}
          startTimer={startTimer}
          pauseTimer={pauseTimer}
          resetTimer={resetTimer}
          isWorkerSupported={isWorkerSupported}
          onNavigate={handleNavigate}
        />;
      case 'history':
        return <HistoryScreen />;
      default:
        return <HomeScreen onNavigate={handleNavigate} isRunning={isRunning} time={time} />;
    }
  };

  return (
    <>
      {showUpdate && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-400 text-black text-center py-3 font-semibold cursor-pointer shadow-lg" onClick={() => window.location.reload()}>
          New version available. Click to update.
        </div>
      )}
      <Navigation currentScreen={currentScreen} onNavigate={handleNavigate}>
        {renderScreen()}
      </Navigation>
    </>
  );
} 