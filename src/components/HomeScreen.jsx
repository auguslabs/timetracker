import { useState } from 'react';

export default function HomeScreen({ onNavigate, isRunning, time }) {
  const [showAbout, setShowAbout] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header con título y descripción */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 stroke-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 7v5l3 3" />
          </svg>
          Time Tracker
        </h1>
        <p className="text-white/80 text-lg max-w-md">
          Manage your work cycles professionally. 
          Create projects, track time and calculate payments automatically.
        </p>
      </div>

      {/* Timer Status Indicator */}
      {isRunning && time > 0 && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-green-400 font-semibold mb-1">
              ⏱️ Timer Running
            </div>
            <div className="text-2xl font-mono font-bold text-white">
              {formatTime(time)}
            </div>
            <div className="text-xs text-white/80 mt-1">
              Click "Timer" to continue tracking
            </div>
          </div>
        </div>
      )}

      {/* Botones de navegación */}
      <div className="space-y-4 w-full max-w-sm">
        <button
          onClick={() => onNavigate('create-cycles')}
          className="w-full px-6 py-4 bg-blue-500 hover:bg-blue-600 text-black font-semibold rounded-lg transition-colors text-lg flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Cycles / Projects
        </button>

        <button
          onClick={() => onNavigate('timer')}
          className={`w-full px-6 py-4 text-black font-semibold rounded-lg transition-colors text-lg flex items-center justify-center gap-3 ${
            isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {isRunning ? 'Timer (Running)' : 'Timer'}
        </button>

        <button
          onClick={() => onNavigate('history')}
          className="w-full px-6 py-4 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-colors text-lg flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          View History
        </button>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-white/60 text-sm flex flex-col items-center gap-2">
        <p>✨ Install this app on your device</p>
        <button
          className="flex items-center gap-1 text-white/80 hover:text-cyan-400 transition-colors text-xs mt-2"
          onClick={() => setShowAbout(true)}
          aria-label="About this app"
        >
          <span className="inline-block align-middle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="white" />
              <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill="black" fontFamily="Arial, sans-serif">i</text>
            </svg>
          </span>
          About
        </button>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold"
              onClick={() => setShowAbout(false)}
              aria-label="Close about dialog"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2 text-black">About</h2>
            <div className="text-black text-sm space-y-1">
              <div><span className="font-semibold">App:</span> TimeTracker PWA</div>
              <div><span className="font-semibold">Version:</span> 1.0.0</div>
              <div><span className="font-semibold">Last update:</span> {today}</div>
              <div><span className="font-semibold">Creator:</span> Auguslabs</div>
              <div><span className="font-semibold">Contact:</span> <a href="mailto:explore@auguslabs.com" className="text-cyan-600 underline hover:text-cyan-800">explore@auguslabs.com</a></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 