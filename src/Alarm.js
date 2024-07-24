/*** By Getsuyōbi ***/

import React, { useState, useEffect, useRef } from 'react';

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
  const fileInputRef = useRef(null);

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

  const addAudio = () => {
    fileInputRef.current.click();
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
          <div className="container">
            <div class="input-group">
              <button type="button" className="btn btn-primary" onClick={addAlarm}>
                <strong>Add Alarm</strong>
              </button>  
              <div class="custom-file">
                <input
                  type="time" value={newAlarm} className="custom-file-input"
                  onChange={(e) => setNewAlarm(e.target.value)}
                />
              </div>          
            </div>
            <div className="input-group">
              <button type="button" className="btn btn-primary" onClick={addAudio} id="upload-audio-btn">
                <strong>Upload Audio</strong>
              </button>
              <div className="custom-file" id="upload-audio">
                <strong>{audioName}</strong>
                <input 
                  type="file" accept="audio/*" className="custom-file-input" id="upload-audio-input"
                  ref={fileInputRef} onChange={handleFileChange} 
                />
              </div>
            </div>
            <div className="alarm-list-container">
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-center align-items-center" id="heading">
                  <strong>Alarm List</strong>
                </li>
                {alarms.map((alarm, index) => (
                  <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                    <div className="col-1 text-left">
                      {index + 1}
                    </div>
                    <div className="col-4 text-center">
                      {alarm}
                    </div>
                    <div className="col-4 text-right">
                      {audio && (
                        <button type="button" className="btn btn-warning" onClick={stopAlarm}>
                          <strong>Stop Alarm</strong>
                        </button>
                      )}       
                    </div>
                    <div className="col-3 text-right">
                      <button type="button" className="btn btn-secondary" onClick={() => removeAlarm(index)}>Remove</button>
                    </div>
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
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default Alarm;

/*** ***/