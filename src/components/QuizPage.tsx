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

const QuestionNumber = styled.span<{ isCorrect?: boolean; showResult?: boolean; }>`
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

const QuestionText = styled.span<{ isCorrect?: boolean; showResult?: boolean; }>`
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
  margin-top: 20px;

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

const ExplanationBox = styled.div`
  width: 976px;
  height: 174px;
  background-color: #ffffff;
  border: 1px solid #dedede;
  border-radius: 16px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);
  padding: 40px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const ExplanationSummary = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  color: #30a10e;
  margin-bottom: 13px;
`;

const ExplanationContent = styled.p<{ isExplanation?: boolean }>`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.5;
  color: ${(props) => props.isExplanation ? "#222222" : "#777777"};
  margin: 0;
`;

const NextButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const LoadingModal = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingContent = styled.div`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const LoadingText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  color: #222222;
  margin-bottom: 20px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #30a10e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const QuizPage: React.FC<QuizPageProps> = ({ questions, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<GuestAnswerResponse | AnswerResponse | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const isLoggedIn = (): boolean => {
    return localStorage.getItem("accessToken") !== null;
  };

  const isAnswerCorrect = (): boolean => {
    if (!answerResult) return false;
    
    // API 응답의 correct 필드 사용
    return answerResult.correct ?? false;
  };

  const handleAnswerSelect = async (answer: string) => {
    if (isLoading || showResult) return;

    setSelectedAnswer(answer);
    setIsLoading(true);
    setError(null);

    try {
      let result: GuestAnswerResponse | AnswerResponse;

      if (isLoggedIn()) {
        // 회원인 경우 회원용 API 호출
        console.log(`회원 API 호출: /api/questions/${currentQuestion.questionId}/answer`);
        result = await submitAnswer(currentQuestion.questionId!, answer);
      } else {
        // 비회원인 경우 게스트 API 호출
        console.log(
          `게스트 API 호출: /api/questions/${currentQuestion.questionId}/guest-answer`
        );
        result = await submitGuestAnswer(currentQuestion.questionId!, answer);
      }

      console.log("API 응답 결과:", result); // API 응답 결과 확인
      setAnswerResult(result);
      setShowResult(true);
      setIsLoading(false);
    } catch (err) {
      setError("채점 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsLoading(false);
      console.error("Error submitting answer:", err);
    }
  };

  const handleNextQuestion = () => {
    if (answerResult?.isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setAnswerResult(null);
      setError(null);
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
  const totalCorrect = correctAnswers;
  const totalWrong = questions.length - totalCorrect;

  const getAnswerImagePath = (answer: string, isSelected: boolean, isCorrect: boolean, showResult: boolean) => {
    if (!showResult) {
      return isSelected ? "/images/icn_o_selected.png" : "/images/icn_o.png";
    }

    if (isCorrect) {
      return "/images/icn_o_correct.png";
    } else {
      return isSelected ? "/images/icn_x_wrong.png" : "/images/icn_x.png";
    }
  };

  if (!currentQuestion) {
    return (
      <QuizContainer>
        <Header />
        <MainContent>
          <div>문제를 불러올 수 없습니다.</div>
        </MainContent>
        <Footer />
      </QuizContainer>
    );
  }

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
            <CharacterImage
              src="/images/character.png"
              alt="Character"
              progress={progress}
            />
          </ProgressBar>
          <ProgressText progress={progress}>
            {currentQuestionIndex + 1} / {questions.length}
          </ProgressText>
        </ProgressContainer>

        <QuestionCard 
          isCorrect={isAnswerCorrect()} 
          showResult={showResult}
        >
          <div>
            <QuestionNumber 
              isCorrect={isAnswerCorrect()} 
              showResult={showResult}
            >
              Q{currentQuestionIndex + 1}.문제
            </QuestionNumber>
            <QuestionText 
              isCorrect={isAnswerCorrect()} 
              showResult={showResult}
            >
              {currentQuestion.question}
            </QuestionText>
          </div>

          <AnswerContainer>
            {["O", "X"].map((answer) => (
              <AnswerButton
                key={answer}
                selected={selectedAnswer === answer}
                isCorrect={answer === currentQuestion.answer}
                showResult={showResult}
                onClick={() => handleAnswerSelect(answer)}
                disabled={isLoading || showResult}
              >
                <AnswerImage
                  src={getAnswerImagePath(
                    answer,
                    selectedAnswer === answer,
                    answer === currentQuestion.answer,
                    showResult
                  )}
                  alt={answer}
                />
              </AnswerButton>
            ))}
          </AnswerContainer>
        </QuestionCard>

        {showResult && (
          <ExplanationBox>
            <ExplanationSummary>해설요약</ExplanationSummary>
            <ExplanationContent isExplanation={true}>
              {currentQuestion.explanation}
            </ExplanationContent>
          </ExplanationBox>
        )}

        {showResult && (
          <NextButtonContainer>
            <NextButton
              isSelected={true}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex === questions.length - 1 ? "결과 보기" : "다음 문제"}
            </NextButton>
          </NextButtonContainer>
        )}

        {error && (
          <div style={{ color: "#ff4444", marginTop: "20px", textAlign: "center" }}>
            {error}
          </div>
        )}

        {isLoading && (
          <LoadingModal isOpen={isLoading}>
            <LoadingContent>
              <LoadingText>채점 중입니다...</LoadingText>
              <Spinner />
            </LoadingContent>
          </LoadingModal>
        )}
      </MainContent>

      {showResultModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "40px",
              borderRadius: "16px",
              textAlign: "center",
              maxWidth: "500px",
              width: "90%",
            }}
          >
            {isLoggedIn() ? (
              // 회원용 모달
              <>
                <img
                  src="/images/confetti.png"
                  alt="축하 이미지"
                  style={{ width: "80px", height: "80px", marginBottom: "20px" }}
                />
                <h2 style={{ marginBottom: "10px", color: "#30a10e" }}>
                  모든 문제를 다 풀었어요!
                </h2>
                <h1 style={{ marginBottom: "20px", fontSize: "24px" }}>
                  문제 정답 결과
                </h1>
                <p style={{ marginBottom: "30px", fontSize: "18px" }}>
                  {totalCorrect} / {questions.length}문제{" "}
                  <span style={{ color: "#777777" }}>
                    (정답{totalCorrect}, 오답{totalWrong})
                  </span>
                </p>

                <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                  <button
                    onClick={handleViewQuestions}
                    style={{
                      padding: "12px 24px",
                      border: "1px solid #dedede",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      color: "#222222",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    문제 모아보기
                  </button>
                  <button
                    onClick={handleCreateMoreQuestions}
                    style={{
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: "8px",
                      backgroundColor: "#30a10e",
                      color: "#ffffff",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    문제 더 만들기
                  </button>
                </div>
              </>
            ) : (
              // 비회원용 모달
              <>
                <img
                  src="/images/guest-result.png"
                  alt="결과 이미지"
                  style={{ width: "80px", height: "80px", marginBottom: "20px" }}
                />
                <h1 style={{ marginBottom: "20px", fontSize: "24px" }}>
                  문제 정답 결과
                </h1>
                <p style={{ marginBottom: "20px", fontSize: "18px" }}>
                  {totalCorrect} / {questions.length}문제{" "}
                  <span style={{ color: "#777777" }}>
                    (정답{totalCorrect}, 오답{totalWrong})
                  </span>
                </p>
                <p style={{ color: "#777777", fontSize: "16px", lineHeight: "1.5" }}>
                  회원가입을 통해 문제를 더 만들고<br />
                  복습도 할 수 있어요!
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </QuizContainer>
  );
};

export default QuizPage;
