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
  margin-bottom: 20px;
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
  margin-bottom: 44px;
`;

const SearchSection = styled.div`
  margin-bottom: 60px;
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
  const navigate = useNavigate();

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
      
      // API 응답이 객체이고 questions 필드를 가지고 있는 경우 처리
      let questionData: any = questions;
      if (questions && typeof questions === 'object' && !Array.isArray(questions)) {
        const response = questions as any;
        if (response.questions && Array.isArray(response.questions)) {
          questionData = response.questions;
        } else if (response.data && Array.isArray(response.data)) {
          questionData = response.data;
        }
      }
      
      // API 응답 데이터 검증
      if (!questionData || !Array.isArray(questionData) || questionData.length === 0) {
        throw new Error("API에서 유효한 문제 데이터를 받지 못했습니다.");
      }
      
      // 각 문제의 필수 필드 검증
      const validQuestions = questionData.filter(q => 
        q && typeof q === 'object' && 
        q.question && q.answer && q.explanation
      );
      
      if (validQuestions.length === 0) {
        throw new Error("문제 데이터의 필수 필드가 누락되었습니다.");
      }
      

      setPendingQuestions(validQuestions);
      // 로딩 모달에서 완료 콜백을 통해 처리됨
    } catch (err) {
      setError("문제 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
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
    // 문제 생성 완료 후 자동으로 퀴즈 페이지로 이동
    try {
      navigate("/quiz");
    } catch (error) {
      // navigate 실패 시 fallback으로 window.location.href 사용
      window.location.href = "/quiz";
    }
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
