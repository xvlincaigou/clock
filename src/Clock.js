import React, { useState, useEffect } from 'react';

const Clock = ({ mode }) => {
  const calculateAngles = date => {
    const seconds = date.getSeconds() + date.getMilliseconds() / 1000;
    const minutes = date.getMinutes() + seconds / 60;
    const hours = (date.getHours() % 12) + minutes / 60;
    return {
      second: seconds * 6,
      minute: minutes * 6,
      hour: hours * 30,
    };
  };

  const [angles, setAngles] = useState(calculateAngles(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setAngles(calculateAngles(new Date()));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getHandStyle = hand => {
    if (hand === 'second') {
      console.log(angles[hand]);
    }
    if (hand === 'second' && angles[hand] < 0.3) return {
      transform: `rotate(0deg)`,
      transition: 'transform 0.005s linear',
    };
    return {
      transform: `rotate(${angles[hand]}deg)`,
      transition:
        hand === 'second' ? 'transform 1s linear' : 'transform 0.01s linear',
    };
  };

  const formatTime = () => {
    const time = new Date();
    return `${time.getHours().toString().padStart(2, '0')}:${time
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
  };

  if (mode !== 'clock') return null;

  return (
    <div>
      <div className="clock-container">
        <svg className="clock-face" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="black"
            strokeWidth="2"
            fill="white"
          />
          {[...Array(60)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1={i % 5 === 0 ? '2' : '5'}
              x2="50"
              y2={i % 5 === 0 ? '10' : '8'}
              transform={`rotate(${i * 6} 50 50)`}
              stroke="black"
            />
          ))}
          {[...Array(12)].map((_, i) => {
            const angle = (i + 1) * 30;
            const radian = (angle - 90) * (Math.PI / 180);
            const radius = 35;
            const x = 50 + radius * Math.cos(radian);
            const y = 50 + radius * Math.sin(radian);
            return (
              <text key={i} x={x} y={y} textAnchor="middle" fontSize="4">
                {i + 1}
              </text>
            );
          })}
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="20"
            stroke="black"
            strokeWidth="3"
            className="hour-hand"
            style={getHandStyle('hour')}
          />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="10"
            stroke="black"
            strokeWidth="2"
            className="minute-hand"
            style={getHandStyle('minute')}
          />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="5"
            stroke="red"
            strokeWidth="1"
            className="second-hand"
            style={getHandStyle('second')}
          />
        </svg>
        <div className="digital-time">{formatTime()}</div>
      </div>
    </div>
  );
};

export default Clock;
