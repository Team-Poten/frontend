import React, { useState } from "react";
import { Question } from "../services/api";
import Quiz from "./Quiz";
import MultipleChoiceQuiz from "./MultipleChoiceQuiz";

interface DynamicQuizProps {
  questions: Question[];
  onBack: () => void;
}

const DynamicQuiz: React.FC<DynamicQuizProps> = ({ questions, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  
  

  // 현재 문제의 유형에 따라 적절한 컴포넌트 렌더링
  if (currentQuestion?.type === "MULTIPLE_CHOICE") {
    
    return (
      <MultipleChoiceQuiz 
        questions={questions} 
        onBack={onBack}
        onQuestionChange={(newIndex) => setCurrentQuestionIndex(newIndex)}
        currentQuestionIndex={currentQuestionIndex}
      />
    );
  } else {
    
    return (
      <Quiz 
        questions={questions} 
        onBack={onBack}
        onQuestionChange={(newIndex) => setCurrentQuestionIndex(newIndex)}
        currentQuestionIndex={currentQuestionIndex}
      />
    );
  }
};

export default DynamicQuiz;
