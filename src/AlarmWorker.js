/* eslint-disable no-restricted-globals */

/*** By Getsuyo-bi ***/

self.onmessage = (e) => {
    const { alarms, audioURL } = e.data;
    setInterval(() => {
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
        if (alarms && alarms.length > 0) {
            alarms.forEach(alarm => {
                if (currentTime >= alarm) {
                    localStorage.setItem('currentAlarm', alarm);
                    self.postMessage({ type: 'ALARM_TRIGGERED', audioURL });
                }
            });
        }
    }, 1000);
};

/*** ***/
  
/* eslint-enable no-restricted-globals */