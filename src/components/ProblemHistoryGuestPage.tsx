import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import character1 from "../assets/character1.png";
import character2 from "../assets/character2.png";
import character3 from "../assets/character3.png";
import character4 from "../assets/character4.png";

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
  color: #222222;
  text-align: center;
  margin: 0 0 8px 0;
  width: 485px;
  height: 34px;
`;

const SubText = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.4;
  color: #777777;
  text-align: center;
  margin: 0 0 32px 0;
  width: 374px;
  height: 25px;
`;

const SignUpButton = styled.button`
  background-color: #30a10e;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 12px 16px;
  width: 128px;
  height: 44px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2a8f0c;
  }
`;

const ProblemHistoryGuestPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <Container>
      <ContentWrapper>
        <CharacterGroup>
          <Character src={character1} alt="캐릭터1" />
          <Character2 src={character2} alt="캐릭터2" />
          <Character src={character3} alt="캐릭터3" />
          <Character src={character4} alt="캐릭터4" />
        </CharacterGroup>
        <MainText>문제를 확인하려면 회원가입 또는 로그인이 필요해요</MainText>
        <SubText>퀴즐리 계정이 없다면 지금 바로 회원가입을 해보세요.</SubText>
        <SignUpButton onClick={handleSignUp}>지금 가입하기</SignUpButton>
      </ContentWrapper>
    </Container>
  );
};

export default ProblemHistoryGuestPage;
