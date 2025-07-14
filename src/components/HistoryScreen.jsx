import CycleHistory from './CycleHistory.jsx';

export default function HistoryScreen() {
  return (
    <div className="min-h-screen">
      {/* Título de la pantalla */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Cycle History</h2>
        <p className="text-white/80">Review all your projects and work sessions</p>
      </div>

      {/* Componente CycleHistory */}
      <CycleHistory />
    </div>
  );
} 