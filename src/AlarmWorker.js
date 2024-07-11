/* eslint-disable no-restricted-globals */

/*** By Getsuyo-bi ***/

self.onmessage = (e) => {
    const { alarmTime, audioUrl } = e.data;
    setInterval(() => {
        const currentTime = new Date();
        const [hours, minutes] = alarmTime.split(':');
        const alarmDate = new Date();
        alarmDate.setHours(hours);
        alarmDate.setMinutes(minutes);
        alarmDate.setSeconds(0);

        if (currentTime >= alarmDate) {
            self.postMessage({ type: 'ALARM_TRIGGERED', audioUrl });
        }
    }, 1000);
};

/*** ***/
  
/* eslint-enable no-restricted-globals */