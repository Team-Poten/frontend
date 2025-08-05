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
      console.log("API 응답 데이터:", questions); // 디버깅용 로그
      console.log("첫 번째 문제 구조:", questions[0]); // 첫 번째 문제의 상세 구조 확인
      
      // 각 문제에 id 필드가 없으면 기본값 설정
      const questionsWithIds = questions.map((question, index) => {
        console.log(`문제 ${index + 1} 구조:`, question); // 각 문제의 구조 확인
        
        // 서버에서 다양한 ID 필드명을 사용할 수 있으므로 확인
        const questionAny = question as any; // 타입 단언으로 다양한 필드 접근
        const questionId = question.id || questionAny.questionId || questionAny.question_id || (index + 1);
        console.log(`문제 ${index + 1} ID:`, questionId);
        
        return {
          ...question,
          id: questionId, // 서버에서 응답받은 ID 또는 기본값 사용
        };
      });
      
      console.log("처리된 문제 데이터:", questionsWithIds); // 디버깅용 로그
      onQuestionsGenerated(questionsWithIds);
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
