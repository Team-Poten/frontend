import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, MockExamQuestion } from "../services/api";
import CharacterGroup from "./CharacterGroup";
import SearchBar from "./SearchBar";
import MenuCard from "./MenuCard";
import MockExamModal, { MockExamSettings } from "./MockExamModal";
import MockExamGuestPage from "./MockExamGuestPage";
import MockExamResultPage from "./MockExamResultPage";
import LoadingModal from "./LoadingModal";

const MockExamContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(
    100vh - 10.625rem - 5rem
  ); /* Header(90px) + Footer(80px) 제외 */
  background-color: #f8f9fa;
  width: 100%;
  padding: 0 1.5rem; /* 24px */
  box-sizing: border-box;
  position: relative;
`;

const CharacterSection = styled.div`
  margin-top: 12.5rem; /* 200px */
  margin-bottom: 2.5rem; /* 40px */
`;

const MainTitle = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 2rem; /* 32px */
  line-height: 1.4em;
  color: #222222;
  text-align: center;
  max-width: 36.25rem; /* 580px */
  margin: 0;
  margin-bottom: 3rem; /* 48px */
`;

const SearchSection = styled.div`
  margin-bottom: 3rem; /* 48px */
  width: 100%;
  max-width: 61rem; /* 976px */
`;

const MenuSection = styled.div`
  display: flex;
  gap: 1.5rem; /* 24px */
  margin-bottom: 3.75rem; /* 60px */
  justify-content: center;
  flex-wrap: wrap;
`;

const MockExamPage: React.FC = () => {
  const navigate = useNavigate();
  const [userLoginStatus, setUserLoginStatus] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<
    MockExamQuestion[]
  >([]);
  const [showResultPage, setShowResultPage] = useState(false);

  const menuItems = [
    {
      id: 1,
      title: "문제 모아보기",
      icon: "book",
    },
    {
      id: 2,
      title: "틀린문제 풀어보기",
      icon: "write",
    },
  ];

  useEffect(() => {
    // 컴포넌트 마운트 시 로그인 상태 확인
    const checkLoginStatus = async () => {
      try {
        const status = await isLoggedIn();
        setUserLoginStatus(status);
        // 로그인된 사용자인 경우 페이지 로드 시 바로 모달 열기
        if (status) {
          setIsModalOpen(true);
        }
      } catch (error) {
        setUserLoginStatus(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleGenerateQuestions = async (text: string, file?: File) => {
    setIsModalOpen(true);
  };

  const handleModalSave = (settings: MockExamSettings) => {
    
    setIsModalOpen(false);
  };

  const handleQuestionsGenerated = (questions: MockExamQuestion[]) => {
    
    setGeneratedQuestions(questions);
    setIsModalOpen(false);
    setShowResultPage(true);
  };

  const handleBackToMain = () => {
    setShowResultPage(false);
    setGeneratedQuestions([]);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // 모달을 닫을 때 메인 페이지로 이동
    navigate("/");
  };

  // 비로그인 사용자의 경우 게스트 페이지 표시
  if (!userLoginStatus) {
    return <MockExamGuestPage />;
  }

  // 결과 페이지 표시
  if (showResultPage && generatedQuestions.length > 0) {
    return (
      <MockExamResultPage
        questions={generatedQuestions}
        onBack={handleBackToMain}
      />
    );
  }

  return (
    <>
      <MockExamContainer>
        <CharacterSection>
          <CharacterGroup />
        </CharacterSection>

        <MainTitle>
          <span style={{ color: "#30a10e" }}>퀴즐리</span>로 문제 생성부터
          오답정리까지 한 번에!
        </MainTitle>

        <SearchSection>
          <SearchBar
            onGenerateQuestions={handleGenerateQuestions}
            isLoading={false}
          />
        </SearchSection>

        <MenuSection>
          {menuItems.map((item) => (
            <MenuCard key={item.id} {...item} />
          ))}
        </MenuSection>
      </MockExamContainer>

      <MockExamModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        onQuestionsGenerated={handleQuestionsGenerated}
        isLoggedIn={userLoginStatus}
      />
    </>
  );
};

export default MockExamPage;
