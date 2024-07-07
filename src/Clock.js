import React, { useState, useEffect, useRef } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const clockRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePointerMove = (e, hand) => {
    const rect = clockRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    const newTime = new Date(time);

    if (hand === "hour") {
      newTime.setHours((angle / 30) % 12);
    } else if (hand === "minute") {
      newTime.setMinutes((angle / 6) % 60);
    } else if (hand === "second") {
      newTime.setSeconds((angle / 6) % 60);
    }

    setTime(newTime);
  };

  const getHandStyle = (hand) => {
    const degrees = {
      hour: (time.getHours() % 12) * 30 + (time.getMinutes() / 60) * 30,
      minute: time.getMinutes() * 6,
      second: time.getSeconds() * 6,
    };

    return {
      transform: `rotate(${degrees[hand]}deg)`,
    };
  };

  return (
    <div className="clock-container" ref={clockRef}>
      <svg
        className="clock-face"
        viewBox="0 0 100 100"
        onMouseMove={(e) => handlePointerMove(e, "second")}
      >
        <circle cx="50" cy="50" r="48" stroke="black" strokeWidth="2" fill="white" />
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="5"
            x2="50"
            y2="10"
            transform={`rotate(${i * 30} 50 50)`}
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
          style={getHandStyle("hour")}
          onMouseMove={(e) => handlePointerMove(e, "hour")}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="10"
          stroke="black"
          strokeWidth="2"
          className="minute-hand"
          style={getHandStyle("minute")}
          onMouseMove={(e) => handlePointerMove(e, "minute")}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="5"
          stroke="red"
          strokeWidth="1"
          className="second-hand"
          style={getHandStyle("second")}
          onMouseMove={(e) => handlePointerMove(e, "second")}
        />
      </svg>
    </div>
  );
};

export default Clock;