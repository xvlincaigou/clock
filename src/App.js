import React, { useState } from 'react';
import './App.css';
import Clock from './Clock';
import Stopwatch from './Stopwatch';
import Timer from './Timer';
import Alarm from './Alarm';
import AlarmManager from './AlarmManager';

function App() {
  const [mode, setMode] = useState('clock');
  const [alarms, setAlarms] = useState(
    JSON.parse(localStorage.getItem('alarms')) || []
  );
  const [audioURL, setAudioURL] = useState(
    localStorage.getItem('audioFileURL') || ''
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>寸阴寸金</h1>
        <div className="mode-buttons">
          <button onClick={() => setMode('clock')}>Clock</button>
          <button onClick={() => setMode('stopwatch')}>Stopwatch</button>
          <button onClick={() => setMode('timer')}>Timer</button>
          <button onClick={() => setMode('alarm')}>Alarm</button>
        </div>
        <div className="components-container">
          <Clock mode={mode} />
          <Stopwatch mode={mode} />
          <Timer mode={mode} />
          <Alarm mode={mode} setAlarms={setAlarms} setAudioURL={setAudioURL} />
        </div>
        <AlarmManager alarms={alarms} audioURL={audioURL} />
      </header>
    </div>
  );
}

export default App;
