import React, { useState } from "react";
import styled from "styled-components";
import { submitGuestAnswer, submitAnswer, isLoggedIn } from "../services/api";

interface Question {
  questionId: number;
  question: string;
  type: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface MultipleChoiceQuizProps {
  questions: Question[];
  onBack: () => void; // onBack prop 추가
}

const QuizContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Pretendard", sans-serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #222222;
  margin-bottom: 8px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
  position: relative;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background-color: #30a10e;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressIcon = styled.div<{ progress: number }>`
  position: absolute;
  left: ${props => (props.progress || 0) - 2}%;
  top: -8px;
  width: 24px;
  height: 24px;
  background-color: #ffd54f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transform: translateX(-50%);
`;

const QuestionContainer = styled.div`
  background-color: #ffffff;
  border: 2px solid #4a90e2;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`;

const QuestionNumber = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #4a90e2;
  margin-bottom: 16px;
`;

const QuestionText = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #222222;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
`;

const OptionButton = styled.button<{ 
  isSelected: boolean; 
  isCorrect?: boolean;
  isAnswered: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background-color: ${props => {
    if (!props.isAnswered) return '#ffffff';
    if (props.isCorrect === true) return '#e8f5e8';
    if (props.isCorrect === false) return '#ffe8e8';
    return '#ffffff';
  }};
  border: 2px solid ${props => {
    if (!props.isAnswered) return props.isSelected ? '#4a90e2' : '#e8e8e8';
    if (props.isCorrect === true) return '#30a10e';
    if (props.isCorrect === false) return '#ff4444';
    return props.isSelected ? '#4a90e2' : '#e8e8e8';
  }};
  border-radius: 12px;
  cursor: ${props => props.isAnswered ? 'default' : 'pointer'};
  transition: all 0.2s ease;
  text-align: left;
  font-size: 16px;
  color: #222222;

  &:hover:not(:disabled) {
    border-color: #4a90e2;
    background-color: #f0f8ff;
  }

  &:disabled {
    cursor: default;
  }
`;

const OptionIcon = styled.div<{ 
  isSelected: boolean; 
  isCorrect?: boolean;
  isAnswered: boolean;
}>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => {
    if (!props.isAnswered) return props.isSelected ? '#4a90e2' : '#e8e8e8';
    if (props.isCorrect === true) return '#30a10e';
    if (props.isCorrect === false) return '#ff4444';
    return props.isSelected ? '#4a90e2' : '#e8e8e8';
  }};
  background-color: ${props => {
    if (!props.isAnswered) return props.isSelected ? '#4a90e2' : 'transparent';
    if (props.isCorrect === true) return '#30a10e';
    if (props.isCorrect === false) return '#ff4444';
    return props.isSelected ? '#4a90e2' : 'transparent';
  }};
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const NextButton = styled.button`
  background-color: #30a10e;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  float: right;

  &:hover {
    background-color: #258a0a;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ExplanationBox = styled.div`
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-top: 24px;
`;

const ExplanationTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #666666;
  margin-bottom: 16px;
`;

const ExplanationText = styled.div`
  font-size: 16px;
  color: #222222;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const CorrectAnswer = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #30a10e;
`;

const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({ questions, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleOptionSelect = async (option: string) => {
    if (isAnswered) return; // 이미 답을 선택한 경우
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    try {
      // 채점 API 호출
      let result;
      if (isLoggedIn()) {
        result = await submitAnswer(currentQuestion.questionId, option);
      } else {
        result = await submitGuestAnswer(currentQuestion.questionId, option);
      }
      
      setIsCorrect(result.isCorrect);
      setShowExplanation(true);
      
      // 사용자 답변 저장
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = option;
      setUserAnswers(newAnswers);
      
      console.log("채점 결과:", result);
    } catch (error) {
      console.error("채점 중 오류:", error);
      // 에러가 발생해도 UI는 계속 진행
      setIsCorrect(option === currentQuestion.answer);
      setShowExplanation(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setIsAnswered(false);
      setIsCorrect(null);
    }
  };

  const isOptionCorrect = (option: string) => {
    if (!isAnswered) return undefined;
    return option === currentQuestion.answer;
  };

  const isOptionSelected = (option: string) => {
    return selectedOption === option;
  };

  // 객관식 보기 생성
  const generateOptions = (question: Question) => {
    if (question.options && question.options.length >= 4) {
      return question.options;
    }
    
    // API에서 보기가 제공되지 않은 경우 기본 보기 생성
    return [
      "보기 1",
      "보기 2", 
      "보기 3",
      "보기 4"
    ];
  };

  const options = generateOptions(currentQuestion);

  // onBack 함수를 사용할 수 있도록 수정
  const handleBackToHome = () => {
    onBack();
  };

  return (
    <QuizContainer>
      <Header>
        <HeaderTitle>지금부터 본격 문제 타임! 집중해서 풀어봐요 📝</HeaderTitle>
        <ProgressBar>
          <ProgressFill progress={progress} />
          <ProgressIcon progress={progress}>🤔</ProgressIcon>
        </ProgressBar>
        <div style={{ fontSize: '14px', color: '#666' }}>
          {Math.round(progress)}% 완료
        </div>
      </Header>

      <QuestionContainer>
        <QuestionNumber>Q{currentQuestionIndex + 1}.</QuestionNumber>
        <QuestionText>{currentQuestion.question}</QuestionText>
        
        <OptionsContainer>
          {options.map((option, index) => (
            <OptionButton
              key={index}
              onClick={() => handleOptionSelect(option)}
              isSelected={isOptionSelected(option)}
              isCorrect={isOptionCorrect(option)}
              isAnswered={isAnswered}
              disabled={isAnswered}
            >
              <OptionIcon 
                isSelected={isOptionSelected(option)}
                isCorrect={isOptionCorrect(option)}
                isAnswered={isAnswered}
              >
                {isOptionCorrect(option) === true ? '✓' : 
                 isOptionCorrect(option) === false ? '✗' : 
                 isOptionSelected(option) ? '●' : ''}
              </OptionIcon>
              {option}
            </OptionButton>
          ))}
        </OptionsContainer>

        {showExplanation && (
          <ExplanationBox>
            <ExplanationTitle>해설 요약</ExplanationTitle>
            <ExplanationText>{currentQuestion.explanation}</ExplanationText>
            <CorrectAnswer>정답 : {currentQuestion.answer}</CorrectAnswer>
          </ExplanationBox>
        )}

        {currentQuestionIndex < questions.length - 1 && (
          <NextButton onClick={handleNextQuestion}>
            다음 문제
          </NextButton>
        )}
      </QuestionContainer>
    </QuizContainer>
  );
};

export default MultipleChoiceQuiz;
