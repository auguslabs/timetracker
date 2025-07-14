import CycleManager from './CycleManager.jsx';

export default function CreateCyclesScreen({ onNavigate }) {
  return (
    <div className="min-h-screen">
      {/* Título de la pantalla */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Cycle Management</h2>
        <p className="text-white/80">Create and manage your work projects</p>
      </div>

      {/* Componente CycleManager */}
      <CycleManager onNavigate={onNavigate} />
    </div>
  );
} 