// src/components/Game.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
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

const Score = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 24px;
  color: black;
  font-weight: bold;
`;

const Game = () => {
  const [birdTop, setBirdTop] = useState(200);
  const [pipes, setPipes] = useState([{ left: window.innerWidth, height: Math.random() * 200 + 50, passed: false }]);
  const [gravity] = useState(2);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (birdTop < 0 || birdTop > window.innerHeight - 50) {
      setIsGameOver(true);
    }
  }, [birdTop]);

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setBirdTop(birdTop => birdTop + gravity);
      setPipes(pipes => pipes.map(pipe => ({ ...pipe, left: pipe.left - 5 })).filter(pipe => pipe.left > -50));

      if (pipes[pipes.length - 1].left < window.innerWidth - 400) {
        const newHeight = Math.random() * 200 + 50;
        setPipes(pipes => [...pipes, { left: window.innerWidth, height: newHeight, passed: false }]);
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
    pipes.forEach((pipe, index) => {
      if (
        pipe.left < 150 &&
        pipe.left > 50 &&
        (birdTop < pipe.height || birdTop > pipe.height + 150)
      ) {
        setIsGameOver(true);
      }

      // Check if the bird passed the pipe
      if (pipe.left < 50 && !pipe.passed) {
        setScore(score => score + 1);
        pipes[index].passed = true; // Mark the pipe as passed
      }
    });
  }, [birdTop, pipes]);

  useEffect(() => {
    if (isGameOver) {
      // Send the score to the backend
      axios.post('http://localhost:3001/score', { score })
        .then(response => console.log('Score submitted successfully:', response))
        .catch(error => console.error('Error submitting score:', error));
    }
  }, [isGameOver, score]);

  return (
    <GameContainer onClick={handleJump}>
      <Bird top={birdTop} />
      {pipes.map((pipe, index) => (
        <Pipe key={index} left={pipe.left} height={pipe.height} />
      ))}
      {isGameOver && <GameOverMessage>Game Over</GameOverMessage>}
      <Score>Score: {score}</Score>
    </GameContainer>
  );
};

export default Game;
