import React from "react";
import styled, { keyframes } from "styled-components";

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const CharacterContainer = styled.div`
  position: relative;
  width: 346px;
  height: 112px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  margin-top: 60px;
`;

const ShadowImage = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 346px;
  height: 25px;
  object-fit: cover;
`;

const CharacterImage = styled.img<{ x: number; width: number; delay: number }>`
  width: ${(props) => props.width}px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
  position: absolute;
  left: ${(props) => props.x}px;
  bottom: 20px;
  z-index: 1;
  animation: ${bounce} 2s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;
`;

const CharacterGroup: React.FC = () => {
  return (
    <CharacterContainer>
      <ShadowImage src="/images/shadow.png" alt="Shadow" />
      <CharacterImage 
        src="/images/character1.png" 
        alt="Character 1" 
        x={0} 
        width={72} 
        delay={0}
      />
      <CharacterImage 
        src="/images/character2.png" 
        alt="Character 2" 
        x={87} 
        width={79} 
        delay={0.2}
      />
      <CharacterImage 
        src="/images/character3.png" 
        alt="Character 3" 
        x={184} 
        width={72} 
        delay={0.4}
      />
      <CharacterImage 
        src="/images/character4.png" 
        alt="Character 4" 
        x={274} 
        width={72} 
        delay={0.6}
      />
    </CharacterContainer>
  );
};

export default CharacterGroup;
