import React, { useState, useEffect } from "react";
import { Question } from "../services/api";
import Quiz from "./Quiz";
import MultipleChoiceQuiz from "./MultipleChoiceQuiz";

interface DynamicQuizProps {
  questions: Question[];
  onBack: () => void;
  onCreateMoreQuestions?: () => void; // 새로운 prop 추가
}

const DynamicQuiz: React.FC<DynamicQuizProps> = ({ 
  questions, 
  onBack, 
  onCreateMoreQuestions 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allQuestionStates, setAllQuestionStates] = useState<{
    [key: number]: any;
  }>({});

  const currentQuestion = questions[currentQuestionIndex];

  // 모든 문제의 상태를 통합 관리하는 함수
  const updateAllQuestionStates = (questionId: number, updates: any) => {
    setAllQuestionStates((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        ...updates,
      },
    }));
  };

  // 전체 정답 개수 계산
  const calculateTotalCorrect = () => {
    return questions.reduce((count, question, index) => {
      const questionId = question.questionId || index;
      const state = allQuestionStates[questionId];
      
      if (!state?.answerResult) return count;
      
      // API 응답의 correct 필드 사용
      const apiCorrect = state.answerResult.correct;
      
      if (apiCorrect !== undefined) {
        return count + (apiCorrect ? 1 : 0);
      }
      
      // API 응답이 없는 경우 직접 비교
      if (question.type === "MULTIPLE_CHOICE") {
        const selectedAnswer = state.selectedAnswer;
        const correctAnswer = question.answer;
        return count + (selectedAnswer === correctAnswer ? 1 : 0);
      } else {
        // O/X 퀴즈의 경우
        const selectedAnswer = state.selectedAnswer;
        const correctAnswer = question.answer;
        
        const answerMapping: { [key: string]: string } = {
          O: "TRUE",
          X: "FALSE",
        };
        
        const mappedSelectedAnswer = answerMapping[selectedAnswer || ""];
        const isCorrect = mappedSelectedAnswer === correctAnswer;
        return count + (isCorrect ? 1 : 0);
      }
    }, 0);
  };

  // 현재 문제의 유형에 따라 적절한 컴포넌트 렌더링
  if (currentQuestion?.type === "MULTIPLE_CHOICE") {
    return (
      <MultipleChoiceQuiz 
        questions={questions} 
        onBack={onBack}
        onCreateMoreQuestions={onCreateMoreQuestions} // 새로운 prop 전달
        onQuestionChange={(newIndex) => setCurrentQuestionIndex(newIndex)}
        currentQuestionIndex={currentQuestionIndex}
        allQuestionStates={allQuestionStates}
        updateAllQuestionStates={updateAllQuestionStates}
        calculateTotalCorrect={calculateTotalCorrect}
      />
    );
  } else {
    return (
      <Quiz 
        questions={questions} 
        onBack={onBack}
        onCreateMoreQuestions={onCreateMoreQuestions} // 새로운 prop 전달
        onQuestionChange={(newIndex) => setCurrentQuestionIndex(newIndex)}
        currentQuestionIndex={currentQuestionIndex}
        allQuestionStates={allQuestionStates}
        updateAllQuestionStates={updateAllQuestionStates}
        calculateTotalCorrect={calculateTotalCorrect}
      />
    );
  }
};

export default DynamicQuiz;


