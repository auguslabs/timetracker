import { useState, useEffect, useRef } from 'react';

export const useBackgroundTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const workerRef = useRef(null);
  const [isWorkerSupported, setIsWorkerSupported] = useState(false);

  useEffect(() => {
    // Verificar si Web Workers están soportados
    if (typeof Worker !== 'undefined') {
      try {
        workerRef.current = new Worker('/timer-worker.js');
        setIsWorkerSupported(true);
        
        // Configurar el listener del worker
        workerRef.current.onmessage = (e) => {
          const { type, time: workerTime, isRunning: workerIsRunning } = e.data;
          
          switch (type) {
            case 'TICK':
              setTime(workerTime);
              break;
            case 'PAUSED':
              setTime(workerTime);
              setIsRunning(false);
              break;
            case 'RESET':
              setTime(workerTime);
              setIsRunning(false);
              break;
            case 'CURRENT_TIME':
              setTime(workerTime);
              setIsRunning(workerIsRunning);
              break;
            case 'TIME_SET':
              setTime(workerTime);
              break;
          }
        };
      } catch (error) {
        console.warn('Web Worker not supported, falling back to regular timer');
        setIsWorkerSupported(false);
      }
    }

    // Cleanup al desmontar
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const startTimer = () => {
    if (isWorkerSupported && workerRef.current) {
      workerRef.current.postMessage({
        type: 'START_TIMER',
        data: { initialTime: time }
      });
      setIsRunning(true);
    } else {
      // Fallback para navegadores sin soporte de Web Workers
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    if (isWorkerSupported && workerRef.current) {
      workerRef.current.postMessage({ type: 'PAUSE_TIMER' });
    } else {
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    if (isWorkerSupported && workerRef.current) {
      workerRef.current.postMessage({ type: 'RESET_TIMER' });
    } else {
      setTime(0);
      setIsRunning(false);
    }
  };

  const getCurrentTime = () => {
    if (isWorkerSupported && workerRef.current) {
      workerRef.current.postMessage({ type: 'GET_CURRENT_TIME' });
    }
  };

  // Fallback timer para navegadores sin Web Workers
  useEffect(() => {
    let interval = null;
    if (isRunning && !isWorkerSupported) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, isWorkerSupported]);

  // Sincronizar el estado cuando la ventana vuelve a estar activa
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isWorkerSupported && workerRef.current) {
        getCurrentTime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isWorkerSupported]);

  return {
    time,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    isWorkerSupported
  };
}; 