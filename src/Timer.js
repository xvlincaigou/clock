import React, { useState, useEffect } from 'react';
import './Timer.css'; // 引入样式文件

// Timer组件定义，接受mode作为参数
const Timer = ({ mode }) => {
  // 定义状态：小时、分钟、秒、是否运行中、剩余时间
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // 使用useEffect处理倒计时逻辑
  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setRemainingTime(time => {
          if (time <= 1) {
            clearInterval(interval);
            setRunning(false);
            if (time === 1) {
              alert("倒计时结束！"); // 倒计时结束时弹窗提示
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval); // 组件卸载时清除计时器
  }, [running]);

  // 格式化时间显示
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
  };

  // 数字前补零
  const padNumber = num => num.toString().padStart(2, '0');

  // 处理小时、分钟、秒的变化
  const handleHourChange = (e) => {
    const newHours = Math.max(0, Math.min(23, Number(e.target.value)));
    setHours(newHours);
  };

  const handleMinuteChange = (e) => {
    const newMinutes = Math.max(0, Math.min(59, Number(e.target.value)));
    setMinutes(newMinutes);
  };

  const handleSecondChange = (e) => {
    const newSeconds = Math.max(0, Math.min(59, Number(e.target.value)));
    setSeconds(newSeconds);
  };

  // 开始/暂停切换
  const toggleRunning = () => {
    if (!running && remainingTime === 0) {
      setRemainingTime(hours * 3600 + minutes * 60 + seconds);
    } else if (running && remainingTime === 0) {
      alert("倒计时结束！"); // 当计时器暂停且剩余时间为0时提示
    }
    setRunning(!running);
  };

  // 重置计时器
  const resetTimer = () => {
    setRunning(false);
    setRemainingTime(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  // 如果模式不是timer，则不渲染组件
  if (mode !== 'timer') {
    return null;
  }

  // 渲染计时器组件界面
  return (
    <div className='timer-container'>
      <div className="timer-inputAndButtons-container">
        <input type="number" className="timer-input" placeholder="Hours" value={padNumber(hours)} onChange={handleHourChange} />
        <input type="number" className="timer-input" placeholder="Minutes" value={padNumber(minutes)} onChange={handleMinuteChange} />
        <input type="number" className="timer-input" placeholder="Seconds" value={padNumber(seconds)} onChange={handleSecondChange} />
        <button onClick={toggleRunning} className="control-button">{running ? 'Pause' : 'Start'}</button>
        <button onClick={resetTimer} className="control-button">Reset</button>
      </div>
      <div className="remaining-time">
        Remaining Time:<br />{formatTime(remainingTime)}
      </div>
      {/* 沙漏动画，运行时和暂停时的样式不同 */}
      <div className="shalou-container">
        {running ? (
          <div className="movingshalou"> 
              <div className="movingup"></div>
              <div className="movingdown"></div>
          </div>
        ) : (
          <div className="shalou">
            <div className="up"></div>
            <div className="down"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer; // 导出Timer组件
