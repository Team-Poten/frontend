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
  max-width: 50rem; /* 800px로 증가 - 기존 580px에서 확장 */
  margin: 0;
  margin-bottom: 3rem; /* 48px */
  /* white-space: nowrap 제거 - 긴 텍스트가 자연스럽게 줄바꿈되도록 */
  overflow: visible; /* hidden에서 visible로 변경 */
`;

const AnimatedTitle = styled.div<{ isVisible: boolean }>`
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: translateY(${props => props.isVisible ? '0' : '20px'});
  transition: all 0.5s ease-in-out;
  /* white-space: nowrap 제거 - 긴 텍스트가 자연스럽게 줄바꿈되도록 */
  overflow: visible; /* hidden에서 visible로 변경 */
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

const ErrorMessage = styled.div`
  color: #ff4444;
  font-family: "Pretendard", sans-serif;
  font-size: 1rem; /* 16px */
  margin-top: 1.25rem; /* 20px */
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
  const [mainTitle, setMainTitle] = useState("퀴즐리로 문제 생성부터 오답정리까지 한 번에!");
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const navigate = useNavigate();

  const titleMessages = [
    "퀴즐리로 문제 생성부터 오답정리까지 한 번에!",
    "자격증 대비 요점 정리를 검색창에 입력해보세요.",
    "오늘 배운 과목의 필기 내용을 입력해보세요.",
    "전공 시험 대비를 위한 범위를 입력해보세요."
  ];

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

  const renderTitleWithHighlight = (title: string) => {
    if (title.includes("퀴즐리로")) {
      return (
        <>
          <span style={{ color: "#30a10e" }}>퀴즐리</span>로 문제 생성부터 오답정리까지 한 번에!
        </>
      );
    } else if (title.includes("요점 정리")) {
      return (
        <>
          자격증 대비 <span style={{ color: "#30a10e" }}>요점 정리</span>를 검색창에 입력해보세요.
        </>
      );
    } else if (title.includes("필기 내용")) {
      return (
        <>
          오늘 배운 과목의 <span style={{ color: "#30a10e" }}>필기 내용</span>을 입력해보세요.
        </>
      );
    } else if (title.includes("시험 대비")) {
      return (
        <>
          전공 <span style={{ color: "#30a10e" }}>시험 대비</span>를 위한 범위를 입력해보세요.
        </>
      );
    }
    return title;
  };

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

    // 타이틀 순환 애니메이션
    let currentIndex = 0;
    const titleInterval = setInterval(() => {
      // 현재 텍스트를 숨김
      setIsTitleVisible(false);
      
      // 0.3초 후 새 텍스트로 변경하고 다시 보이게 함
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % titleMessages.length;
        setMainTitle(titleMessages[currentIndex]);
        setIsTitleVisible(true);
      }, 300);
    }, 2000); // 2초마다 변경

    return () => clearInterval(titleInterval);
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

        // 문제 데이터를 저장하되, 로딩 모달은 닫지 않음 (LoadingModal의 onComplete에서 처리)
        setPendingQuestions(questionsWithType);
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

    // pendingQuestions가 있으면 사용하고, 없으면 빈 배열로 처리
    if (pendingQuestions.length > 0) {
      onQuestionsGenerated(pendingQuestions);
      // 문제 생성 완료 후 자동으로 퀴즈 페이지로 이동
      try {
        navigate("/quiz");
      } catch (error) {
        // navigate 실패 시 fallback으로 window.location.href 사용
        window.location.href = "/quiz";
      }
    } else {
      console.error("생성된 문제가 없습니다.");
      setError("문제 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <MainContainer>
        <CharacterSection>
          <CharacterGroup />
        </CharacterSection>

        <MainTitle>
          <AnimatedTitle isVisible={isTitleVisible}>
            {renderTitleWithHighlight(mainTitle)}
          </AnimatedTitle>
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
