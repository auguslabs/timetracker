// Utilidades para manejo de tiempo y fechas

// Generar ID único
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Formatear tiempo en HH:MM:SS
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Formatear moneda
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Formatear tiempo en formato legible (ej: "2h 30m")
export const formatTimeReadable = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Calcular duración entre dos horas
export const calculateDuration = (startTime, endTime) => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  // Si endTime es menor que startTime, asumimos que es del día siguiente
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  return Math.floor((end - start) / 1000); // Retorna segundos
};

// Obtener fecha actual en formato YYYY-MM-DD
export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Obtener hora actual en formato HH:MM
export const getCurrentTime = () => {
  return new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// Formatear fecha en formato legible
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Calcular total de horas de un ciclo
export const calculateCycleTotalHours = (sessions) => {
  return sessions.reduce((total, session) => {
    return total + (session.duracion || 0);
  }, 0);
};

// Calcular pago basado en horas y tarifa
export const calculatePayment = (totalSeconds, hourlyRate) => {
  const totalHours = totalSeconds / 3600;
  return totalHours * hourlyRate;
};

// Validar formato de hora (HH:MM)
export const isValidTimeFormat = (timeString) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
};

// Obtener diferencia de tiempo entre dos fechas
export const getTimeDifference = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.floor((end - start) / 1000);
};

// Formatear duración para mostrar en la UI
export const formatDurationForDisplay = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
};

// Obtener el primer día de la semana
export const getWeekStart = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

// Obtener el último día de la semana
export const getWeekEnd = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 7);
  return new Date(d.setDate(diff));
}; 