import React, { useState, useEffect } from 'react';

const Stopwatch = () => {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState([]);
  const [lastLap, setLastLap] = useState(0);

  useEffect(() => {
    let interval;
    if (running) {
      const start = Date.now() - elapsed;
      interval = setInterval(() => {
        setElapsed(Date.now() - start);
      }, 10); // 更新间隔为10毫秒，以便显示两位毫秒
    }
    return () => clearInterval(interval);
  }, [running, elapsed]);

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0');
    const milliseconds = String(Math.floor((time % 1000) / 10)).padStart(2, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  const handleLap = () => {
    const lapTime = elapsed - lastLap;
    setLaps([...laps, lapTime]);
    setLastLap(elapsed);
  };

  return (
    <div>
      <div>{formatTime(elapsed)}</div>
      <button onClick={() => setRunning(!running)}>
        {running ? 'Stop' : 'Start'}
      </button>
      <button
        onClick={() => {
          setElapsed(0);
          setRunning(false);
          setLaps([]);
          setLastLap(0);
        }}
      >
        Reset
      </button>
      <button onClick={handleLap}>
        Lap
      </button>
      <ul>
        {laps.map((lap, index) => (
          <li key={index}>
            Lap {index + 1}: {formatTime(lap)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stopwatch;
