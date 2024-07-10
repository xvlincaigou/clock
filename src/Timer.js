import React, { useState, useEffect } from 'react';

const Timer = ({ mode }) => {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (running) {
      const start = Date.now() - elapsed;
      const interval = setInterval(() => setElapsed(Date.now() - start), 1000);
      return () => clearInterval(interval);
    }
  }, [running]);

  if (mode !== 'timer') {
    return null;
  }

  return (
    <div>
      <input
        type="number"
        value={elapsed / 1000}
        onChange={e => setElapsed(e.target.value * 1000)}
      />
      <button onClick={() => setRunning(!running)}>
        {running ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};

export default Timer;
