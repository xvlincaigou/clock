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
    const newLap = { lapTime, totalTime: elapsed, index: laps.length + 1 };
    setLaps([newLap, ...laps]); // 新记录添加到顶部
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

  const minLapTime = laps.length ? Math.min(...laps.map(lap => lap.lapTime)) : null;
  const maxLapTime = laps.length ? Math.max(...laps.map(lap => lap.lapTime)) : null;

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
      <div style={{ width: '300px', maxHeight: '200px', minHeight: '200px', overflowY: 'scroll', border: '1px solid #ccc', marginTop: '10px', backgroundColor: 'white' }}>
        <ul style={{ padding: '0', margin: '0', listStyleType: 'none' }}>
          {laps.map((lap) => (
            <li key={lap.index} style={{ padding: '5px 0', borderBottom: '1px solid #ddd' }}>
              <div style={{ color: lap.lapTime === minLapTime ? 'green' : lap.lapTime === maxLapTime ? 'red' : 'black' }}>
                Lap {lap.index}: {formatTime(lap.lapTime)}
              </div>
              <div style={{ color: 'black' }}>Total: {formatTime(lap.totalTime)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Stopwatch;


