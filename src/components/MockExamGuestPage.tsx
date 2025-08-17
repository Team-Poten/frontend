import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const GuestPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 10.625rem); /* Header(90px) + Footer(80px) 제외 */
  background-color: #f8f9fa;
  width: 100%;
  padding: 0 1.5rem; /* 24px */
  box-sizing: border-box;
`;

const ContentGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem; /* 8px */
  width: 30.3125rem; /* 485px */
`;

const CharacterGroup = styled.div`
  display: flex;
  gap: 0.625rem; /* 10px */
  margin-bottom: 2rem; /* 32px */
`;

const CharacterImage = styled.img`
  width: 3.75rem; /* 60px */
  height: 3.75rem; /* 60px */
  object-fit: cover;
`;

const MainTitle = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 1.5rem; /* 24px */
  line-height: 1.4em;
  color: #222222;
  text-align: center;
  margin: 0;
  width: 685px;
  height: 2.125rem; /* 34px */
`;

const SubTitle = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 1.125rem; /* 18px */
  line-height: 1.4em;
  color: #777777;
  text-align: center;
  margin: 0;
  width: 23.375rem; /* 374px */
  height: 1.5625rem; /* 25px */
  margin-bottom: 3.5625rem; /* 57px */
`;

const SignUpButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1rem; /* 12px 16px */
  width: 8rem; /* 128px */
  background-color: #30a10e;
  border: none;
  border-radius: 0.375rem; /* 6px */
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 1rem; /* 16px */
  line-height: 1.4em;
  color: #ffffff;
  cursor: pointer;

  &:hover {
    background-color: #2a8f0c;
  }
`;

const MockExamGuestPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <GuestPageContainer>
      <ContentGroup>
        <CharacterGroup>
          <CharacterImage src="/images/character1.png" alt="캐릭터1" />
          <CharacterImage src="/images/character2.png" alt="캐릭터2" />
          <CharacterImage src="/images/character3.png" alt="캐릭터3" />
          <CharacterImage src="/images/character4.png" alt="캐릭터4" />
        </CharacterGroup>
        
        <MainTitle>모의고사를 제작하려면 회원가입 또는 로그인이 필요해요</MainTitle>
        
        <SubTitle>퀴즐리 계정이 없다면 지금 바로 회원가입을 해보세요.</SubTitle>
        
        <SignUpButton onClick={handleSignUp}>
          지금 가입하기
        </SignUpButton>
      </ContentGroup>
    </GuestPageContainer>
  );
};

export default MockExamGuestPage;