/*
import React, { useState, useEffect, useRef } from 'react';

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

  const minLapTime = laps.length ? Math.min(...laps.map(lap => lap.lapTime)) : null;
  const maxLapTime = laps.length ? Math.max(...laps.map(lap => lap.lapTime)) : null;

  if (mode !== 'stopwatch') {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'absolute', top: '38vh', left: '5vw' }}>
      <div style={{ backgroundColor: '#CAE9FF', borderRadius: '40px', padding: '5px', color: '#1B4965', fontSize: '1.5em', fontWeight: 700, marginBottom: '20px', width: '500px', textAlign: 'center' }}>
        {formatTime(elapsed)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', position: 'absolute', width: '500px' }}>
        <div style={{ backgroundColor: '#CAE9FF', borderRadius: '30px', padding: '10px', width: '385px', height: '300px', border: '1px solid #5FA8D3', marginRight: '20px', position: 'relative', top: '12vh', left: '0vw' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px dashed #5FA8D3', paddingBottom: '5px', marginBottom: '10px', color: '#1B4965', fontSize: '0.8em', position: 'sticky', top: '0', backgroundColor: '#CAE9FF', zIndex: 1 }}>
            <div style={{ width: '25%' }}>&nbsp;</div>
            <div style={{ width: '37.5%', textAlign: 'center' }}>lap time</div>
            <div style={{ width: '37.5%', textAlign: 'center' }}>total time</div>
          </div>
          <ul style={{ padding: '0', margin: '0', listStyleType: 'none', overflowY: 'scroll', height: '230px' }}>
            {laps.map((lap) => (
              <li key={lap.index} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: '#1B4965', fontSize: '0.8em' }}>
                <div style={{
                  width: '25%',
                  backgroundColor: lap.lapTime === minLapTime ? 'green' : lap.lapTime === maxLapTime ? 'red' : 'transparent',
                  borderRadius: '10px',
                  padding: '2px 5px',
                  textAlign: 'center'
                }}>
                  {`lap ${lap.index}`}
                </div>
                <div style={{ width: '37.5%', textAlign: 'center', fontWeight: 500 }}>{formatTime(lap.lapTime)}</div>
                <div style={{ width: '37.5%', textAlign: 'center', fontWeight: 500 }}>{formatTime(lap.totalTime)}</div>
              </li>
            ))}
            <div ref={lapsEndRef} />
          </ul>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'absolute', height: '290px', top: '12.5vh', right: '0vw' }}>
          <button style={{ backgroundColor: '#CAE9FF', color: '#1B4965', width: '70px', height: '70px', border: 'none', borderRadius: '50%', marginBottom: '10px', fontSize: '0.7em', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setRunning(!running)}>
            {running ? 'stop' : 'start'}
          </button>
          <button style={{ backgroundColor: '#CAE9FF', color: '#1B4965', width: '70px', height: '70px', border: 'none', borderRadius: '50%', marginBottom: '10px', fontSize: '0.7em', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={handleLap}>
            lap
          </button>
          <button style={{ backgroundColor: '#CAE9FF', color: '#1B4965', width: '70px', height: '70px', border: 'none', borderRadius: '50%', fontSize: '0.7em', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={handleReset}>
            reset
          </button>
        </div>
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
*/
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

  const minLapTime = laps.length ? Math.min(...laps.map(lap => lap.lapTime)) : null;
  const maxLapTime = laps.length ? Math.max(...laps.map(lap => lap.lapTime)) : null;

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
