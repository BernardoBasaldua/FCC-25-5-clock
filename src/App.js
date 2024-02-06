import './App.css';
import React, { useState, useEffect, useRef } from 'react';

let initialBreak = 5;
let initialSession = 25;
let initialTimeLeft = initialSession * 60;

function App() {
  const[varBreak, setBreak] = useState(initialBreak);
  const[varSession, setSession] = useState(initialSession);
  const [isRunning, setIsRunning] = useState(false);
  const[titleTimer, setTitleTimer] = useState('Session');
  const[timeLeft, setTimeLeft] = useState(initialTimeLeft);

  const audioRef = useRef(null);

  const playSound = () => {
    audioRef.current.play();
  };

  const incrementBreak = () => {
    if (varBreak < 60 && !isRunning) {
      setBreak(varBreak + 1);
      initialBreak = varBreak + 1;
    }
  }
  const decrementBreak = () => {
    if (varBreak > 1 && !isRunning) {
      setBreak(varBreak - 1);
      initialBreak = varBreak - 1;
    }
  }
  const incrementSession = () => {
    if (varSession < 60 && !isRunning) {
      setSession(varSession + 1);
      setTimeLeft((prevTimeLeft) => prevTimeLeft + 60);
      initialTimeLeft = timeLeft + 60;
    }
  }
  const decrementSession = () => {
    if (varSession > 1 && !isRunning) {
      setSession(varSession - 1);
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 60);
      initialTimeLeft = timeLeft - 60;
    }
  }

  const formatTime = (seconds) => {
    const minutos = Math.floor(seconds / 60);
    const segundos = seconds % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  };

  const startStopClock = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setBreak(5);
    setSession(25);
    setIsRunning(false)
    setTitleTimer('Session');
    setTimeLeft(25 * 60);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }

  useEffect(() => {
    let countdown;

    if (isRunning) {
      countdown = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime === 0) {
            playSound();
            clearInterval(countdown);
            if (titleTimer === 'Session') {
              setTitleTimer('Break');
              setTimeLeft(initialBreak * 60);
            } else {
              setTitleTimer('Session');
              setTimeLeft(initialTimeLeft);
            }

            return prevTime
          } else {
            return prevTime - 1;
          }
        })
      }, 1000);
    } else {
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [isRunning, titleTimer])

  return (
    <div className="App">
      <h1>25+5 Clock</h1>
      <div id='labels'>
        <div id='break-label'>
          <span>Break Length</span>
          <div className='label-buttons'>
            <button id='break-decrement' onClick={decrementBreak}>-</button>
            <span id='break-length'>{varBreak}</span>
            <button id='break-increment' onClick={incrementBreak}>+</button>
          </div>
        </div>
        <div id='session-label'>
          <span>Session Length</span>
          <div className='label-buttons'>
            <button id='session-decrement' onClick={decrementSession}>-</button>
            <span id='session-length'>{varSession}</span>
            <button id='session-increment' onClick={incrementSession}>+</button>
          </div>
        </div>
      </div>
      <div id='timer-label'>
        {titleTimer}
        <div className='timer-container'>
          <div id='timer-buttons'>
            <button id='start_stop' onClick={startStopClock}>{isRunning ? 'Stop' : 'Start'}</button>
            <button id='reset' onClick={reset}>Reset</button>
          </div>
          <div id='time-left'>{formatTime(timeLeft)}</div>
        </div>
      </div>
      <h2>Designed and Coded By <span>BERNARDO BASALDUA</span></h2>
      <audio id="beep" ref={audioRef} src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"></audio>
    </div>
  );
}

export default App;