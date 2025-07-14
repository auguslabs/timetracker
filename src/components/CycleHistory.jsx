import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatTime, formatCurrency } from '../utils/timeUtils';

export default function CycleHistory() {
  const [cycles, setCycles] = useLocalStorage('cycles', []);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, closed

  const filteredCycles = cycles.filter(cycle => {
    if (filter === 'all') return true;
    if (filter === 'active') return cycle.status === 'active';
    if (filter === 'closed') return cycle.status === 'closed';
    return true;
  });

  const calculateCycleTotal = (cycle) => {
    if (!cycle.sessions || cycle.sessions.length === 0) return 0;
    const totalHours = cycle.sessions.reduce((total, session) => {
      return total + (session.duration / 3600);
    }, 0);
    return totalHours * cycle.hourlyRate;
  };

  const calculateTotalHours = (cycle) => {
    if (!cycle.sessions || cycle.sessions.length === 0) return 0;
    const totalSeconds = cycle.sessions.reduce((total, session) => total + session.duration, 0);
    return (totalSeconds / 3600).toFixed(2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Cycle History</h2>
      
      {/* Filter Controls */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          All ({cycles.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'active' 
              ? 'bg-green-500 text-white' 
              : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          Active ({cycles.filter(c => c.status === 'active').length})
        </button>
        <button
          onClick={() => setFilter('closed')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'closed' 
              ? 'bg-purple-500 text-white' 
              : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          Closed ({cycles.filter(c => c.status === 'closed').length})
        </button>
      </div>

      {/* Cycles List */}
      <div className="grid gap-4">
        {filteredCycles.length === 0 ? (
          <div className="text-center text-white/60 py-8">
            {filter === 'all' ? 'No cycles created' : `No ${filter === 'active' ? 'active' : 'closed'} cycles`}
          </div>
        ) : (
          filteredCycles.slice().reverse().map(cycle => (
            <div key={cycle.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{cycle.name}</h3>
                  <div className="text-sm text-white/70">
                    Created: {formatDate(cycle.createdAt)}
                    {cycle.closedAt && ` | Closed: ${formatDate(cycle.closedAt)}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    cycle.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {cycle.status === 'active' ? '🟢 Active' : '✅ Closed'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                <div>
                  <div className="text-white/60">Sessions</div>
                  <div className="text-white font-semibold">{cycle.sessions?.length || 0}</div>
                </div>
                <div>
                  <div className="text-white/60">Total Hours</div>
                  <div className="text-white font-semibold">{calculateTotalHours(cycle)}h</div>
                </div>
                <div>
                  <div className="text-white/60">Hourly Rate</div>
                  <div className="text-white font-semibold">${cycle.hourlyRate}</div>
                </div>
                <div>
                  <div className="text-white/60">Total</div>
                  <div className="text-green-400 font-semibold">${calculateCycleTotal(cycle).toFixed(2)}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCycle(selectedCycle?.id === cycle.id ? null : cycle)}
                  className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm rounded transition-colors"
                >
                  {selectedCycle?.id === cycle.id ? 'Hide' : 'View'} Details
                </button>
                {cycle.status === 'closed' && (
                  <button
                    onClick={() => {
                      // TODO: Implementar compartir reporte
                      alert('Share report function coming soon');
                    }}
                    className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm rounded transition-colors"
                  >
                    📧 Share
                  </button>
                )}
              </div>

              {/* Cycle Details */}
              {selectedCycle?.id === cycle.id && cycle.sessions && cycle.sessions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-white mb-2">Work Sessions</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {cycle.sessions.map(session => (
                      <div key={session.id} className="bg-white/5 rounded p-2 text-sm">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                          <div className="flex flex-col gap-1">
                            <div className="font-mono font-bold text-white">{session.date}</div>
                            <div className="text-xs text-white/80">Start: {session.startTime} | End: {session.endTime}</div>
                            <div className="text-xs text-white/60">Total: {(session.duration / 3600).toFixed(2)}h</div>
                            {session.activityDetail && (
                              <div className="text-xs text-white/70 mt-1">
                                <span className="font-semibold">Activities:</span> {session.activityDetail}
                              </div>
                            )}
                          </div>
                          <div className="text-right md:ml-4">
                            <div className="text-green-400 font-semibold text-lg">
                              ${((session.duration / 3600) * cycle.hourlyRate).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 