import React, { useState } from 'react';
import './App.css';
import Clock from './Clock';
import Stopwatch from './Stopwatch';
import Timer from './Timer';
import Alarm from './Alarm';

function App() {
  const [mode, setMode] = useState('clock');

  const renderMode = () => {
    switch (mode) {
      case 'stopwatch':
        return <Stopwatch />;
      case 'timer':
        return <Timer />;
      case 'alarm':
        return <Alarm />;
      default:
        return <Clock />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Clock App</h1>
        <div className="mode-buttons">
          <button onClick={() => setMode('clock')}>Clock</button>
          <button onClick={() => setMode('stopwatch')}>Stopwatch</button>
          <button onClick={() => setMode('timer')}>Timer</button>
          <button onClick={() => setMode('alarm')}>Alarm</button>
        </div>
        {renderMode()}
      </header>
    </div>
  );
}

export default App;
