import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { addSessionToCycle, getActiveCycle } from '../utils/localStorage';
import { formatTime } from '../utils/timeUtils';

export default function TimeTracker({ 
  activeCycle, 
  onSessionSaved,
  time,
  isRunning,
  startTimer,
  pauseTimer,
  resetTimer,
  isWorkerSupported,
  onCreateCycle,
  onNavigate
}) {
  const [cycles, setCycles] = useLocalStorage('cycles', []);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [activityDetail, setActivityDetail] = useState("");

  // Cuando se pausa o resetea el timer, limpiar la hora de inicio
  useEffect(() => {
    if (!isRunning) {
      setStartTimestamp(null);
    }
  }, [isRunning]);

  const handleStartTimer = () => {
    if (!activeCycle) {
      alert('You must create a cycle before starting the timer');
      return;
    }
    setStartTimestamp(Date.now());
    startTimer();
  };

  const handlePauseTimer = () => {
    pauseTimer();
  };

  const handleResetTimer = () => {
    resetTimer();
    setStartTimestamp(null);
    setActivityDetail("");
  };

  const saveSession = () => {
    if (time > 0 && activeCycle) {
      const endTimestamp = Date.now();
      const startDate = startTimestamp ? new Date(startTimestamp) : new Date(endTimestamp - time * 1000);
      const endDate = new Date(endTimestamp);
      const newSession = {
        id: Date.now(),
        duration: time,
        startTime: startDate.toLocaleTimeString(),
        endTime: endDate.toLocaleTimeString(),
        date: endDate.toLocaleDateString(),
        formattedTime: formatTime(time),
        activityDetail: activityDetail.trim()
      };

      const updatedCycles = addSessionToCycle(activeCycle.id, newSession);
      setCycles(updatedCycles);
      resetTimer();
      setStartTimestamp(null);
      setActivityDetail("");
      onSessionSaved?.(newSession);
    } else if (!activeCycle) {
      alert('You must create a cycle before saving a session');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getActiveCycleSessions = () => {
    if (!activeCycle) return [];
    return activeCycle.sessions || [];
  };

  const calculateTotalHours = () => {
    const sessions = getActiveCycleSessions();
    const totalSeconds = sessions.reduce((total, session) => total + session.duration, 0);
    return (totalSeconds / 3600).toFixed(2);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Timer</h2>
      
      {/* Active Cycle Info */}
      {activeCycle && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
          <div className="text-sm text-green-400 font-semibold">
            Cycle: {activeCycle.name}
          </div>
          {isRunning && startTimestamp && (
            <div className="text-xs text-white/80">
              Start time: {new Date(startTimestamp).toLocaleTimeString()}
            </div>
          )}
          <div className="text-xs text-white/80">
            Total accumulated: {calculateTotalHours()}h - ${(calculateTotalHours() * activeCycle.hourlyRate).toFixed(2)}
          </div>
        </div>
      )}

      {!activeCycle && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
          <div className="text-sm text-yellow-400 font-semibold">
            ⚠️ No active cycle
          </div>
          <div className="text-xs text-white/80">
            Create a cycle to start working
          </div>
        </div>
      )}
      
      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-mono font-bold text-white mb-2">
          {formatTime(time)}
        </div>
        <div className="text-sm text-white/80">
          {isRunning ? '⏱️ Working' : '⏸️ Paused'}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        {!isRunning ? (
          <button
            onClick={handleStartTimer}
            disabled={!activeCycle}
            className="px-6 py-2 bg-green-400 hover:bg-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
          >
            ▶️ Start
          </button>
        ) : (
          <button
            onClick={handlePauseTimer}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors"
          >
            ⏸️ Pause
          </button>
        )}
        
        <button
          onClick={handleResetTimer}
          disabled={!activeCycle}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-black font-semibold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          🔄 Reset
        </button>
        <button
          onClick={() => onNavigate && onNavigate('home')}
          className="px-6 py-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold rounded-lg transition-colors"
        >
          🏠 Back to Home
        </button>
        {!activeCycle && (
          <button
            onClick={onCreateCycle}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-black font-semibold rounded-lg transition-colors"
          >
            ➕ Create New Cycle
          </button>
        )}
        
        {time > 0 && (
          <button
            onClick={saveSession}
            disabled={!activeCycle}
            className="px-6 py-2 bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
          >
            💾 Stop & Save
          </button>
        )}
      </div>

      {/* Activities Detail Input */}
      <div className="mb-6 max-w-md mx-auto">
        <label htmlFor="activity-detail" className="block text-sm text-white/80 mb-2 font-semibold">Activities Detail</label>
        <textarea
          id="activity-detail"
          value={activityDetail}
          onChange={e => setActivityDetail(e.target.value)}
          placeholder="Describe the activities for this session..."
          className="w-full min-h-[60px] px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-green-400 resize-vertical"
        />
      </div>

      {/* Current Cycle Sessions */}
      {activeCycle && getActiveCycleSessions().length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Cycle Sessions</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {getActiveCycleSessions().slice().reverse().slice(0, 5).map(session => (
              <div key={session.id} className="bg-white/5 rounded p-3 text-white text-sm">
                <div className="font-mono font-bold">{session.formattedTime}</div>
                <div className="text-white/70 text-xs">{session.date} | {session.startTime} - {session.endTime}</div>
                {session.activityDetail && (
                  <div className="text-xs text-white/70 mt-1">
                    <span className="font-semibold">Activities:</span> {session.activityDetail}
                  </div>
                )}
                <div className="text-green-400 text-xs">
                  ${((session.duration / 3600) * activeCycle.hourlyRate).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 