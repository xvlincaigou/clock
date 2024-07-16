import React, { useState, useEffect } from 'react';

/*** By Getsuyo-bi ***/

const AlarmManager = ({ alarms, audioURL }) => {
    const [audio, setAudio] = useState(null);
    const [currentAlarm, setCurrentAlarm] = useState(localStorage.getItem('currentAlarm') || null);

    useEffect(() => {
        const worker = new Worker(new URL('./AlarmWorker.js', import.meta.url));
        worker.postMessage({ alarmTime: alarms, audioURL });
        worker.onmessage = (e) => {
            if (e.data.type === 'ALARM_TRIGGERED') {
                stopAlarm();
                const newAudio = new Audio(e.data.audioURL);
                newAudio.play();
                setAudio(newAudio);
            }
        };
        return () => worker.terminate();
    }, [alarms, audioURL]);

    const stopAlarm = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            setAudio(null);
            setCurrentAlarm(null);
        }
    };

    return null;
};

/*** ***/

export default AlarmManager;
