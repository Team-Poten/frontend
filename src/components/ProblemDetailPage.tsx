import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { getProblemHistory, isLoggedIn } from "../services/api";
import { QuestionDetail } from "../services/api";

interface Problem {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  questionStyle?: "bold" | "medium";
  answerColor?: "#777777" | "#222222";
}

const PageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 180px);
  background-color: #f8f9fa;
  padding: 40px;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const DateHeader = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.4;
  color: #222222;
  margin-bottom: 40px;
  text-align: center;
`;

const LoadingMessage = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #777777;
  text-align: center;
  margin-top: 100px;
`;

const ErrorMessage = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #ff4444;
  text-align: center;
  margin-top: 100px;
`;

const ProblemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(441px, 1fr));
  gap: 24px;
  justify-items: center;
  max-width: 1000px;
  margin: 0 auto;
`;

const ProblemCard = styled.div`
  width: 441px;
  min-height: 180px;
  background-color: #ffffff;
  border: 1px solid #dfdfdf;
  border-radius: 16px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const QuestionText = styled.div<{ questionStyle?: "bold" | "medium" }>`
  font-family: "Pretendard", sans-serif;
  font-weight: ${(props) => (props.questionStyle === "bold" ? 700 : 500)};
  font-size: ${(props) => (props.questionStyle === "bold" ? 24 : 20)}px;
  line-height: 1.4;
  color: #30a10e;
  word-break: keep-all;
`;

const ExplanationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ExplanationTitle = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  color: #30a10e;
`;

const ExplanationText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  color: #30a10e;
  word-break: keep-all;
`;

const AnswerText = styled.div<{ color?: "#777777" | "#222222" }>`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.4;
  color: ${(props) => props.color || "#777777"};
  margin-top: 8px;
`;

const ProblemDetailPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblemDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!isLoggedIn()) {
          setError("로그인이 필요합니다");
          setLoading(false);
          return;
        }

        const data = await getProblemHistory();

        // 특정 날짜의 문제 찾기
        const targetDate = data.find((item) => item.date === date);

        if (!targetDate) {
          setError("해당 날짜의 문제를 찾을 수 없습니다");
          setLoading(false);
          return;
        }

        // API 응답을 문제 형태로 변환
        const problemList: Problem[] = targetDate.questions.map((question, index) => {
          // TRUE_FALSE 타입의 경우 O/X로 변환
          const answer =
            question.answer === "TRUE" ? "O" : question.answer === "FALSE" ? "X" : question.answer;

          return {
            id: index.toString(),
            question: question.questionText,
            answer: answer,
            explanation: question.explanation,
            questionStyle: index === 0 || index === 4 ? "bold" : "medium", // Q1, Q5는 bold
            answerColor: index === 0 ? "#777777" : "#222222", // Q1만 회색
          };
        });

        setProblems(problemList);
      } catch (err) {
        console.error("Error fetching problem detail:", err);
        setError(err instanceof Error ? err.message : "문제를 불러오는 중 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    };

    if (date) {
      fetchProblemDetail();
    }
  }, [date]);

  if (loading) {
    return (
      <PageContainer>
        <ContentContainer>
          <LoadingMessage>문제를 불러오는 중...</LoadingMessage>
        </ContentContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ContentContainer>
          <ErrorMessage>{error}</ErrorMessage>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentContainer>
        <DateHeader>{date}</DateHeader>
        <ProblemGrid>
          {problems.map((problem, index) => (
            <ProblemCard key={problem.id}>
              <QuestionText questionStyle={problem.questionStyle}>
                Q{index + 1}. {problem.question}
              </QuestionText>
              <ExplanationSection>
                <ExplanationTitle>해설 요약</ExplanationTitle>
                <ExplanationText>{problem.explanation}</ExplanationText>
                <AnswerText color={problem.answerColor}>정답 : {problem.answer}</AnswerText>
              </ExplanationSection>
            </ProblemCard>
          ))}
        </ProblemGrid>
      </ContentContainer>
    </PageContainer>
  );
};

export default ProblemDetailPage;
