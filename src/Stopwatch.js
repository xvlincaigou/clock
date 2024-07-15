import React, { useState, useEffect } from 'react';

const Stopwatch = ({ mode }) => {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState([]);
  const [lastLap, setLastLap] = useState(0);

  useEffect(() => {
    // 清除本地存储，确保每次刷新页面时重置计时器
    localStorage.removeItem('startTime');
    localStorage.removeItem('elapsed');
    localStorage.removeItem('running');
    setRunning(false);
    setElapsed(0);
    setLaps([]);
    setLastLap(0);
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
      <div style={{ backgroundColor: '#CAE9FF', borderRadius: '10px', padding: '10px', border: '2px solid #5FA8D3', fontSize: '1.2em', textAlign: 'center', color: 'black', marginBottom: '20px' }}>
        {formatTime(elapsed)}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <button style={{ backgroundColor: '#62B6CB', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', marginRight: '10px', fontSize: '0.8em' }} onClick={() => setRunning(!running)}>
          {running ? 'Stop' : 'Start'}
        </button>
        <button style={{ backgroundColor: '#62B6CB', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', marginRight: '10px', fontSize: '0.8em' }} onClick={handleReset}>
          Reset
        </button>
        <button style={{ backgroundColor: '#62B6CB', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', fontSize: '0.8em' }} onClick={handleLap}>
          Lap
        </button>
      </div>
      <div style={{ backgroundColor: '#CAE9FF', borderRadius: '10px', width: '300px', maxHeight: '200px', minHeight: '200px', overflowY: 'scroll', border: '1px solid #5FA8D3', padding: '5px' }}>
        <ul style={{ padding: '0', margin: '0', listStyleType: 'none', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {laps.map((lap) => (
            <li key={lap.index} style={{ padding: '5px 0', borderBottom: '1px solid #003366', color: 'black', position: 'relative' }}>
              <div style={{
                display: 'inline-block',
                borderRadius: '5px',
                padding: '2px 5px',
                backgroundColor: lap.lapTime === minLapTime ? 'green' : lap.lapTime === maxLapTime ? 'red' : 'transparent',
                color: lap.lapTime === minLapTime || lap.lapTime === maxLapTime ? 'white' : 'black'
              }}>
                Lap {lap.index}: {formatTime(lap.lapTime)}
              </div>
              <div style={{ color: 'black', position: 'relative', top: '5px' }}>Total: {formatTime(lap.totalTime)}</div>
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Stopwatch;
