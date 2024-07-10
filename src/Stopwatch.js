import React, { useState, useEffect } from 'react';

const Stopwatch = ({ mode }) => {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState([]);
  const [lastLap, setLastLap] = useState(0);

  useEffect(() => {
    // 读取本地存储中的开始时间和已用时间
    const savedStartTime = localStorage.getItem('startTime');
    const savedElapsed = parseInt(localStorage.getItem('elapsed'), 10);
    if (savedStartTime && !isNaN(savedElapsed)) {
      const now = Date.now();
      const adjustedElapsed = now - parseInt(savedStartTime, 10) + savedElapsed;
      setElapsed(adjustedElapsed);
      if (localStorage.getItem('running') === 'true') {
        setRunning(true);
      }
    }
  }, []);

  useEffect(() => {
    let interval;
    if (running) {
      const start = Date.now() - elapsed;
      interval = setInterval(() => {
        setElapsed(Date.now() - start);
      }, 10); // 更新间隔为10毫秒，以便显示两位毫秒
      localStorage.setItem('startTime', start.toString());
      localStorage.setItem('running', 'true');
    } else {
      localStorage.setItem('elapsed', elapsed.toString());
      localStorage.setItem('running', 'false');
      clearInterval(interval);
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
    setLaps([...laps, { lapTime, totalTime: elapsed }]);
    setLastLap(elapsed);
  };

  const handleReset = () => {
    setElapsed(0);
    setRunning(false);
    setLaps([]);
    setLastLap(0);
    localStorage.removeItem('startTime');
    localStorage.removeItem('elapsed');
    localStorage.removeItem('running');
  };

  if (mode !== 'stopwatch') {
    return null;
  }

  return (
    <div>
      <div>{formatTime(elapsed)}</div>
      <button onClick={() => setRunning(!running)}>
        {running ? 'Stop' : 'Start'}
      </button>
      <button onClick={handleReset}>
        Reset
      </button>
      <button onClick={handleLap}>Lap</button>
      <ul>
        {laps.map((lap, index) => (
          <li key={index}>
            Lap {index + 1}: {formatTime(lap.lapTime)} &emsp;Total: {formatTime(lap.totalTime)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stopwatch;
