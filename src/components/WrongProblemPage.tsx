import React from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 180px);
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  max-width: 397px;
  width: 100%;
`;

const CharacterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 276px;
  height: 60px;
`;

const Character = styled.img<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  object-fit: cover;
  flex-shrink: 0;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 397px;
  height: 68px;
`;

const MessageText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 1.4;
  color: #b7b7b7;
  text-align: center;
  word-break: keep-all;
`;

const WrongProblemPage: React.FC = () => {
  return (
    <PageContainer>
      <ContentContainer>
        <CharacterGroup>
          <Character
            src="/images/black-white-character1.png"
            alt="캐릭터 1"
            width={60}
            height={60}
          />
          <Character
            src="/images/black-white-character2.png"
            alt="캐릭터 2"
            width={66}
            height={60}
          />
          <Character
            src="/images/black-white-character3.png"
            alt="캐릭터 3"
            width={60}
            height={60}
          />
          <Character
            src="/images/black-white-character4.png"
            alt="캐릭터 4"
            width={60}
            height={60}
          />
        </CharacterGroup>
        <MessageContainer>
          <MessageText>
            틀린문제 풀어보기 서비스를 준비중입니다.
            <br />
            조금만 기다려주세요!
          </MessageText>
        </MessageContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default WrongProblemPage;
