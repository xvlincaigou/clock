import React, { useState } from 'react';

const Alarm = ({ setAlarms, setAudioURL, mode }) => {
  const [alarms, setLocalAlarms] = useState(
    JSON.parse(localStorage.getItem('alarms')) || []
  );
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [audioName, setAudioName] = useState(
    localStorage.getItem('audioFileName') || ''
  );

  const addAlarm = () => {
    if (newAlarmTime) {
      const updatedAlarms = [...alarms, newAlarmTime];
      setLocalAlarms(updatedAlarms);
      localStorage.setItem('alarms', JSON.stringify(updatedAlarms));
      setNewAlarmTime('');
    }
  };

  const removeAlarm = index => {
    const updatedAlarms = alarms.filter((_, i) => i !== index);
    setLocalAlarms(updatedAlarms);
    localStorage.setItem('alarms', JSON.stringify(updatedAlarms));
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      localStorage.setItem('audioFileURL', url);
      localStorage.setItem('audioFileName', file.name);
      setAudioName(file.name);
      setAudioURL(url);
    }
  };

  if (mode !== 'alarm') {
    return null;
  }

  return (
    <div>
      <input
        type="time"
        value={newAlarmTime}
        onChange={e => setNewAlarmTime(e.target.value)}
      />
      <button onClick={addAlarm}>Add Alarm</button>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {audioName && <p>Selected audio file: {audioName}</p>}
      <ul>
        {alarms.map((alarm, index) => (
          <li key={index}>
            {alarm}
            <button onClick={() => removeAlarm(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alarm;
