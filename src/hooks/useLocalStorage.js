import { useState, useEffect } from 'react';

// Hook genérico para localStorage
export const useLocalStorage = (key, initialValue) => {
  // Estado para almacenar nuestro valor
  // Pasa la función inicial al useState para que solo se ejecute una vez
  const [storedValue, setStoredValue] = useState(() => {
    // Verificar si estamos en el navegador
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      // Parse almacenado json o si no hay ninguno, retorna initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay un error, retorna initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Retorna una versión envuelta de la función setter de useState que persiste
  // el nuevo valor en localStorage.
  const setValue = (value) => {
    try {
      // Permite que value sea una función para que tengamos la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Guarda en el estado
      setStoredValue(valueToStore);
      // Guarda en localStorage solo si estamos en el navegador
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Una implementación más avanzada manejaría el caso de error
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Hook específico para ciclos
export const useCycles = () => {
  const [cycles, setCycles] = useLocalStorage('cycles', []);

  const getActiveCycle = () => {
    return cycles.find(cycle => cycle.status === 'active') || null;
  };

  const getClosedCycles = () => {
    return cycles.filter(cycle => cycle.status === 'closed');
  };

  return {
    cycles,
    setCycles,
    getActiveCycle,
    getClosedCycles
  };
};

// Hook específico para sesiones
export const useSessions = () => {
  const [sessions, setSessions] = useLocalStorage('sessions', []);

  const getSessionsByCycle = (cycleId) => {
    return sessions.filter(session => session.cycleId === cycleId);
  };

  return {
    sessions,
    setSessions,
    getSessionsByCycle
  };
};

// Hook específico para configuración
export const useSettings = () => {
  const [settings, setSettings] = useLocalStorage('settings', {
    hourlyRate: 10,
    currency: 'USD',
    timeFormat: '24h'
  });

  return {
    settings,
    setSettings
  };
}; 