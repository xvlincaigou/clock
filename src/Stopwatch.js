import React, { useState, useEffect } from 'react';

const Stopwatch = () => {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (running) {
      const start = Date.now() - elapsed;
      const interval = setInterval(() => setElapsed(Date.now() - start), 1000);
      return () => clearInterval(interval);
    }
  }, [running]);

  return (
    <div>
      <div>{new Date(elapsed).toISOString().slice(11, 19)}</div>
      <button onClick={() => setRunning(!running)}>
        {running ? 'Stop' : 'Start'}
      </button>
      <button
        onClick={() => {
          setElapsed(0);
          setRunning(false);
        }}
      >
        Reset
      </button>
    </div>
  );
};

export default Stopwatch;
