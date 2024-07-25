/* eslint-disable no-restricted-globals */

/*** By bbbpimasheep ***/

self.onmessage = (e) => {
    const { alarmTime, audioUrl } = e.data;
    setInterval(() => {
        const currentTime = new Date(); // get current time
        // const [hours, minutes] = alarmTime.split(':');
        const alarmDate = new Date(alarmTime);
        // set alarm date with hours and minutes
        // alarmDate.setHours(hours);
        // alarmDate.setMinutes(minutes);
        // alarmDate.setSeconds(0);
        if (currentTime >= alarmDate && currentTime < alarmDate.setSeconds(alarmDate.getSeconds() + 1)) {  // check if current time is greater than or equal to alarm time
            self.postMessage({ type: 'ALARM_TRIGGERED', audioUrl: audioUrl });    // send message to main thread with audioUrl
        }
    }, 1000);   // check every second
};

/*** ***/
  
/* eslint-enable no-restricted-globals */