// Claves para LocalStorage
const STORAGE_KEYS = {
  CYCLES: 'cycles',
  SESSIONS: 'sessions',
  SETTINGS: 'settings'
};

// Funciones para Ciclos
export const createCycle = (name, hourlyRate = 10) => {
  const newCycle = {
    id: Date.now(),
    name,
    hourlyRate,
    status: 'active',
    createdAt: new Date().toISOString(),
    sessions: []
  };
  
  const cycles = getAllCycles();
  cycles.push(newCycle);
  localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(cycles));
  
  return newCycle;
};

export const getAllCycles = () => {
  try {
    const cycles = localStorage.getItem(STORAGE_KEYS.CYCLES);
    return cycles ? JSON.parse(cycles) : [];
  } catch (error) {
    console.error('Error loading cycles:', error);
    return [];
  }
};

export const getActiveCycle = () => {
  const cycles = getAllCycles();
  return cycles.find(cycle => cycle.status === 'active') || null;
};

export const closeCycle = (cycleId) => {
  const cycles = getAllCycles();
  const updatedCycles = cycles.map(cycle => {
    if (cycle.id === cycleId) {
      return {
        ...cycle,
        status: 'closed',
        closedAt: new Date().toISOString()
      };
    }
    return cycle;
  });
  
  localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(updatedCycles));
  return updatedCycles;
};

export const addSessionToCycle = (cycleId, session) => {
  const cycles = getAllCycles();
  const updatedCycles = cycles.map(cycle => {
    if (cycle.id === cycleId) {
      return {
        ...cycle,
        sessions: [...(cycle.sessions || []), session]
      };
    }
    return cycle;
  });
  
  localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(updatedCycles));
  return updatedCycles;
};

export const getCycleById = (cycleId) => {
  const cycles = getAllCycles();
  return cycles.find(cycle => cycle.id === cycleId);
};

// Funciones para Sesiones (mantenidas para compatibilidad)
export const sessionStorage = {
  // Obtener todas las sesiones
  getAll: () => {
    try {
      const sessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  },

  // Obtener sesiones por ciclo
  getByCycleId: (cycleId) => {
    const sessions = sessionStorage.getAll();
    return sessions.filter(session => session.cicloId === cycleId);
  },

  // Guardar sesión
  save: (session) => {
    try {
      const sessions = sessionStorage.getAll();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }
      
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
      return true;
    } catch (error) {
      console.error('Error saving session:', error);
      return false;
    }
  },

  // Eliminar sesión
  delete: (id) => {
    try {
      const sessions = sessionStorage.getAll();
      const filteredSessions = sessions.filter(session => session.id !== id);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(filteredSessions));
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  },

  // Obtener sesión activa
  getActive: () => {
    const sessions = sessionStorage.getAll();
    return sessions.find(session => session.estado === 'activa');
  }
};

// Funciones para Configuración
export const settingsStorage = {
  // Obtener configuración
  get: () => {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : {
        hourlyRate: 10,
        currency: 'USD',
        timeFormat: '24h'
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        hourlyRate: 10,
        currency: 'USD',
        timeFormat: '24h'
      };
    }
  },

  // Guardar configuración
  save: (settings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }
};

// Función para limpiar todos los datos (útil para testing)
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CYCLES);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
}; 