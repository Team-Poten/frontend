import React, { useEffect, useState } from "react";
import { Question } from "../services/api";
import Quiz from "./Quiz"; // 기존 OX 문제 풀이 컴포넌트
import MultipleChoiceQuiz from "./MultipleChoiceQuiz"; // 새로운 객관식 문제 풀이 컴포넌트

interface QuizPageProps {
  questions: Question[];
  onBack: () => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ questions, onBack }) => {
  const [questionType, setQuestionType] = useState<"ox" | "multiple">("ox");

  useEffect(() => {
    // 첫 번째 문제를 확인하여 문제 유형 판단
    if (questions && questions.length > 0) {
      const firstQuestion = questions[0];
      console.log("첫 번째 문제:", firstQuestion);
      
      // API 응답에서 문제 유형을 확인
      if (firstQuestion.type === "MULTIPLE_CHOICE") {
        setQuestionType("multiple");
      } else {
        setQuestionType("ox");
      }
    }
  }, [questions]);

  // 문제 유형에 따라 적절한 컴포넌트 렌더링
  if (questionType === "multiple") {
    return <MultipleChoiceQuiz questions={questions} onBack={onBack} />;
  } else {
    return <Quiz questions={questions} onBack={onBack} />;
  }
};

export default QuizPage;
