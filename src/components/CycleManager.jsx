import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createCycle, closeCycle, getActiveCycle } from '../utils/localStorage';
import { formatCurrency } from '../utils/timeUtils';

export default function CycleManager({ onCycleChange, onNavigate }) {
  const [cycles, setCycles] = useLocalStorage('cycles', []);
  const [activeCycle, setActiveCycle] = useState(null);
  const [cycleName, setCycleName] = useState('');
  const [hourlyRate, setHourlyRate] = useState(10);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const currentActive = getActiveCycle();
    setActiveCycle(currentActive);
  }, [cycles]);

  const handleCreateCycle = () => {
    if (!cycleName.trim()) return;
    
    const newCycle = createCycle(cycleName, hourlyRate);
    setCycles(prev => [...prev, newCycle]);
    setCycleName('');
    onCycleChange?.(newCycle);
  };

  const handleCloseCycle = (cycleId) => {
    const updatedCycles = closeCycle(cycleId);
    setCycles(updatedCycles);
    onCycleChange?.(null);
  };

  const calculateCycleTotal = (cycle) => {
    if (!cycle.sessions || cycle.sessions.length === 0) return 0;
    const totalHours = cycle.sessions.reduce((total, session) => {
      return total + (session.duration / 3600);
    }, 0);
    return totalHours * cycle.hourlyRate;
  };

  if (!isClient) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-md mx-auto mb-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-md mx-auto mb-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Cycle Management</h2>
      
      {/* Active Cycle Display */}
      {activeCycle && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-green-400 mb-2">
            Active Cycle: {activeCycle.name}
          </h3>
          <div className="text-sm text-white/80 space-y-1">
            <p>Hours worked: {(activeCycle.sessions?.reduce((total, s) => total + s.duration, 0) / 3600).toFixed(2)}h</p>
            <p>Hourly rate: ${activeCycle.hourlyRate}</p>
            <p className="text-green-400 font-semibold">
              Total: ${calculateCycleTotal(activeCycle).toFixed(2)}
            </p>
          </div>
          <div className="flex gap-3 mt-3 justify-center">
            <button
              onClick={() => handleCloseCycle(activeCycle.id)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Close Cycle
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate('timer')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                Go to Timer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create New Cycle */}
      {!activeCycle && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Create New Cycle</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-white/80 mb-1">Cycle Name</label>
              <input
                type="text"
                value={cycleName}
                onChange={(e) => setCycleName(e.target.value)}
                placeholder="Ex: Web Project - January 2024"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Hourly Rate ($)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                min="1"
                step="0.5"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
              />
            </div>
            <button
              onClick={handleCreateCycle}
              disabled={!cycleName.trim()}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              Create Cycle
            </button>
          </div>
        </div>
      )}

      {/* Recent Cycles */}
      {cycles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Recent Cycles</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {cycles.slice(0, 5).map(cycle => (
              <div key={cycle.id} className="bg-white/5 rounded p-3 text-white text-sm">
                <div className="font-semibold">{cycle.name}</div>
                <div className="text-white/70 text-xs">
                  {cycle.sessions?.length || 0} sessions - ${calculateCycleTotal(cycle).toFixed(2)}
                </div>
                <div className="text-white/50 text-xs">
                  {cycle.status === 'active' ? '🟢 Active' : '✅ Closed'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 