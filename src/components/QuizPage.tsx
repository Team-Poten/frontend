import React, { useState } from "react";
import styled from "styled-components";
import { Question } from "../services/api";
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

const QuestionText = styled.h2`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.4;
  color: #30a10e;
  margin: 0;
  text-align: left;
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

  &:hover {
    border-color: #30a10e;
    background-color: #f8f9fa;
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

const QuizPage: React.FC<QuizPageProps> = ({ questions, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    if (!showResult) {
      setSelectedAnswer(answer);
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuestion.answer) {
      setCorrectAnswers(correctAnswers + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // 퀴즈 완료
      console.log("퀴즈 완료!");
    }
  };

  const handleShowResult = () => {
    setShowResult(true);
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
            <QuestionText>
              Q{currentQuestionIndex + 1}. {currentQuestion.question}
            </QuestionText>
          </div>

          <AnswerContainer>
            <AnswerButton
              selected={selectedAnswer === "TRUE"}
              isCorrect={currentQuestion.answer === "TRUE"}
              showResult={showResult}
              onClick={() => handleAnswerSelect("TRUE")}
            >
              O (참)
            </AnswerButton>
            <AnswerButton
              selected={selectedAnswer === "FALSE"}
              isCorrect={currentQuestion.answer === "FALSE"}
              showResult={showResult}
              onClick={() => handleAnswerSelect("FALSE")}
            >
              X (거짓)
            </AnswerButton>
          </AnswerContainer>

          <div style={{ textAlign: "right" }}>
            {selectedAnswer && !showResult && (
              <NextButton onClick={handleShowResult}>정답 확인</NextButton>
            )}
            {showResult && (
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
