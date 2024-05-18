// src/components/Leaderboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const LeaderboardContainer = styled.div`
  margin-top: 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  max-height: 400px; /* Set a maximum height */
  overflow-y: auto; /* Add vertical scrolling if content exceeds height */
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

const Score = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #27ae60;
`;

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/leaderboard')
      .then(response => setLeaderboard(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <LeaderboardContainer>
      <LeaderboardTitle>Leaderboard</LeaderboardTitle>
      <LeaderboardList>
        {leaderboard.map((entry, index) => (
          <LeaderboardItem key={index}>
            <Position>{index + 1}</Position>
            <Name>{entry.name}</Name>
            <Score>{entry.score}</Score>
          </LeaderboardItem>
        ))}
      </LeaderboardList>
    </LeaderboardContainer>
  );
};

export default Leaderboard;
