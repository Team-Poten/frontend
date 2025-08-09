import React, { useState } from "react";
import styled from "styled-components";
import {
  Question,
  submitGuestAnswer,
  submitAnswer,
  GuestAnswerResponse,
  AnswerResponse,
} from "../services/api";
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
  text-align: left;
  margin-bottom: 40px;
  max-width: 976px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TitleIcon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const ProgressContainer = styled.div`
  width: 976px;
  margin-bottom: 40px;
  position: relative;
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

const ProgressText = styled.div<{ progress: number }>`
  text-align: center;
  margin-top: 10px;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #30a10e;
  position: absolute;
  top: 16px;
  left: ${(props) => props.progress}%;
  transform: translateX(-50%);
  transition: left 0.3s ease;
`;

const QuestionCard = styled.div<{ isCorrect?: boolean; showResult?: boolean }>`
  width: 976px;
  min-height: 200px;
  margin-top: 24px;
  background-color: #ffffff;
  border: 1px solid ${(props) => 
    props.showResult 
      ? (props.isCorrect ? "#2473FC" : "#FF243E")
      : "#dedede"
  };
  border-radius: 16px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: border-color 0.3s ease;
`;

const QuestionNumber = styled.span<{
  isCorrect?: boolean;
  showResult?: boolean;
}>`
  font-weight: 400;
  color: ${(props) => 
    props.showResult 
      ? (props.isCorrect ? "#2473FC" : "#FF243E")
      : "#30a10e"
  };
  position: relative;
  display: inline-block;
  margin-right: 8px;
  transition: color 0.3s ease;
`;

const QuestionText = styled.h2<{ isCorrect?: boolean; showResult?: boolean }>`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 1.4;
  color: ${(props) => 
    props.showResult 
      ? (props.isCorrect ? "#2473FC" : "#FF243E")
      : "#222222"
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
  border: 2px solid #ededed;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
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
    border-color: #2473FC;
    background-color: #f0f8ff;
  `}

  ${(props) =>
    props.showResult &&
    !props.isCorrect &&
    props.selected &&
    `
    border-color: #FF243E;
    background-color: #fff0f0;
  `}
`;

const AnswerImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const NextButton = styled.button<{ isSelected?: boolean; isLastQuestion?: boolean }>`
  background-color: ${(props) => 
    props.isLastQuestion 
      ? (props.isSelected ? "#30a10e" : "#b7b7b7")
      : (props.isSelected ? "#30a10e" : "#b7b7b7")
  };
  color: #ffffff;
  border: ${(props) => 
    props.isLastQuestion 
      ? (props.isSelected ? "1px solid #30a10e" : "none")
      : (props.isSelected ? "1px solid #30a10e" : "none")
  };
  border-radius: 6px;
  padding: 12px 16px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  

  &:hover {
    background-color: ${(props) => 
      props.isLastQuestion 
        ? (props.isSelected ? "#2a8f0c" : "#a0a0a0")
        : (props.isSelected ? "#2a8f0c" : "#a0a0a0")
    };
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const CharacterImage = styled.img<{ progress: number }>`
  width: 40px;
  height: 36px;
  object-fit: cover;
  border-radius: 8px;
  position: absolute;
  top: -10px;
  left: ${(props) => props.progress}%;
  transform: translateX(-50%);
  transition: left 0.3s ease;
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

const ResultModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 40px;
  max-width: 480px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const ModalImage = styled.img`
  width: 80px;
  object-fit: contain;
  margin: 0 auto 20px;
  display: block;
`;

const ModalTitle = styled.h2`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: #222222;
  margin-bottom: 8px;
`;

const ModalSubtitle = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: #30a10e;
  margin-bottom: 16px;
`;

const ResultText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: #222222e;
  margin-bottom: 16px;
`;

const ScoreText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #666666;
  margin-bottom: 8px;
`;

const MemberScoreText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #222222;
  margin-bottom: 8px;
`;

const GuestMessage = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #777777;
  line-height: 1.5;
  margin-top: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 32px;
`;

const ModalButton = styled.button<{ primary?: boolean }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${(props) =>
    props.primary
      ? `
    background-color: #30a10e;
    color: #ffffff;
    
    &:hover {
      background-color: #2a8f0c;
    }
  `
      : `
    background-color: #f8f9fa;
    color: #666666;
    border: 1px solid #e9ecef;
    
    &:hover {
      background-color: #e9ecef;
    }
  `}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: #999999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  &:hover {
    color: #666666;
  }
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
  const [questionStates, setQuestionStates] = useState<{
    [key: number]: QuestionState;
  }>({});
  const [showResultModal, setShowResultModal] = useState(false);

  // questions 배열이 비어있거나 undefined인 경우 처리
  if (!questions || questions.length === 0) {
    return (
      <QuizContainer>
        <Header />
        <MainContent>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2>문제를 불러오는 중...</h2>
            <p>문제 데이터가 없습니다. 메인 페이지로 돌아가서 다시 시도해주세요.</p>
            <button 
              onClick={onBack}
              style={{
                padding: '12px 24px',
                backgroundColor: '#30a10e',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              메인으로 돌아가기
            </button>
          </div>
        </MainContent>
        <Footer />
      </QuizContainer>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  // questionId가 없으면 인덱스를 사용하여 고유한 ID 생성
  const currentQuestionId = currentQuestion.questionId || currentQuestionIndex;
  const currentQuestionState = questionStates[currentQuestionId] || {
    selectedAnswer: null,
    showResult: false,
    isLoading: false,
    error: null,
    answerResult: null,
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const updateQuestionState = (
    questionId: number,
    updates: Partial<QuestionState>
  ) => {
    setQuestionStates((prev) => ({
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
    if (
      !currentQuestionState.selectedAnswer ||
      !currentQuestionState.answerResult
    ) {
      return false;
    }

    // API 응답의 correct 필드 사용 (isCorrect 대신)
    const apiCorrect = currentQuestionState.answerResult?.correct;

    // 선택한 답변과 문제 정답을 직접 비교
    const selectedAnswer = currentQuestionState.selectedAnswer;
    const correctAnswer = currentQuestion.answer;

    // 답변 매핑 (O/X -> TRUE/FALSE)
    const answerMapping: { [key: string]: string } = {
      O: "TRUE",
      X: "FALSE",
    };

    const mappedSelectedAnswer = answerMapping[selectedAnswer];
    const isCorrectByComparison = mappedSelectedAnswer === correctAnswer;

    // API의 correct 필드가 있으면 사용, 없으면 직접 비교 결과 사용
    return apiCorrect !== undefined ? apiCorrect : isCorrectByComparison;
  };

  const handleAnswerSelect = async (answer: string) => {
    // questionId가 없으면 인덱스를 사용하여 고유한 ID 생성
    const questionId: number =
      currentQuestion.questionId || currentQuestionIndex;
    console.log("현재 문제 ID:", questionId, "타입:", typeof questionId); // 디버깅용 로그
    console.log("현재 문제 전체 데이터:", currentQuestion); // 현재 문제의 전체 데이터 확인
    console.log("currentQuestion.questionId 값:", currentQuestion.questionId); // questionId 필드 값 확인
    console.log("currentQuestionIndex 값:", currentQuestionIndex); // 인덱스 값 확인
    console.log("회원 여부:", isLoggedIn()); // 회원 여부 확인

    // questionId가 유효하지 않은 경우 처리
    if (isNaN(questionId)) {
      console.error("유효하지 않은 questionId:", questionId);
      return;
    }

    const currentState = questionStates[questionId];

    if (!currentState?.showResult && !currentState?.isLoading) {
      updateQuestionState(questionId, {
        selectedAnswer: answer,
        isLoading: true,
        error: null,
      });

      try {
        let result: GuestAnswerResponse | AnswerResponse;

        if (isLoggedIn()) {
          // 회원인 경우 회원용 API 호출
          console.log(`회원 API 호출: /api/questions/${questionId}/answer`);
          result = await submitAnswer(questionId, answer);
        } else {
          // 비회원인 경우 게스트 API 호출
          console.log(
            `게스트 API 호출: /api/questions/${questionId}/guest-answer`
          );
          result = await submitGuestAnswer(questionId, answer);
        }

        console.log("API 응답 결과:", result); // API 응답 결과 확인
        updateQuestionState(questionId, {
          answerResult: result,
          showResult: true,
          isLoading: false,
        });
      } catch (err) {
        updateQuestionState(questionId, {
          error: "채점 중 오류가 발생했습니다. 다시 시도해주세요.",
          isLoading: false,
        });
        console.error("Error submitting answer:", err);
      }
    }
  };

  const handleNextQuestion = () => {
    const questionId = currentQuestion.questionId || currentQuestionIndex;
    if (!isNaN(questionId)) {
      const currentState = questionStates[questionId];
      if (currentState?.answerResult?.isCorrect) {
        setCorrectAnswers(correctAnswers + 1);
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 퀴즈 완료 - 결과 모달 표시
      setShowResultModal(true);
    }
  };

  const handleViewQuestions = () => {
    // 문제 모아보기 페이지로 이동 (/history)
    setShowResultModal(false);
    // 회원의 히스토리 페이지로 이동
    window.location.href = "/history";
  };

  const handleCreateMoreQuestions = () => {
    // 문제 더 만들기 페이지로 이동 (메인 홈)
    setShowResultModal(false);
    onBack();
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
    onBack(); // 메인 홈으로 이동
  };

  // 정답 개수 계산
  const totalCorrect = Object.values(questionStates).filter((state) => {
    if (!state.answerResult) return false;

    // API 응답의 correct 필드 사용
    const apiCorrect = state.answerResult.correct;

    // 선택한 답변과 문제 정답을 직접 비교
    const selectedAnswer = state.selectedAnswer;
    const questionIndex = Object.keys(questionStates).find(
      (key) => questionStates[parseInt(key)] === state
    );
    const question = questions[parseInt(questionIndex || "0")];
    const correctAnswer = question?.answer;

    // 답변 매핑 (O/X -> TRUE/FALSE)
    const answerMapping: { [key: string]: string } = {
      O: "TRUE",
      X: "FALSE",
    };

    const mappedSelectedAnswer = answerMapping[selectedAnswer || ""];
    const isCorrectByComparison = mappedSelectedAnswer === correctAnswer;

    // API의 correct 필드가 있으면 사용, 없으면 직접 비교 결과 사용
    return apiCorrect !== undefined ? apiCorrect : isCorrectByComparison;
  }).length;

  const totalWrong = questions.length - totalCorrect;

  // 이미지 경로를 결정하는 함수
  const getAnswerImagePath = (answer: string, isSelected: boolean, isCorrect: boolean, showResult: boolean) => {
    if (!showResult) {
      // 결과 표시 전: gray 이미지
      return answer === "O" ? "/images/gray_o.png" : "/images/gray_x.png";
    } else if (isSelected) {
      // 선택된 답변: 정답 여부에 따라 색상 결정
      if (isCorrect) {
        return answer === "O" ? "/images/blue_o.png" : "/images/blue_x.png";
      } else {
        return answer === "O" ? "/images/red_o.png" : "/images/red_x.png";
      }
    } else {
      // 선택되지 않은 답변: gray 이미지
      return answer === "O" ? "/images/gray_o.png" : "/images/gray_x.png";
    }
  };

  return (
    <QuizContainer>
      <Header />
      <MainContent>
        <Title>
          지금부터 본격 <span style={{ color: "#30a10e" }}>문제 타임!</span>{" "}
          집중해서 풀어봐요
          <TitleIcon src="/images/icn_write.png" alt="Write icon" />
        </Title>

        <ProgressContainer>
          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>
          <CharacterImage
            src="/images/character2.png"
            alt="Character"
            progress={progress}
          />
          <ProgressText progress={progress}>
            {Math.round(progress)}%
          </ProgressText>
        </ProgressContainer>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            width: "976px",
          }}
        >
          <QuestionCard
            isCorrect={isAnswerCorrect()}
            showResult={currentQuestionState.showResult}
          >
            <div>
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
            </div>

            <AnswerContainer>
              <AnswerButton
                selected={currentQuestionState.selectedAnswer === "O"}
                isCorrect={
                  currentQuestionState.selectedAnswer === "O" && isAnswerCorrect()
                }
                showResult={currentQuestionState.showResult}
                onClick={() => handleAnswerSelect("O")}
                disabled={
                  currentQuestionState.showResult ||
                  currentQuestionState.isLoading
                }
              >
                <AnswerImage src={getAnswerImagePath("O", currentQuestionState.selectedAnswer === "O", isAnswerCorrect(), currentQuestionState.showResult)} alt="O" />
              </AnswerButton>
              <AnswerButton
                selected={currentQuestionState.selectedAnswer === "X"}
                isCorrect={
                  currentQuestionState.selectedAnswer === "X" && isAnswerCorrect()
                }
                showResult={currentQuestionState.showResult}
                onClick={() => handleAnswerSelect("X")}
                disabled={
                  currentQuestionState.showResult ||
                  currentQuestionState.isLoading
                }
              >
                <AnswerImage src={getAnswerImagePath("X", currentQuestionState.selectedAnswer === "X", isAnswerCorrect(), currentQuestionState.showResult)} alt="X" />
              </AnswerButton>
            </AnswerContainer>

            {currentQuestionState.isLoading && (
              <LoadingText>채점 중...</LoadingText>
            )}
            {currentQuestionState.error && (
              <ErrorText>{currentQuestionState.error}</ErrorText>
            )}
          </QuestionCard>

          <NextButtonContainer>
            <NextButton
              onClick={handleNextQuestion}
              isSelected={currentQuestionState.showResult}
              disabled={!currentQuestionState.showResult}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
            >
              {currentQuestionIndex < questions.length - 1
                ? "다음 문제"
                : "결과보기"}
            </NextButton>
          </NextButtonContainer>

          {currentQuestionState.showResult &&
            currentQuestionState.answerResult && (
              <ExplanationBox>
                <ExplanationSummary>해설 요약</ExplanationSummary>
                <ExplanationContent isExplanation={true}>
                    {currentQuestionState.answerResult.explanation}
                </ExplanationContent>
                <ExplanationContent>
                  정답 : {currentQuestion.answer === "TRUE" ? "O" : "X"}
                </ExplanationContent>
              </ExplanationBox>
            )}
        </div>
      </MainContent>
      <Footer />

      {/* 결과 모달 */}
      {showResultModal && (
        <ResultModal>
          <ModalContent>
            {!isLoggedIn() && (
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            )}

            {isLoggedIn() ? (
              // 회원용 모달
              <>
                <ModalImage src="/images/confetti.png" alt="축하 이미지" />
                <ModalSubtitle>모든 문제를 다 풀었어요!</ModalSubtitle>
                <ModalTitle>문제 정답 결과</ModalTitle>
                <ResultText>
                  {totalCorrect} / {questions.length}문제{" "}
                  <span style={{ color: "#777777" }}>
                    (정답{totalCorrect}, 오답{totalWrong})
                  </span>
                </ResultText>
      

                <ButtonContainer>
                  <ModalButton onClick={handleViewQuestions}>
                    문제 모아보기
                  </ModalButton>
                  <ModalButton primary onClick={handleCreateMoreQuestions}>
                    문제 더 만들기
                  </ModalButton>
                </ButtonContainer>
              </>
            ) : (
              // 비회원용 모달
              <>
                <ModalImage src="/images/guest-result.png" alt="결과 이미지" />
                <ModalTitle>문제 정답 결과</ModalTitle>
                <ResultText>
                  {totalCorrect} / {questions.length}문제{" "}
                  <span style={{ color: "#777777" }}>
                    (정답{totalCorrect}, 오답{totalWrong})
                  </span>
                </ResultText>
                <GuestMessage>
                  회원가입을 통해 문제를 더 만들고<br />
                  복습도 할 수 있어요!
                </GuestMessage>
              </>
            )}
          </ModalContent>
        </ResultModal>
      )}
    </QuizContainer>
  );
};

export default QuizPage;

const ExplanationBox = styled.div`
  width: 976px;
  min-height: 174px;
  background-color: #ffffff;
  border: 1px solid #dedede;
  border-radius: 16px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);
  padding: 40px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ExplanationSummary = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  color: #30a10e;
  margin-bottom: 0;
`;

const ExplanationContent = styled.div<{ isExplanation?: boolean }>`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.5;
  color: ${(props) => props.isExplanation ? "#222222" : "#777777"};
`;

const NextButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  width: 976px;
`;
