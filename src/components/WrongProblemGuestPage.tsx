import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 170px); // Header(90px) + Footer(80px) 제외
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

const ContentWrapper = styled.div`
  width: 485px;
  height: 237px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const CharacterGroup = styled.div`
  width: 276px;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
`;

const Character = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const Character2 = styled.img`
  width: 66px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const MainText = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 1.4;
  color: #b7b7b7;
  text-align: center;
  word-break: keep-all;
`;


const WrongProblemGuestPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <Container>
      <ContentWrapper>
        <CharacterGroup>
          <Character src="/images/black-white-character1.png" alt="캐릭터1" />
          <Character2 src="/images/black-white-character2.png" alt="캐릭터2" />
          <Character src="/images/black-white-character3.png" alt="캐릭터3" />
          <Character src="/images/black-white-character4.png" alt="캐릭터4" />
        </CharacterGroup>
        <MainText>
          틀린문제 풀어보기 서비스를 준비중입니다.
          <br />
          조금만 기다려주세요!
        </MainText>
      </ContentWrapper>
    </Container>
  );
};

export default WrongProblemGuestPage;
