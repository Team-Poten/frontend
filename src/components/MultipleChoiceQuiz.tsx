import React, { useState } from "react";
import styled from "styled-components";
import {
  Question,
  submitGuestAnswer,
  submitAnswer,
  GuestAnswerResponse,
  AnswerResponse,
} from "../services/api";

interface MultipleChoiceQuizProps {
  questions: Question[];
  onBack: () => void;
  onQuestionChange?: (newIndex: number) => void;
  currentQuestionIndex?: number;
  allQuestionStates?: { [key: number]: any };
  updateAllQuestionStates?: (questionId: number, updates: any) => void;
  calculateTotalCorrect?: () => number;
  onCreateMoreQuestions?: () => void; // 새로운 prop 추가
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
  padding: 2.5rem 0; /* 40px 0 */
  min-height: calc(100vh - 11.25rem); /* 180px */
`;

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 2rem; /* 32px */
  line-height: 1.4;
  color: #222222;
  text-align: left;
  margin-bottom: 2.5rem; /* 40px */
  max-width: 61rem; /* 976px */
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem; /* 12px */
`;

const TitleIcon = styled.img`
  width: 2.5rem; /* 40px */
  height: 2.5rem; /* 40px */
  object-fit: contain;
`;

const ProgressContainer = styled.div`
  width: 61rem; /* 976px */
  margin-bottom: 2.5rem; /* 40px */
  position: relative;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 1rem; /* 16px */
  background-color: #efefef;
  border-radius: 1rem; /* 16px */
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background-color: #30a10e;
  border-radius: 1rem; /* 16px */
  transition: width 0.3s ease;
`;

const ProgressText = styled.div<{ progress: number }>`
  text-align: center;
  margin-top: 0.625rem; /* 10px */
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 1.125rem; /* 18px */
  color: #30a10e;
  position: absolute;
  top: 1rem; /* 16px */
  left: ${(props) => props.progress}%;
  transform: translateX(-50%);
  transition: left 0.3s ease;
`;

const QuestionCard = styled.div<{ isCorrect?: boolean; showResult?: boolean }>`
  width: 61rem; /* 976px */
  min-height: 11.25rem; /* 180px - 최소 높이 줄임 */
  margin-top: 1.5rem; /* 24px */
  background-color: #ffffff;
  border: 0.0625rem solid
    ${(props /* 1px */) =>
      props.showResult ? (props.isCorrect ? "#2473FC" : "#FF243E") : "#dedede"};
  border-radius: 1rem; /* 16px */
  box-shadow: 0.25rem 0.25rem 0.75rem rgba(0, 0, 0, 0.04); /* 4px 4px 12px */
  padding: 2rem; /* 32px - 패딩 줄임 (40px -> 32px) */
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
    props.showResult ? (props.isCorrect ? "#2473FC" : "#FF243E") : "#30a10e"};
  position: relative;
  display: inline-block;
  margin-right: 0.5rem; /* 8px */
  transition: color 0.3s ease;
`;

const QuestionText = styled.h2<{ isCorrect?: boolean; showResult?: boolean }>`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 1.125rem; /* 18px - 폰트 크기 줄임 (20px -> 18px) */
  line-height: 1.4;
  color: ${(props) =>
    props.showResult ? (props.isCorrect ? "#2473FC" : "#FF243E") : "#222222"};
  margin: 0;
  text-align: left;
  transition: color 0.3s ease;
`;

const AnswerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* 12px - 간격 줄임 (16px -> 12px) */
  margin-top: 2rem; /* 32px - 마진 줄임 (40px -> 32px) */
`;

const AnswerButton = styled.button<{
  selected?: boolean;
  isCorrect?: boolean;
  showResult?: boolean;
}>`
  width: 100%;
  min-height: 4rem; /* 64px - 높이 줄임 (80px -> 64px) */
  background-color: #ffffff;
  border: 0.125rem solid #ededed; /* 2px */
  border-radius: 0.75rem; /* 12px */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  padding: 1rem; /* 16px - 패딩 줄임 (20px -> 16px) */
  text-align: left;

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

const CheckboxIcon = styled.div<{
  selected?: boolean;
  isCorrect?: boolean;
  showResult?: boolean;
}>`
  width: 1.25rem; /* 20px - 크기 줄임 (24px -> 20px) */
  height: 1.25rem; /* 20px - 크기 줄임 (24px -> 20px) */
  border: 0.125rem solid #ededed; /* 2px */
  border-radius: 0.25rem; /* 4px */
  margin-right: 0.75rem; /* 12px - 마진 줄임 (16px -> 12px) */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;

  ${(props) =>
    props.selected &&
    !props.showResult &&
    `
    border-color: #30a10e;
    background-color: #30a10e;
  `}

  ${(props) =>
    props.showResult &&
    props.isCorrect &&
    `
    border-color: #2473FC;
    background-color: #2473FC;
  `}

  ${(props) =>
    props.showResult &&
    !props.isCorrect &&
    props.selected &&
    `
    border-color: #FF243E;
    background-color: #FF243E;
  `}
`;

const CheckmarkIcon = styled.div`
  width: 0.625rem; /* 10px - 크기 줄임 (12px -> 10px) */
  height: 0.625rem; /* 10px - 크기 줄임 (12px -> 10px) */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
`;

const AnswerText = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 0.9375rem; /* 15px - 폰트 크기 줄임 (16px -> 15px) */
  line-height: 1.5;
  color: #222222;
`;

const NextButton = styled.button<{
  isSelected?: boolean;
  isLastQuestion?: boolean;
}>`
  background-color: ${(props) =>
    props.isLastQuestion
      ? props.isSelected
        ? "#30a10e"
        : "#b7b7b7"
      : props.isSelected
        ? "#30a10e"
        : "#b7b7b7"};
  color: #ffffff;
  border: ${
    (props) =>
      props.isLastQuestion
        ? props.isSelected
          ? "0.0625rem solid #30a10e"
          : "none" /* 1px */
        : props.isSelected
          ? "0.0625rem solid #30a10e"
          : "none" /* 1px */
  };
  border-radius: 0.375rem; /* 6px */
  padding: 0.75rem 1rem; /* 12px 16px */
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 1rem; /* 16px */
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.isLastQuestion
        ? props.isSelected
          ? "#2a8f0c"
          : "#a0a0a0"
        : props.isSelected
          ? "#2a8f0c"
          : "#a0a0a0"};
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const CharacterImage = styled.img<{ progress: number }>`
  width: 2.5rem; /* 40px */
  height: 2.25rem; /* 36px */
  object-fit: cover;
  border-radius: 0.5rem; /* 8px */
  position: absolute;
  top: -0.625rem; /* -10px */
  left: ${(props) => props.progress}%;
  transform: translateX(-50%);
  transition: left 0.3s ease;
`;

const LoadingText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 1rem; /* 16px */
  color: #30a10e;
  text-align: center;
  margin-top: 0.625rem; /* 10px */
`;

const ErrorText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 1rem; /* 16px */
  color: #ff4444;
  text-align: center;
  margin-top: 0.625rem; /* 10px */
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
  border-radius: 1rem; /* 16px */
  padding: 2.5rem; /* 40px */
  max-width: 30rem; /* 480px */
  width: 90%;
  text-align: center;
  box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.2); /* 0 10px 30px */
  position: relative;
`;

const ModalImage = styled.img`
  width: 5rem; /* 80px */
  object-fit: contain;
  margin: 0 auto 1.25rem; /* 20px */
  display: block;
`;

const ModalTitle = styled.h2`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 1.5rem; /* 24px */
  color: #222222;
  margin-bottom: 0.5rem; /* 8px */
`;

const ModalSubtitle = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 1.125rem; /* 18px */
  color: #30a10e;
  margin-bottom: 1rem; /* 16px */
`;

const ResultText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 1.125rem; /* 18px */
  color: #222222e;
  margin-bottom: 1rem; /* 16px */
`;

const GuestMessage = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 0.875rem; /* 14px */
  color: #777777;
  line-height: 1.5;
  margin-top: 1rem; /* 16px */
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.75rem; /* 12px */
  justify-content: center;
  margin-top: 2rem; /* 32px */
`;

const ModalButton = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem; /* 12px 24px */
  border-radius: 0.5rem; /* 8px */
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 0.875rem; /* 14px */
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
    border: 0.0625rem solid #e9ecef; /* 1px */
    
    &:hover {
      background-color: #e9ecef;
    }
  `}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem; /* 16px */
  right: 1rem; /* 16px */
  background: none;
  border: none;
  font-size: 1.5rem; /* 24px */
  color: #999999;
  cursor: pointer;
  padding: 0;
  width: 2rem; /* 32px */
  height: 2rem; /* 32px */
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

const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({
  questions,
  onBack,
  onQuestionChange,
  currentQuestionIndex: externalIndex,
  allQuestionStates,
  updateAllQuestionStates,
  calculateTotalCorrect,
  onCreateMoreQuestions
}) => {
  const [internalQuestionIndex, setInternalQuestionIndex] = useState(0);

  // 외부에서 전달된 인덱스가 있으면 사용, 없으면 내부 상태 사용
  const currentQuestionIndex =
    externalIndex !== undefined ? externalIndex : internalQuestionIndex;
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionStates, setQuestionStates] = useState<{
    [key: number]: QuestionState;
  }>({});
  const [showResultModal, setShowResultModal] = useState(false);

  // questions 배열이 비어있거나 undefined인 경우 처리
  if (!questions || questions.length === 0) {
    return (
      <QuizContainer>
        <MainContent>
          <div style={{ textAlign: "center", padding: "2.5rem" }}>
            {" "}
            {/* 40px */}
            <h2>문제를 불러오는 중...</h2>
            <p>
              문제 데이터가 없습니다. 메인 페이지로 돌아가서 다시 시도해주세요.
            </p>
            <button
              onClick={onBack}
              style={{
                padding: "0.75rem 1.5rem" /* 12px 24px */,
                backgroundColor: "#30a10e",
                color: "white",
                border: "none",
                borderRadius: "0.375rem" /* 6px */,
                cursor: "pointer",
                fontSize: "1rem" /* 16px */,
              }}
            >
              메인으로 돌아가기
            </button>
          </div>
        </MainContent>
      </QuizContainer>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
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
    // 로컬 상태 업데이트
    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        ...updates,
      },
    }));
    
    // 전역 상태도 업데이트
    if (updateAllQuestionStates) {
      updateAllQuestionStates(questionId, updates);
    }
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

    // API 응답의 correct 필드 사용
    const apiCorrect = currentQuestionState.answerResult?.correct;
    return apiCorrect !== undefined ? apiCorrect : false;
  };

  const handleAnswerSelect = async (answer: string) => {
    const questionId: number =
      currentQuestion.questionId || currentQuestionIndex;

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
          result = await submitAnswer(questionId, answer);
        } else {
          result = await submitGuestAnswer(questionId, answer);
        }
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
      }
    }
  };

  const handleNextQuestion = () => {
    const questionId = currentQuestion.questionId || currentQuestionIndex;
    if (!isNaN(questionId)) {
      const currentState = questionStates[questionId];
      if (currentState?.answerResult?.correct) {
        setCorrectAnswers(correctAnswers + 1);
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      if (onQuestionChange) {
        // 외부에서 인덱스를 관리하는 경우
        onQuestionChange(newIndex);
      } else {
        // 내부에서 인덱스를 관리하는 경우
        setInternalQuestionIndex(newIndex);
      }
    } else {
      setShowResultModal(true);
    }
  };

  const handleViewQuestions = () => {
    setShowResultModal(false);
    window.location.href = "/history";
  };

  const handleCreateMoreQuestions = () => {
    // onCreateMoreQuestions가 있으면 그것을 사용하고, 없으면 onBack 사용
    if (onCreateMoreQuestions) {
      setShowResultModal(false);
      onCreateMoreQuestions();
    } else {
      // 기존 로직 유지
      setShowResultModal(false);
      onBack();
    }
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
    onBack();
  };

  // 정답 개수 계산 로직 수정
  const totalCorrect = calculateTotalCorrect ? calculateTotalCorrect() : (() => {
    // calculateTotalCorrect가 없을 때는 로컬 상태로 계산
    return questions.reduce((count, question, index) => {
      const questionId = question.questionId || index;
      const state = questionStates[questionId];
      
      if (!state?.answerResult) return count;
      
      // API 응답의 correct 필드 사용
      const apiCorrect = state.answerResult.correct;
      return count + (apiCorrect !== undefined ? (apiCorrect ? 1 : 0) : 0);
    }, 0);
  })();

  // 객관식 옵션 생성 (4개)
  const getOptions = () => {
    // API에서 받은 옵션이 있으면 사용, 없으면 기본 옵션 생성
    if (currentQuestion.options && Array.isArray(currentQuestion.options)) {
      return currentQuestion.options;
    }

    // 기본 옵션 (A, B, C, D)
    return ["A", "B", "C", "D"];
  };

  return (
    <QuizContainer>
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
            width: "61rem" /* 976px */,
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
              {getOptions().map((option, index) => (
                <AnswerButton
                  key={index}
                  selected={currentQuestionState.selectedAnswer === option}
                  isCorrect={
                    currentQuestionState.selectedAnswer === option &&
                    isAnswerCorrect()
                  }
                  showResult={currentQuestionState.showResult}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={
                    currentQuestionState.showResult ||
                    currentQuestionState.isLoading
                  }
                >
                  <CheckboxIcon
                    selected={currentQuestionState.selectedAnswer === option}
                    isCorrect={
                      currentQuestionState.selectedAnswer === option &&
                      isAnswerCorrect()
                    }
                    showResult={currentQuestionState.showResult}
                  >
                    {currentQuestionState.selectedAnswer === option && (
                      <CheckmarkIcon />
                    )}
                  </CheckboxIcon>
                  <AnswerText>{option}</AnswerText>
                </AnswerButton>
              ))}
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
                  정답 : {currentQuestion.answer}
                </ExplanationContent>
              </ExplanationBox>
            )}
        </div>
      </MainContent>

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
                    (정답{totalCorrect}, 오답{questions.length - totalCorrect})
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
                    (정답{totalCorrect}, 오답{questions.length - totalCorrect})
                  </span>
                </ResultText>
                <GuestMessage>
                  회원가입을 통해 문제를 더 만들고
                  <br />
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

export default MultipleChoiceQuiz;

const ExplanationBox = styled.div`
  width: 61rem; /* 976px */
  min-height: 8.75rem; /* 140px - 높이 줄임 (174px -> 140px) */
  background-color: #ffffff;
  border: 0.0625rem solid #dedede; /* 1px */
  border-radius: 1rem; /* 16px */
  box-shadow: 0.25rem 0.25rem 0.75rem rgba(0, 0, 0, 0.04); /* 4px 4px 12px */
  padding: 2rem; /* 32px - 패딩 줄임 (40px -> 32px) */
  margin-top: 1rem; /* 16px - 마진 줄임 (20px -> 16px) */
  display: flex;
  flex-direction: column;
`;

const ExplanationSummary = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 1.125rem; /* 18px - 폰트 크기 줄임 (20px -> 18px) */
  line-height: 1.4;
  color: #30a10e;
  margin-bottom: 1rem; /* 16px - 마진 줄임 (18px -> 16px) */
`;

const ExplanationContent = styled.div<{ isExplanation?: boolean }>`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 1rem; /* 16px - 폰트 크기 줄임 (18px -> 16px) */
  line-height: 1.5;
  color: ${(props) => (props.isExplanation ? "#222222" : "#777777")};
  margin-bottom: ${(props) =>
    props.isExplanation ? "0.125rem" : "0"}; /* 2px */
`;

const NextButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem; /* 16px - 마진 줄임 (20px -> 16px) */
  width: 61rem; /* 976px */
`;
