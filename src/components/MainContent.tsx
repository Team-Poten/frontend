import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  createQuestions,
  createQuestionsFromFile,
  Question,
  isLoggedIn,
} from "../services/api";
import CharacterGroup from "./CharacterGroup";
import SearchBar from "./SearchBar";
import MenuCard from "./MenuCard";
import LoadingModal from "./LoadingModal";
import QuestionTypeModal from "./QuestionTypeModal";

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
  margin-top: 200px;
  margin-bottom: 40px;
`;

const MainTitle = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1.4em;
  color: #222222;
  text-align: center;
  max-width: 580px;
  margin: 0;
  margin-bottom: 48px;
`;

const SearchSection = styled.div`
  margin-bottom: 48px;
  width: 100%;
  max-width: 976px;
`;

const MenuSection = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 60px;
  justify-content: center;
  flex-wrap: wrap;
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
  const [isQuestionTypeModalOpen, setIsQuestionTypeModalOpen] = useState(false);
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
  const [pendingText, setPendingText] = useState<string>("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [apiPromise, setApiPromise] = useState<Promise<Question[]> | null>(
    null
  );
  const [userLoginStatus, setUserLoginStatus] = useState<boolean>(false);
  const navigate = useNavigate();

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
      } catch (error) {
        setUserLoginStatus(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleGenerateQuestions = async (text: string, file?: File) => {
    setPendingText(text);
    setPendingFile(file || null);
    setIsQuestionTypeModalOpen(true);
  };

  const handleQuestionTypeSelect = async (type: "ox" | "multiple") => {
    setIsQuestionTypeModalOpen(false);
    setIsLoading(true);
    setError(null);
    setIsLoadingModalOpen(true);

    try {
      // 문제 유형에 따라 API 호출
      let apiType: "TRUE_FALSE" | "MULTIPLE_CHOICE";
      if (type === "ox") {
        apiType = "TRUE_FALSE";
      } else {
        apiType = "MULTIPLE_CHOICE";
      }

      let questionsPromise: Promise<Question[]>;

      // 파일이 있는 경우 파일 업로드 API 호출, 없는 경우 텍스트 API 호출
      if (pendingFile) {
        questionsPromise = createQuestionsFromFile(pendingFile, apiType);
      } else {
        questionsPromise = createQuestions(pendingText, apiType);
      }

      setApiPromise(questionsPromise);

      const questions = await questionsPromise;

      // API 응답이 객체이고 questions 필드를 가지고 있는 경우 처리
      let questionData: any = questions;
      if (
        questions &&
        typeof questions === "object" &&
        !Array.isArray(questions)
      ) {
        const questionsObj = questions as any; // 타입 단언으로 any로 변환
        if (questionsObj.questions && Array.isArray(questionsObj.questions)) {
          questionData = questionsObj.questions;
        } else if (questionsObj.data && Array.isArray(questionsObj.data)) {
          questionData = questionsObj.data;
        }
      }

      // 문제 데이터가 배열인지 확인
      if (Array.isArray(questionData) && questionData.length > 0) {
        // 문제 유형 정보를 각 문제에 추가
        const questionsWithType = questionData.map((question: any) => ({
          ...question,
          type: apiType, // API에서 받은 문제 유형을 각 문제에 추가
        }));

        onQuestionsGenerated(questionsWithType);
        setIsLoadingModalOpen(false);
        setIsLoading(false);
      } else {
        throw new Error("문제 데이터를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("문제 생성 에러:", error);
      setError("문제 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsLoadingModalOpen(false);
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
          <span style={{ color: "#30a10e" }}>퀴즐리</span>로 문제 생성부터
          오답정리까지 한 번에!
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

      <QuestionTypeModal
        isOpen={isQuestionTypeModalOpen}
        onClose={() => setIsQuestionTypeModalOpen(false)}
        onSelectType={handleQuestionTypeSelect}
        isLoggedIn={userLoginStatus}
      />

      <LoadingModal
        isOpen={isLoadingModalOpen}
        onComplete={handleLoadingComplete}
        apiPromise={apiPromise}
      />
    </>
  );
};

export default MainContent;
