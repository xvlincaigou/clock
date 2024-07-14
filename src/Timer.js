import React, { useState, useEffect } from 'react';
import './Timer.css';

const Timer = ({ mode }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setRemainingTime(time => {
          if (time <= 1) {
            clearInterval(interval);
            setRunning(false);
            if (time === 1) { 
              alert("倒计时结束！");
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
  };

  const padNumber = num => num.toString().padStart(2, '0');

  const handleHourChange = (e) => {
    const newHours = Math.max(0, Math.min(23, Number(e.target.value)));
    setHours(newHours);
  };

  const handleMinuteChange = (e) => {
    const newMinutes = Math.max(0, Math.min(59, Number(e.target.value)));
    setMinutes(newMinutes);
  };

  const handleSecondChange = (e) => {
    const newSeconds = Math.max(0, Math.min(59, Number(e.target.value)));
    setSeconds(newSeconds);
  };

  const toggleRunning = () => {
    if (!running && remainingTime === 0) {
      setRemainingTime(hours * 3600 + minutes * 60 + seconds);
    } else if (running && remainingTime === 0) {
      alert("倒计时结束！"); // Alert when the timer is paused and the remaining time is 0
    }
    setRunning(!running);
  };

  const resetTimer = () => {
    setRunning(false);
    setRemainingTime(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  if (mode !== 'timer') {
    return null;
  }

  return (    
    <div className='timer-container'>
      <div className="timer-inputAndButtons-container">
        <input type="number" className="timer-input" placeholder="Hours" value={padNumber(hours)} onChange={handleHourChange} />
        <input type="number" className="timer-input" placeholder="Minutes" value={padNumber(minutes)} onChange={handleMinuteChange} />
        <input type="number" className="timer-input" placeholder="Seconds" value={padNumber(seconds)} onChange={handleSecondChange} />
        <button onClick={toggleRunning} className="control-button">{running ? 'Pause' : 'Start'}</button>
        <button onClick={resetTimer} className="control-button">Reset</button>
      </div>
      <div className="remaining-time">
        Remaining Time:<br />{formatTime(remainingTime)}
      </div>
      <div className="shalou"> {/* Sandglass animation */}
          <div className="up"></div>
          <div className="down"></div>
      </div>
      
    </div>
    
  );
};

export default Timer;
