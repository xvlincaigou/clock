import React, { useState, useEffect } from 'react';

const Alarm = ({mode}) => {
  const [alarms, setAlarms] = useState(
    JSON.parse(localStorage.getItem('alarms')) || []
  );
  const [audioURL, setAudioURL] = useState(
    localStorage.getItem('audioURL') || ''
  );
  const [audioName, setAudioName] = useState(
    localStorage.getItem('audioName') || ''
  );
  const [audio, setAudio] = useState(null);
  const [newAlarm, setNewAlarm] = useState('');
  const [current, setCurrent] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const alarmWorkers = [];
    alarms.forEach((alarm, index) => {
      const worker = new Worker(new URL('./AlarmWorker.js', import.meta.url));
      worker.postMessage({ alarmTime: alarm, audioURL: audioURL });
      worker.onmessage = (e) => {
        if (e.data.type === 'ALARM_TRIGGERED') {
          stopAlarm();
          setCurrent(alarm);
          const newAudio = new Audio(e.data.audioURL? e.data.audioURL : 'default.mp3');
          newAudio.play();
          setAudio(newAudio);
          removeAlarm(index);
        }
      };
      alarmWorkers.push(worker);
    });

    return () => {
      alarmWorkers.forEach(worker => worker.terminate());
    };
  }, [alarms, audioURL]);

  const addAlarm = () => {
    if (newAlarm) {
      const updatedAlarms = [...alarms, newAlarm];
      setAlarms(updatedAlarms);
      localStorage.setItem('alarms', JSON.stringify(updatedAlarms));
      setNewAlarm('');
    }
  };

  const removeAlarm = (index) => {
    const updatedAlarms = alarms.filter((_, i) => i !== index);
    setAlarms(updatedAlarms);
    localStorage.setItem('alarms', JSON.stringify(updatedAlarms));
  };

  const stopAlarm = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setAudio(null);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioURL(url); setAudioName(file.name);
      localStorage.setItem('audioURL', audioURL);
      localStorage.setItem('audioName', audioName);
    }
  };

  if (mode === 'alarm') {
    return (
      <div>
        <input
          type="time"
          value={newAlarm}
          onChange={(e) => setNewAlarm(e.target.value)}
        />
        <button onClick={addAlarm}>
          Add Alarm
        </button>
        <input 
          type="file" 
          accept="audio/*" 
          onChange={handleFileChange} 
        />
        {audioURL && <p>Selected audio file: { audioName }</p>}
        <ul>
          {alarms.map((alarm, index) => (
            <li key={index}>
              {alarm}
              <button onClick={() => removeAlarm(index)}>Remove</button>
            </li>
          ))}
        </ul>
        {audio && (
          <div>
            <p>Alarm ringing for {current}</p>
            <button onClick={stopAlarm}>Stop Alarm</button>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default Alarm;
