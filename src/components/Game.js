// src/components/Game.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Pipe from './Pipe';

const GameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #70c5ce;
  overflow: hidden;
  position: relative;
`;

const Bird = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: yellow;
  border-radius: 50%;
  top: ${({ top }) => top}px;
  left: 100px;
`;

const GameOverMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: red;
  font-weight: bold;
`;

const Game = () => {
  const [birdTop, setBirdTop] = useState(200);
  const [pipes, setPipes] = useState([{ left: window.innerWidth, height: Math.random() * 200 + 50 }]);
  const [gravity, setGravity] = useState(2);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (birdTop < 0 || birdTop > window.innerHeight - 50) { // Adjusted bounds
      setIsGameOver(true);
    }
  }, [birdTop]);

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setBirdTop(birdTop => birdTop + gravity);
      setPipes(pipes => pipes.map(pipe => ({ ...pipe, left: pipe.left - 5 })).filter(pipe => pipe.left > -50));

      if (pipes[pipes.length - 1].left < window.innerWidth - 400) { // Ensure enough space between pipes
        const newHeight = Math.random() * 200 + 50;
        setPipes(pipes => [...pipes, { left: window.innerWidth, height: newHeight }]);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [gravity, isGameOver, pipes]);

  const handleJump = () => {
    if (!isGameOver) {
      setBirdTop(birdTop => Math.max(0, birdTop - 50));
    }
  };

  useEffect(() => {
    const gapHeight = 150; // Height of the gap between the pipes
    pipes.forEach(pipe => {
      if (
        pipe.left < 150 &&
        pipe.left > 50 &&
        (birdTop < pipe.height || birdTop > pipe.height + gapHeight)
      ) {
        setIsGameOver(true);
      }
    });
  }, [birdTop, pipes]);

  return (
    <GameContainer onClick={handleJump}>
      <Bird top={birdTop} />
      {pipes.map((pipe, index) => (
        <Pipe key={index} left={pipe.left} height={pipe.height} />
      ))}
      {isGameOver && <GameOverMessage>Game Over</GameOverMessage>}
    </GameContainer>
  );
};

export default Game;
