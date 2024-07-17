import React, { useState, useEffect } from 'react';

const Clock = ({ mode }) => {
  const calculateAngles = (date, offset) => {
    const localDate = new Date(date.getTime() + offset);
    const seconds = localDate.getSeconds() + localDate.getMilliseconds() / 1000;
    const minutes = localDate.getMinutes() + seconds / 60;
    const hours = (localDate.getHours() % 12) + minutes / 60;
    return {
      second: seconds * 6,
      minute: minutes * 6,
      hour: hours * 30,
    };
  };

  const [angles, setAngles] = useState(calculateAngles(new Date(), 0));
  const [offset, setOffset] = useState(0);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustBeginTime, setAdjustBeginTime] = useState(null);

  useEffect(() => {
    if (!isAdjusting) {
      const interval = setInterval(() => {
        setAngles(calculateAngles(new Date(), offset));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isAdjusting, offset]);

  const getHandStyle = hand => {
    if (isAdjusting) {
      return {
        transform: `rotate(${angles[hand]}deg)`,
        transition: 'transform 0.005s linear',
      };
    }
    if (hand === 'second' && angles[hand] < 0.4)
      return {
        transform: `rotate(0deg)`,
        transition: 'transform 0.005s linear',
      };
    if (hand === 'minute' && angles[hand] < 0.007)
      return {
        transform: `rotate(0deg)`,
        transition: 'transform 0.005s linear',
      };
    if (hand === 'hour' && angles[hand] < 0.0006)
      return {
        transform: `rotate(0deg)`,
        transition: 'transform 0.005s linear',
      };
    return {
      transform: `rotate(${angles[hand]}deg)`,
      transition: 'transform 0.05s linear',
    };
  };

  const handleMouseDown = (hand, event) => {
    if (!isAdjusting) return;

    const clockFace = event.target.closest('.clock-face');
    const rect = clockFace.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const moveHandler = moveEvent => {
      const dx = moveEvent.clientX - centerX;
      const dy = moveEvent.clientY - centerY;
      const rawAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      const newAngle = rawAngle > 0 ? rawAngle : 360 + rawAngle;

      setAngles(prevAngles => {
        
        const absAngleDiff = Math.abs(newAngle - prevAngles[hand]);
        const absSmallerAngleDiff = absAngleDiff > 180 ? 360 - absAngleDiff : absAngleDiff;
        const angleDiff = prevAngles[hand] + absSmallerAngleDiff === newAngle || prevAngles[hand] + absSmallerAngleDiff === newAngle + 360 ? absSmallerAngleDiff : -absSmallerAngleDiff;
        
        let hourOffset = 0,
          minuteOffset = 0,
          secondOffset = 0;

        if (hand === 'hour') {
          hourOffset = angleDiff;
          minuteOffset = angleDiff * 12;
          secondOffset = angleDiff * 720;
        } else if (hand === 'minute') {
          minuteOffset = angleDiff;
          hourOffset = angleDiff * (1 / 12);
          secondOffset = angleDiff * 60;
        } else {
          secondOffset = angleDiff;
          minuteOffset = angleDiff * (1 / 60);
          hourOffset = angleDiff * (1 / 720);
        }
        /*
        if (hand === 'hour') {
          setOffset(prev => prev + (newAngle - angles[hand]) * 120000);
        } else if (hand === 'minute') {
          setOffset(prev => prev + (newAngle - angles[hand]) * 60000);
        } else {
          setOffset(prev => prev + (newAngle - angles[hand]) * 1000);
        }
        */
        return {
          hour: (prevAngles.hour + hourOffset + 360) % 360,
          minute: (prevAngles.minute + minuteOffset + 360) % 360,
          second: (prevAngles.second + secondOffset + 360) % 360,
        };
      });
    };

    const upHandler = () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
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
            onMouseDown={e => handleMouseDown('hour', e)}
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
            onMouseDown={e => handleMouseDown('minute', e)}
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
            onMouseDown={e => handleMouseDown('second', e)}
          />
        </svg>
        <div className="digital-time">{formatTime()}</div>
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (isAdjusting) {
            } else {
              setAdjustBeginTime(new Date());
            }
            setIsAdjusting(!isAdjusting);
          }}
        >
          {isAdjusting ? 'Save Time' : 'Adjust Time'}
        </button>
      </div>
    </div>
  );
};

export default Clock;
