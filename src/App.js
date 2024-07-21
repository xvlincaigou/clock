import React, { useState } from 'react';
import './App.css';
import Clock from './Clock';
import Stopwatch from './Stopwatch';
import Timer from './Timer';
import Alarm from './Alarm';

function App() {
  const [mode, setMode] = useState('clock');

  const handleClick = newMode => {
    const audio = new Audio('click-sound.mp3'); // 确保项目中有 click-sound.mp3 文件
    audio.play();
    setMode(newMode);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="mode-buttons">
          <button 
            className={'btn-tools'}
            onClick={() => handleClick('clock')}
          >
            <strong>Tools</strong>
          </button>
          <button
            className={`btn ${mode === 'clock' ? 'active' : ''}`}
            onClick={() => handleClick('clock')}
          >
            <strong>Clock</strong>
          </button>
          <button
            className={`btn ${mode === 'stopwatch' ? 'active' : ''}`}
            onClick={() => handleClick('stopwatch')}
          >
            <strong>Stopwatch</strong>
          </button>
          <button
            className={`btn ${mode === 'timer' ? 'active' : ''}`}
            onClick={() => handleClick('timer')}
          >
            <strong>Timer</strong>
          </button>
          <button
            className={`btn ${mode === 'alarm' ? 'active' : ''}`}
            onClick={() => handleClick('alarm')}
          >
            <strong>Alarm</strong>
          </button>
        </div>
        <div className="components-container">
          <Clock mode={mode} />
          <Stopwatch mode={mode} />
          <Timer mode={mode} />
          <Alarm mode={mode} />
        </div>
      </header>
    </div>
  );
}

export default App;
