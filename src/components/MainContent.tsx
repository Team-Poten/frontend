import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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

const ErrorMessage = styled.div`
  color: #ff4444;
  font-family: "Pretendard", sans-serif;
  font-size: 1rem; /* 16px */
  margin-top: 1.25rem; /* 20px */
  text-align: center;
`;

const PDFButton = styled.button`
  background: linear-gradient(135deg, #30a10e 0%, #2d8f0d 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(48, 161, 14, 0.3);
  margin-top: 2rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(48, 161, 14, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const mainContainerRef = useRef<HTMLElement>(null);

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

  const handleSaveAsPDF = async () => {
    if (!mainContainerRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // 메인 컨테이너를 캡처
      const canvas = await html2canvas(mainContainerRef.current, {
        scale: 2, // 고해상도
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#f8f9fa",
        width: mainContainerRef.current.scrollWidth,
        height: mainContainerRef.current.scrollHeight,
      });

      // PDF 생성
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 너비 (mm)
      const pageHeight = 295; // A4 높이 (mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // 첫 페이지
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 여러 페이지가 필요한 경우
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // PDF 다운로드
      pdf.save("quizly-main-page.pdf");
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      setError("PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <>
      <MainContainer ref={mainContainerRef}>
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

        <ButtonContainer>
          <PDFButton 
            onClick={handleSaveAsPDF} 
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? "PDF 생성 중..." : "메인 화면 PDF로 저장"}
          </PDFButton>
        </ButtonContainer>
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
