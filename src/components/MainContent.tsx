import React, { useState } from "react";
import styled from "styled-components";
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
  width: 100%;
  min-height: calc(100vh - 180px);
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
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

  /* 태블릿 */
  @media (max-width: 1199px) {
    font-size: 28px;
    margin-bottom: 36px;
    max-width: 500px;
  }

  /* 모바일 */
  @media (max-width: 599px) {
    font-size: 24px;
    margin-bottom: 28px;
    max-width: 100%;
    padding: 0 20px;
  }
`;

const SearchSection = styled.div`
  margin-bottom: 60px;
  width: 976px;
  height: 72px;

  /* 태블릿 */
  @media (max-width: 1199px) {
    width: 100%;
    max-width: 800px;
    height: 68px;
    margin-bottom: 50px;
  }

  /* 모바일 */
  @media (max-width: 599px) {
    width: 100%;
    height: 64px;
    margin-bottom: 40px;
  }
`;

const MenuSection = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 40px;

  /* 태블릿 */
  @media (max-width: 1199px) {
    gap: 24px;
    margin-bottom: 36px;
  }

  /* 모바일 */
  @media (max-width: 599px) {
    flex-direction: column;
    gap: 20px;
    margin-bottom: 32px;
    width: 100%;
    max-width: 400px;
  }
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
        <ContentWrapper>
          <CharacterGroup />
          <MainTitle>
            <span style={{ color: "#30a10e" }}>퀴즐리</span>로 문제 생성부터 오답
            정리까지 한 번에!
          </MainTitle>

          <SearchSection>
            <SearchBar
              onSearch={handleGenerateQuestions}
              placeholder="문제를 검색해보세요"
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </SearchSection>

          <MenuSection>
            {menuItems.map((item) => (
              <MenuCard
                key={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
                onClick={() => {}}
              />
            ))}
          </MenuSection>
        </ContentWrapper>
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
