import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { createQuestions, Question } from "../services/api";
import CharacterGroup from "./CharacterGroup";
import SearchBar from "./SearchBar";
import MenuCard from "./MenuCard";
import LoadingModal from "./LoadingModal";

interface MainContentProps {
  onQuestionsGenerated: (questions: Question[]) => void;
}

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 170px);
  background-color: #f8f9fa;
  width: 100%;
  padding: 0 24px;
  box-sizing: border-box;
  position: relative;
`;

const CharacterSection = styled.div`
  margin-top: 250px;
  margin-bottom: 60px;
`;

const MainTitle = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1.399999976158142em;
  color: #222222;
  text-align: center;
  max-width: 580px;
  margin: 0;
  margin-bottom: 86px;
`;

const SearchSection = styled.div`
  margin-bottom: 132px;
  width: 976px;
  height: 72px;
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
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
  const [apiPromise, setApiPromise] = useState<Promise<Question[]> | null>(
    null
  );

  const menuItems = [
    {
      id: 1,
      title: "문제 만들기",
      description: "정리한 내용으로 문제 만들어요",
      icon: "light",
    },
    {
      id: 2,
      title: "문제 모아보기",
      description: "만든 문제들 모아봤어요",
      icon: "book",
    },
    {
      id: 3,
      title: "틀린문제 풀어보기",
      description: "틀린문제만 골라서 풀어요",
      icon: "write",
    },
  ];

  const handleGenerateQuestions = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setIsLoadingModalOpen(true);

    try {
      // API 호출을 Promise로 생성하여 LoadingModal에 전달
      const questionsPromise = createQuestions(text);
      setApiPromise(questionsPromise);

      const questions = await questionsPromise;
      console.log("API 응답 데이터:", questions);
      console.log("첫 번째 문제 데이터:", questions[0]);
      console.log("첫 번째 문제의 questionId 필드:", questions[0]?.questionId);
      console.log("첫 번째 문제의 모든 키:", Object.keys(questions[0] || {}));
      setPendingQuestions(questions);
      // 로딩 모달에서 완료 콜백을 통해 처리됨
    } catch (err) {
      setError("문제 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Error generating questions:", err);
      setIsLoadingModalOpen(false);
      setApiPromise(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadingComplete = () => {
    setIsLoadingModalOpen(false);
    setApiPromise(null);
    onQuestionsGenerated(pendingQuestions);
  };

  return (
    <>
      <MainContainer>
        <CharacterSection>
          <CharacterGroup />
        </CharacterSection>

        <MainTitle>
          <span style={{ color: "#30a10e" }}>퀴즐리</span>로 문제 생성부터 오답
          정리까지 한 번에!
        </MainTitle>

        <SearchSection>
          <SearchBar
            onGenerateQuestions={handleGenerateQuestions}
            isLoading={isLoading}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </SearchSection>

        <MenuSection>
          {menuItems.map((item) => (
            <MenuCard key={item.id} {...item} />
          ))}
        </MenuSection>
      </MainContainer>

      <LoadingModal
        isOpen={isLoadingModalOpen}
        onComplete={handleLoadingComplete}
        apiPromise={apiPromise}
      />
    </>
  );
};

export default MainContent;
