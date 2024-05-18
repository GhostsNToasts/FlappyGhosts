// src/components/Game.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Pipe from './Pipe';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  top: 25%;
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

const InputContainer = styled.div`
  position: absolute;
  bottom: 20px;
  display: flex;
  gap: 10px;
`;

const LeaderboardContainer = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  max-height: 300px; /* Adjust this to your preference */
  width: 80%; /* Adjust this to your preference */
  overflow-y: auto;
`;

const LeaderboardTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-shadow: 1px 1px 2px #aaa;
`;

const LeaderboardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
`;

const LeaderboardItem = styled.li`
  font-size: 18px;
  margin: 10px 0;
  padding: 10px;
  color: #333;
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Position = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #f39c12;
  margin-right: 10px;
`;

const Name = styled.span`
  flex-grow: 1;
  text-align: left;
`;

const ScoreSpan = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #27ae60;
`;

const Game = () => {
  const [birdTop, setBirdTop] = useState(200);
  const [pipes, setPipes] = useState([{ left: window.innerWidth, height: Math.random() * 200 + 50 }]);
  const [gravity] = useState(2);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [name, setName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

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
    const interval = setInterval(() => {
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
          pipe.passed = true;
          setScore(score => score + 1);
        }
      });
    }, 30);

    return () => clearInterval(interval);
  }, [birdTop, pipes]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmitScore = () => {
    if (name) {
      axios.post('http://localhost:3001/score', { name, score })
        .then(response => {
          console.log('Score submitted successfully:', response);
          fetchLeaderboard();
        })
        .catch(error => console.error('Error submitting score:', error));
    }
  };

  const fetchLeaderboard = () => {
    axios.get('http://localhost:3001/leaderboard')
      .then(response => setLeaderboard(response.data))
      .catch(error => console.error(error));
  };

  const handleToggleLeaderboard = () => {
    if (!showLeaderboard) {
      fetchLeaderboard();
    }
    setShowLeaderboard(!showLeaderboard);
  };

  return (
    <GameContainer onClick={handleJump}>
      <Bird top={birdTop} />
      {pipes.map((pipe, index) => (
        <Pipe key={index} left={pipe.left} height={pipe.height} />
      ))}
      {isGameOver && <GameOverMessage>Game Over</GameOverMessage>}
      <Score>Score: {score}</Score>
      {isGameOver && (
        <InputContainer>
          <input type="text" value={name} onChange={handleNameChange} placeholder="Enter your name" />
          <button onClick={handleSubmitScore}>Submit Score</button>
          <button onClick={handleToggleLeaderboard}>{showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}</button>
        </InputContainer>
      )}
      {showLeaderboard && (
        <LeaderboardContainer>
          <LeaderboardTitle>Leaderboard</LeaderboardTitle>
          <LeaderboardList>
            {leaderboard.map((entry, index) => (
              <LeaderboardItem key={index}>
                <Position>{index + 1}</Position>
                <Name>{entry.name}</Name>
                <ScoreSpan>{entry.score}</ScoreSpan>
              </LeaderboardItem>
            ))}
          </LeaderboardList>
        </LeaderboardContainer>
      )}
    </GameContainer>
  );
};

export default Game;
