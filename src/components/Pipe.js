// src/components/Pipe.js
import React from 'react';
import styled from 'styled-components';

const PipeContainer = styled.div`
  position: absolute;
  top: 0;
  left: ${({ left }) => left}px;
  width: 50px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PipeSegment = styled.div`
  width: 100%;
  height: ${({ height }) => height}px;
  background-color: green;
`;

const Pipe = ({ left, height }) => {
  const gapHeight = 150; // Height of the gap between the pipes
  const bottomPipeHeight = 100 - height; // Adjust this line to fix the lower pipe height

  return (
    <PipeContainer left={left}>
      <PipeSegment height={height} />
      <PipeSegment height={window.innerHeight - height - gapHeight} /> {/* Adjusted lower pipe height */}
    </PipeContainer>
  );
};

export default Pipe;
