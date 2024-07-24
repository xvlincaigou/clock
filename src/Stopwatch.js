import React, { useState, useEffect, useRef } from 'react';
import './Stopwatch.css';

const Stopwatch = ({ mode }) => {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState([]);
  const [lastLap, setLastLap] = useState(0);
  const lapsEndRef = useRef(null);

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
    return `${minutes} : ${seconds} . ${milliseconds}`;
  };

  const handleLap = () => {
    if (elapsed === 0) {
      return;
    }
    // 不允许在计时未开始（00:00.00）时分段
    if (elapsed === lastLap) {
      return;
    }
    // 不允许在同一时刻分段两次
    const lapTime = elapsed - lastLap;
    const newLap = { lapTime, totalTime: elapsed, index: laps.length + 1 };
    setLaps([...laps, newLap]); // 新记录添加到底部
    setLastLap(elapsed);
    // 滚动到最新的 lap
    setTimeout(() => {
      if (lapsEndRef.current) {
        lapsEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
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

  const minLapTime = laps.length ? Math.min(...laps.map(lap => lap.lapTime)) : null; // 找最小lap
  const maxLapTime = laps.length ? Math.max(...laps.map(lap => lap.lapTime)) : null; // 找最大lap

  if (mode !== 'stopwatch') {
    return null;
  }

  return (
    <div className="stopwatch-container">
      <div className="time-display">
        {formatTime(elapsed)}
      </div>
      <div className="laps-container">
        <div className="laps-list">
          <div className="laps-header">
            <div className="lap-header"></div>
            <div className="lap-header-text">lap time</div>
            <div className="lap-header-text">total time</div>
          </div>
          <ul className="laps">
            {laps.map((lap) => (
              <li key={lap.index} className="lap-item">
                <div className={`lap-index ${lap.lapTime === minLapTime ? 'min-lap' : lap.lapTime === maxLapTime ? 'max-lap' : ''}`}>
                  {`lap ${lap.index}`}
                </div>
                <div className="lap-time">{formatTime(lap.lapTime)}</div>
                <div className="lap-time">{formatTime(lap.totalTime)}</div>
              </li>
            ))}
            <div ref={lapsEndRef} />
          </ul>
        </div>
        <div className="buttons-container">
          <button className="button" onClick={() => setRunning(!running)}>
            {running ? 'stop' : 'start'}
          </button>
          <button className="button" onClick={handleLap}>
            lap
          </button>
          <button className="button" onClick={handleReset}>
            reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;
