import React, { useState } from "react";
import styled from "styled-components";
import { Question, submitGuestAnswer, submitAnswer, GuestAnswerResponse, AnswerResponse } from "../services/api";
import Header from "./Header";
import Footer from "./Footer";

interface QuizPageProps {
  questions: Question[];
  onBack: () => void;
}

const QuizContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family:
    "Pretendard",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "Roboto",
    sans-serif;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  min-height: calc(100vh - 180px);
`;

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1.4;
  color: #222222;
  text-align: center;
  margin-bottom: 40px;
  max-width: 580px;
`;

const ProgressContainer = styled.div`
  width: 976px;
  margin-bottom: 40px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 16px;
  background-color: #efefef;
  border-radius: 16px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background-color: #30a10e;
  border-radius: 16px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  text-align: center;
  margin-top: 10px;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #30a10e;
`;

const QuestionCard = styled.div`
  width: 976px;
  height: 288px;
  background-color: #ffffff;
  border: 1px solid #dedede;
  border-radius: 16px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const QuestionNumber = styled.span<{ isCorrect?: boolean; showResult?: boolean }>`
  font-weight: 700;
  color: ${props => 
    props.showResult 
      ? (props.isCorrect ? '#3b82f6' : '#ff4444') 
      : '#30a10e'
  };
  position: relative;
  display: inline-block;
  margin-right: 8px;
  transition: color 0.3s ease;
  

`;

const QuestionText = styled.h2<{ isCorrect?: boolean; showResult?: boolean }>`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.4;
  color: ${props => 
    props.showResult 
      ? (props.isCorrect ? '#3b82f6' : '#ff4444') 
      : '#30a10e'
  };
  margin: 0;
  text-align: left;
  transition: color 0.3s ease;
`;

const AnswerContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;
`;

const AnswerButton = styled.button<{
  selected?: boolean;
  isCorrect?: boolean;
  showResult?: boolean;
}>`
  width: 395px;
  height: 120px;
  background-color: #ffffff;
  border: 1px solid #ededed;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #222222;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #30a10e;
    background-color: #f8f9fa;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${(props) =>
    props.selected &&
    !props.showResult &&
    `
    border-color: #30a10e;
    background-color: #f0f8f0;
  `}

  ${(props) =>
    props.showResult &&
    props.isCorrect &&
    `
    border-color: #30a10e;
    background-color: #f0f8f0;
  `}

  ${(props) =>
    props.showResult &&
    !props.isCorrect &&
    props.selected &&
    `
    border-color: #ff4444;
    background-color: #fff0f0;
  `}
`;



const NextButton = styled.button`
  background-color: #b7b7b7;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 12px 16px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 20px;

  &:hover {
    background-color: #a0a0a0;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const CharacterImage = styled.img`
  width: 40px;
  height: 36px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ExplanationText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  color: #666666;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
  text-align: left;
`;

const LoadingText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #30a10e;
  text-align: center;
  margin-top: 10px;
`;

const ErrorText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #ff4444;
  text-align: center;
  margin-top: 10px;
`;

const CorrectAnswerText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #666666;
  margin-top: 12px;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #30a10e;
`;

interface QuestionState {
  selectedAnswer: string | null;
  showResult: boolean;
  isLoading: boolean;
  error: string | null;
  answerResult: GuestAnswerResponse | AnswerResponse | null;
}

const QuizPage: React.FC<QuizPageProps> = ({ questions, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionStates, setQuestionStates] = useState<{ [key: number]: QuestionState }>({});

  const currentQuestion = questions[currentQuestionIndex];
  const currentQuestionState = questionStates[currentQuestion.id || 0] || {
    selectedAnswer: null,
    showResult: false,
    isLoading: false,
    error: null,
    answerResult: null,
  };
  
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const updateQuestionState = (questionId: number, updates: Partial<QuestionState>) => {
    setQuestionStates(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        ...updates,
      },
    }));
  };

  // 회원 여부 확인 함수
  const isLoggedIn = (): boolean => {
    return localStorage.getItem("accessToken") !== null;
  };

  // 정답 여부를 판단하는 함수
  const isAnswerCorrect = (): boolean => {
    if (!currentQuestionState.selectedAnswer || !currentQuestionState.answerResult) {
      return false;
    }
    
    // API 응답의 correct 필드 사용 (isCorrect 대신)
    const apiCorrect = currentQuestionState.answerResult?.correct;
    
    // 선택한 답변과 문제 정답을 직접 비교
    const selectedAnswer = currentQuestionState.selectedAnswer;
    const correctAnswer = currentQuestion.answer;
    
    // 답변 매핑 (O/X -> TRUE/FALSE)
    const answerMapping: { [key: string]: string } = {
      'O': 'TRUE',
      'X': 'FALSE'
    };
    
    const mappedSelectedAnswer = answerMapping[selectedAnswer];
    const isCorrectByComparison = mappedSelectedAnswer === correctAnswer;
    
    
    // API의 correct 필드가 있으면 사용, 없으면 직접 비교 결과 사용
    return apiCorrect !== undefined ? apiCorrect : isCorrectByComparison;
  };

  const handleAnswerSelect = async (answer: string) => {
    const questionId: number | undefined = currentQuestion.id;
    console.log("현재 문제 ID:", questionId, "타입:", typeof questionId); // 디버깅용 로그
    console.log("현재 문제 전체 데이터:", currentQuestion); // 현재 문제의 전체 데이터 확인
    console.log("회원 여부:", isLoggedIn()); // 회원 여부 확인
    
    // questionId가 유효하지 않은 경우 처리
    if (!questionId || isNaN(questionId)) {
      console.error("유효하지 않은 questionId:", questionId);
      return;
    }
    
    // TypeScript 타입 가드: questionId가 유효한 number임을 확인
    const validQuestionId: number = questionId;
    const currentState = questionStates[validQuestionId];
    
    if (!currentState?.showResult && !currentState?.isLoading) {
      updateQuestionState(validQuestionId, {
        selectedAnswer: answer,
        isLoading: true,
        error: null,
      });

      try {
        let result: GuestAnswerResponse | AnswerResponse;
        
        if (isLoggedIn()) {
          // 회원인 경우 회원용 API 호출
          console.log(`회원 API 호출: /api/questions/${validQuestionId}/answer`);
          result = await submitAnswer(validQuestionId, answer);
        } else {
          // 비회원인 경우 게스트 API 호출
          console.log(`게스트 API 호출: /api/questions/${validQuestionId}/guest-answer`);
          result = await submitGuestAnswer(validQuestionId, answer);
        }
        
        console.log("API 응답 결과:", result); // API 응답 결과 확인
        updateQuestionState(validQuestionId, {
          answerResult: result,
          showResult: true,
          isLoading: false,
        });
      } catch (err) {
        updateQuestionState(validQuestionId, {
          error: "채점 중 오류가 발생했습니다. 다시 시도해주세요.",
          isLoading: false,
        });
        console.error("Error submitting answer:", err);
      }
    }
  };

  const handleNextQuestion = () => {
    const questionId = currentQuestion.id;
    if (questionId && !isNaN(questionId)) {
      const currentState = questionStates[questionId];
      if (currentState?.answerResult?.isCorrect) {
        setCorrectAnswers(correctAnswers + 1);
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 퀴즈 완료
      console.log("퀴즈 완료!");
    }
  };

  return (
    <QuizContainer>
      <Header />
      <MainContent>
        <Title>퀴즐리로 문제 생성부터 오답 정리까지 한 번에!</Title>

        <ProgressContainer>
          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>
          <ProgressText>{Math.round(progress)}%</ProgressText>
        </ProgressContainer>

        <QuestionCard>
          <div>
            <CharacterImage src="/images/character2.png" alt="Character" />
            <QuestionText
              isCorrect={isAnswerCorrect()}
              showResult={currentQuestionState.showResult}
            >
              <QuestionNumber
                isCorrect={isAnswerCorrect()}
                showResult={currentQuestionState.showResult}
              >
                Q{currentQuestionIndex + 1}.
              </QuestionNumber>
              {currentQuestion.question}
            </QuestionText>
            {currentQuestionState.showResult && (
              <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
              </div>
            )}
          </div>

          <AnswerContainer>
            <AnswerButton
              selected={currentQuestionState.selectedAnswer === "O"}
              isCorrect={currentQuestionState.answerResult?.isCorrect && currentQuestionState.selectedAnswer === "O"}
              showResult={currentQuestionState.showResult}
              onClick={() => handleAnswerSelect("O")}
              disabled={currentQuestionState.showResult || currentQuestionState.isLoading}
            >
              O (참)
            </AnswerButton>
            <AnswerButton
              selected={currentQuestionState.selectedAnswer === "X"}
              isCorrect={currentQuestionState.answerResult?.isCorrect && currentQuestionState.selectedAnswer === "X"}
              showResult={currentQuestionState.showResult}
              onClick={() => handleAnswerSelect("X")}
              disabled={currentQuestionState.showResult || currentQuestionState.isLoading}
            >
              X (거짓)
            </AnswerButton>
          </AnswerContainer>

          {currentQuestionState.isLoading && <LoadingText>채점 중...</LoadingText>}
          {currentQuestionState.error && <ErrorText>{currentQuestionState.error}</ErrorText>}
          
          {currentQuestionState.showResult && currentQuestionState.answerResult && (
            <ExplanationText>
              <strong>해설:</strong> {currentQuestionState.answerResult.explanation}
            </ExplanationText>
          )}
          
          {currentQuestionState.showResult && (
            <CorrectAnswerText>
              <strong>정답:</strong> {currentQuestion.answer === 'TRUE' ? 'O' : 'X'}
            </CorrectAnswerText>
          )}

          <div style={{ textAlign: "right" }}>
            {currentQuestionState.showResult && (
              <NextButton onClick={handleNextQuestion}>
                {currentQuestionIndex < questions.length - 1 ? "다음 문제" : "완료"}
              </NextButton>
            )}
          </div>
        </QuestionCard>
      </MainContent>
      <Footer />
    </QuizContainer>
  );
};

export default QuizPage;
