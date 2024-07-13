import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.css'
import './App.css';
import './Alarm.css';

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
      <>
        <div>
          <div className="container mt-4">
            <h3 className="upload-title">Upload Audio File</h3>
            <div className="input-group mb-3">
              <input type="file" accept="audio/*" className="form-control" id="inputGroupFile02" onChange={handleFileChange} />
              <label className="input-group-text" for="inputGroupFile02">Upload</label>
            </div>
            <div class="input-group mt-4">
              <button type="button" className="btn btn-warning" onClick={addAlarm}>Add Alarm</button>            
              <input
                type="time" value={newAlarm} className="form-control timePicker"
                onChange={(e) => setNewAlarm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="alarms-list-container">
            <ul className="list-group list-group-numbered">
              {alarms.map((alarm, index) => (
                <li className="list-group-item list-group-item-info d-flex justify-content-between align-items-start" key={index}>
                  <div class="ms-4 me-auto">
                    <div class="fw-bold">{alarm}</div>
                  </div>
                  <button type="button" className="btn btn-danger" onClick={() => removeAlarm(index)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
          {audio && (
            <div>
              <p>Alarm ringing for {current}</p>
              <button type="button" className="btn btn-secondary" onClick={stopAlarm}>Stop Alarm</button>
            </div>
          )}
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default Alarm;
