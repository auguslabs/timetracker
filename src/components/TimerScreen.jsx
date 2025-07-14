import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getActiveCycle, getAllCycles } from '../utils/localStorage';
import TimeTracker from './TimeTracker.jsx';

export default function TimerScreen({ 
  time, 
  isRunning, 
  startTimer, 
  pauseTimer, 
  resetTimer, 
  isWorkerSupported, 
  onNavigate
}) {
  const [cycles, setCycles] = useLocalStorage('cycles', []);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const activeCycle = getActiveCycle();
    setSelectedCycle(activeCycle);
  }, [cycles]);

  const handleCycleChange = (cycleId) => {
    const cycle = cycles.find(c => c.id === cycleId);
    setSelectedCycle(cycle);
  };

  const handleSessionSaved = (session) => {
    console.log('Session saved:', session);
    // Refresh cycles data
    const updatedCycles = getAllCycles();
    setCycles(updatedCycles);
  };

  const handleCreateCycle = () => {
    if (onNavigate) {
      onNavigate('create-cycles');
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Título de la pantalla */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Timer</h2>
        <p className="text-white/80">Select a cycle and start working</p>
      </div>

      {/* Selector de ciclo */}
      <div className="mb-8 max-w-md mx-auto">
        <label className="block text-sm text-white/80 mb-2">Select Cycle:</label>
        <select
          value={selectedCycle?.id || ''}
          onChange={(e) => handleCycleChange(e.target.value)}
          className="w-full px-4 py-2 bg-blue-40050 border border-white/20 rounded-lg text-gray-600 focus:outline-none focus:border-green-400"
        >
          <option value="">-- Select a cycle --</option>
          {cycles
            .filter(cycle => cycle.status === 'active')
            .map(cycle => (
              <option key={cycle.id} value={cycle.id}>
                {cycle.name} (${cycle.hourlyRate}/hour)
              </option>
            ))}
        </select>
      </div>

      {/* Cronómetro */}
      <TimeTracker 
        activeCycle={selectedCycle} 
        onSessionSaved={handleSessionSaved}
        time={time}
        isRunning={isRunning}
        startTimer={startTimer}
        pauseTimer={pauseTimer}
        resetTimer={resetTimer}
        isWorkerSupported={isWorkerSupported}
        onCreateCycle={handleCreateCycle}
        onNavigate={onNavigate}
      />
    </div>
  );
} 