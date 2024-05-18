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
  max-height: 400px;
  overflow-y: auto;
  width: 95%;  // Set width to 95%
  z-index: 2;

  @media (max-width: 768px) {
    width: 90%;
  }

  @media (max-width: 480px) {
    width: 85%;
  }
`;

const LeaderboardTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-shadow: 1px 1px 2px #aaa;
`;

const HeaderRow = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  background: #e0e0e0;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Column = styled.span`
  flex: 1;
  text-align: ${props => props.align || 'left'};
  padding: 0 10px;
`;

const Position = styled(Column)`
  text-align: left;
  color: #f39c12;
`;

const Name = styled(Column)`
  text-align: center;
`;

const Score = styled(Column)`
  text-align: right;
  color: #27ae60;
`;

const LeaderboardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
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

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 8px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 6px;
  }
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
      <HeaderRow>
        <Position>Position</Position>
        <Name>Name</Name>
        <Score>Score</Score>
      </HeaderRow>
      <LeaderboardList>
        {leaderboard.slice(0, 10).map((entry, index) => (
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
