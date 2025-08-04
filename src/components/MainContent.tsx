import React, { useState } from "react";
import styled from "styled-components";
import SearchBar from "./SearchBar";
import MenuCard from "./MenuCard";
import CharacterGroup from "./CharacterGroup";
import { createQuestions, Question } from "../services/api";

interface MainContentProps {
  onQuestionsGenerated: (questions: Question[]) => void;
}

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  min-height: calc(100vh - 180px);
`;

const MainTitle = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1.4;
  color: #222222;
  text-align: center;
  margin-bottom: 40px;
  max-width: 580px;
`;

const SearchSection = styled.div`
  margin-bottom: 60px;
`;

const MenuSection = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 40px;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  margin-top: 20px;
  text-align: center;
`;

const MainContent: React.FC<MainContentProps> = ({ onQuestionsGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const menuItems = [
    {
      id: 1,
      title: "문제 만들기",
      description: "정리한 내용으로 문제 만들어요",
      icon: "📝",
    },
    {
      id: 2,
      title: "문제 모아보기",
      description: "만든 문제들 모아봤어요",
      icon: "📚",
    },
    {
      id: 3,
      title: "틀린문제 풀어보기",
      description: "틀린문제만 골라서 풀어요",
      icon: "❌",
    },
  ];

  const handleGenerateQuestions = async (text: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const questions = await createQuestions(text);
      onQuestionsGenerated(questions);
    } catch (err) {
      setError("문제 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Error generating questions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainContainer>
      <MainTitle>퀴즐리로 문제 생성부터 오답 정리까지 한 번에!</MainTitle>

      <SearchSection>
        <SearchBar onGenerateQuestions={handleGenerateQuestions} isLoading={isLoading} />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </SearchSection>

      <MenuSection>
        {menuItems.map((item) => (
          <MenuCard key={item.id} {...item} />
        ))}
      </MenuSection>

      <CharacterGroup />
    </MainContainer>
  );
};

export default MainContent;
