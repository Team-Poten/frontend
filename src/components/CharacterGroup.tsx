import React from "react";
import styled from "styled-components";

const CharacterContainer = styled.div`
  position: relative;
  width: 346px;
  height: 92px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
`;

const Shadow = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 346px;
  height: 25px;
  background-color: #ececec;
  border-radius: 50%;
  filter: blur(6px);
`;

const CharacterImage = styled.img<{ x: number; width: number }>`
  width: ${(props) => props.width}px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
  position: absolute;
  left: ${(props) => props.x}px;
  bottom: 0;
  z-index: 1;
`;

const CharacterGroup: React.FC = () => {
  return (
    <CharacterContainer>
      <Shadow />
      <CharacterImage src="/images/character1.png" alt="Character 1" x={0} width={72} />
      <CharacterImage src="/images/character2.png" alt="Character 2" x={87} width={79} />
      <CharacterImage src="/images/character3.png" alt="Character 3" x={184} width={72} />
      <CharacterImage src="/images/character4.png" alt="Character 4" x={274} width={72} />
    </CharacterContainer>
  );
};

export default CharacterGroup;
