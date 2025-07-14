// Timer Web Worker
let timerInterval = null;
let currentTime = 0;
let isRunning = false;

self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'START_TIMER':
      if (!isRunning) {
        isRunning = true;
        currentTime = data.initialTime || 0;
        timerInterval = setInterval(() => {
          currentTime++;
          self.postMessage({
            type: 'TICK',
            time: currentTime
          });
        }, 1000);
      }
      break;
      
    case 'PAUSE_TIMER':
      if (isRunning) {
        isRunning = false;
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
        self.postMessage({
          type: 'PAUSED',
          time: currentTime
        });
      }
      break;
      
    case 'RESET_TIMER':
      isRunning = false;
      currentTime = 0;
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      self.postMessage({
        type: 'RESET',
        time: currentTime
      });
      break;
      
    case 'GET_CURRENT_TIME':
      self.postMessage({
        type: 'CURRENT_TIME',
        time: currentTime,
        isRunning
      });
      break;
      
    case 'SET_TIME':
      currentTime = data.time || 0;
      self.postMessage({
        type: 'TIME_SET',
        time: currentTime
      });
      break;
  }
}; 