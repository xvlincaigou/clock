/*** By bbbpimasheep ***/

import React, { useState, useEffect, useRef } from 'react';

import 'bootstrap/dist/css/bootstrap.css'
import './App.css';
import './Alarm.css';

const Alarm = ({mode}) => {
  const [alarms, setAlarms] = useState(
    JSON.parse(localStorage.getItem('alarms')) || []
  );
  const [audioURL, setAudioURL] = useState(
    localStorage.getItem('audioURL') || 'default.mp3'
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
      const alarmDate = new Date(alarm);
      const worker = new Worker(new URL('./AlarmWorker.js', import.meta.url));
      worker.postMessage({ alarmTime: alarm, audioUrl: audioURL });
      worker.onmessage = (e) => { // Use a worker to handle the alarm logic
        if (e.data.type === 'ALARM_TRIGGERED') {
          stopAlarm();  // Stop the current audio
          setCurrent(alarm);
          const newAudio = new Audio(e.data.audioUrl ? e.data.audioUrl : 'default.mp3');
          newAudio.play();
          setAudio(newAudio);
          alarms.splice(index, 1);  // Remove the triggered alarm from the list
          // Set the alarm to the next day if it's already passed
          const updatedAlarm = new Date(alarm);
          updatedAlarm.setDate(updatedAlarm.getDate() + 1);
          alarms.push(updatedAlarm.toISOString());
          setAlarms(alarms);
        }
      };
      alarmWorkers.push(worker);
    });
    return () => {
      alarmWorkers.forEach(worker => worker.terminate());
    };
  }, [alarms, audio, audioURL]);

  /*
          const newWorker = new Worker(new URL('./AlarmWorker.js', import.meta.url));
          newWorker.postMessage({ alarmTime: newAlarm, audioURL: audioURL });
          newWorker.onmessage = (e) => {
            if (e.data.type === 'ALARM_TRIGGERED') {
              if (audio) audio.pause(); // Stop the current audio
              setCurrent(newAlarm);
              const anotherAudio = new Audio(e.data.audioURL ? e.data.audioURL : 'default.mp3');
              anotherAudio.play();
              setAudio(anotherAudio);
            }
          };
          alarmWorkers.push(newWorker);    
          */     

  const addAlarm = () => {
    if (newAlarm) {
      const at_this_moment = new Date(new Date().setHours(new Date().getHours() + 8));
      const today = at_this_moment.toISOString().split('T')[0];
      var newAlarmTime = new Date(today + "T" + newAlarm);
      if (newAlarmTime < new Date()) newAlarmTime.setDate(new Date(newAlarmTime).getDate() + 1);
      const updatedAlarms = [...alarms, newAlarmTime.toISOString()];  // Add the new alarm to the list
      setAlarms(updatedAlarms);
      setNewAlarm('');
    }
  };

  const addAudio = () => {
    fileInputRef.current.click(); // Open the file input dialog
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

  // Handle the audio file input change event
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioURL(url); setAudioName(file.name);
      localStorage.setItem('audioURL', audioURL);    // Save the audio URL to local storage
      localStorage.setItem('audioName', audioName);  // Save the audio name to local storage
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
                      {new Date(alarm).toLocaleTimeString()}
                    </div>
                    <div className="col-4 text-right">
                      {audio && new Date(current).toLocaleTimeString() === new Date(alarm).toLocaleTimeString() && (
                        <button type="button" className="btn btn-warning" onClick={() => stopAlarm()}>
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