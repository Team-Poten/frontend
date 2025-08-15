import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DynamicQuiz from "./DynamicQuiz";

const WrongQuizPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // location.state에서 틀린 문제 데이터 가져오기
    if (!location.state?.questions || location.state.questions.length === 0) {
      // 틀린 문제 데이터가 없으면 틀린 문제 페이지로 이동
      navigate("/wrong-problems");
    }
  }, [location.state, navigate]);

  const handleBack = () => {
    navigate("/wrong-problems");
  };

  // 틀린 문제 풀어보기에서 '문제 더 만들기'를 눌렀을 때 메인 화면으로 이동하는 함수
  const handleCreateMoreQuestions = () => {
    navigate("/"); // 메인 화면으로 이동
  };

  // 틀린 문제 데이터가 없으면 로딩 표시
  if (!location.state?.questions || location.state.questions.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Pretendard, sans-serif',
        fontSize: '18px',
        color: '#777777'
      }}>
        틀린 문제를 불러오는 중...
      </div>
    );
  }

  const wrongQuestions = location.state.questions;


  // 첫 번째 문제의 유형을 확인하여 전체 퀴즈의 유형 결정
  // 틀린 문제 모음은 보통 같은 유형의 문제들로 구성되어 있음
  const firstQuestion = wrongQuestions[0];
  
  if (!firstQuestion) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Pretendard, sans-serif',
        fontSize: '18px',
        color: '#777777'
      }}>
        문제 데이터가 없습니다.
      </div>
    );
  }

  // DynamicQuiz를 사용하여 각 문제의 유형에 따라 동적으로 렌더링
  return (
    <DynamicQuiz 
      questions={wrongQuestions} 
      onBack={handleBack}
      onCreateMoreQuestions={handleCreateMoreQuestions} // 새로운 prop 추가
    />
  );
};

export default WrongQuizPage;
