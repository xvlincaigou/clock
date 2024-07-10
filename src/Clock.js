import React, { useState, useEffect, useRef } from 'react';

const Clock = ({ mode }) => {
  const [time, setTime] = useState(new Date());
  const prevAngles = useRef({ second: 0, minute: 0, hour: 0 });

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getHandAngle = hand => {
    switch (hand) {
      case 'second':
        return time.getSeconds() * 6;
      case 'minute':
        return time.getMinutes() * 6 + time.getSeconds() * 0.1;
      case 'hour':
        return (time.getHours() % 12) * 30 + (time.getMinutes() / 60) * 30;
      default:
        return 0;
    }
  };

  const getHandStyle = hand => {
    const angle = getHandAngle(hand);
    const prevAngle = prevAngles.current[hand];

    // Ensure rotation is always clockwise
    const adjustedAngle = angle < prevAngle ? angle + 360 : angle;
    prevAngles.current[hand] = adjustedAngle;

    return {
      transform: `rotate(${adjustedAngle}deg)`,
      transition: 'transform 0.5s ease-in-out',
    };
  };

  const renderClockFace = () => (
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
    </div>
  );

  if (mode !== 'clock') return null;
  return <div>{renderClockFace()}</div>;
};

export default Clock;
