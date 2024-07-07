import React, { useState } from "react";

const Alarm = () => {
  const [alarmTime, setAlarmTime] = useState(null);

  return (
    <div>
      <input type="time" onChange={(e) => setAlarmTime(e.target.value)} />
      <button onClick={() => alert("Alarm set for " + alarmTime)}>
        Set Alarm
      </button>
    </div>
  );
};

export default Alarm;
