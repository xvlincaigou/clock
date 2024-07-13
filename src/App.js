import React, { useState } from 'react';
import './App.css';
import Clock from './Clock';
import Stopwatch from './Stopwatch';
import Timer from './Timer';
import Alarm from './Alarm';

function App() {
  const [mode, setMode] = useState('clock');

  return (
    <div className="App">
      <header className="App-header">
        <h1 className='title'>寸阴寸金</h1>
        <div className="mode-buttons">
          <button className="btn btn-info" onClick={() => setMode('clock')}><strong>Clock</strong></button>
          <button className="btn btn-info" onClick={() => setMode('stopwatch')}><strong>Stopwatch</strong></button>
          <button className="btn btn-info" onClick={() => setMode('timer')}><strong>Timer</strong></button>
          <button className="btn btn-info" onClick={() => setMode('alarm')}><strong>Alarm</strong></button>
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
