import React, { useState, useEffect, useCallback } from 'react';

const Cronometro = () => {
  const [titleTimer, setTitleTimer] = useState('Session');
  const [timeLeft, setTimeLeft] = useState(1 * 60); // 25 minutos en segundos
  const [intervalId, setIntervalId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const startStopCronometro = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  const resetCronometro = () => {
    setIsRunning(false);
    clearInterval(intervalId);
    setTitleTimer('Session');
    setTimeLeft(25 * 60);
  };

  const cambiarTipoTimer = useCallback(() => {
    if (titleTimer === 'Session') {
      setTitleTimer('Break');
      setTimeLeft(2 * 60); // 5 minutos de descanso en segundos
    } else {
      setTitleTimer('Session');
      setTimeLeft(1 * 60); // 25 minutos de trabajo en segundos
    }
  }, [titleTimer]);

  const runCronometro = useCallback(() => {
    const id = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft > 0) {
          return prevTimeLeft - 10;
        } else {
          clearInterval(id); // Detener el intervalo cuando el tiempo llega a cero
          cambiarTipoTimer();
          //runCronometro();
          return prevTimeLeft; // Puedes ajustar esto según tus necesidades
        }
      });
    }, 1000);
    setIntervalId(id);
  }, [cambiarTipoTimer]);

  useEffect(() => {
    if (isRunning) {
      runCronometro();
    } else {
      clearInterval(intervalId);
    }

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [isRunning, intervalId, runCronometro]);

  // useEffect para iniciar automáticamente el cronómetro al cargar el componente
  useEffect(() => {
    if (isRunning) {
      runCronometro();
    }
  }, [isRunning, runCronometro]);

  return (
    <div>
      <h2>Cronómetro</h2>
      <p>{titleTimer}</p>
      <p>Tiempo restante: {formatTime(timeLeft)}</p>
      <button onClick={startStopCronometro}>{isRunning ? 'Stop' : 'Start'}</button>
      <button onClick={resetCronometro}>Reset</button>
    </div>
  );
};

const formatTime = (seconds) => {
  const minutos = Math.floor(seconds / 60);
  const segundos = seconds % 60;
  return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
};

export default Cronometro;