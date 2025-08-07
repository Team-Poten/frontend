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
}

const PageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 180px);
  background-color: #f8f9fa;
  padding: 40px;
`;

const ContentContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const DateHeader = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1.399999976158142em;
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
  display: flex;
  gap: 20px;
  justify-content: center;
  max-width: 1000px;
  margin: 0 auto;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 478px;
`;

const ProblemCard = styled.div`
  width: 478px;
  background-color: #ffffff;
  border: 1px solid #dedede;
  border-radius: 12px;
  box-shadow: 4px 4px 12px 0px rgba(0, 0, 0, 0.04);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: fit-content;
`;

const QuestionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const QuestionText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.3999999364217122em;
  color: #222222;
  width: 414px;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const AnswerText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.3999999364217122em;
  color: #222222;
  height: 26px;
`;

const ExplanationSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const ExplanationTitle = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.399999976158142em;
  color: #30a10e;
  width: 100%;
`;

const ExplanationText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.399999976158142em;
  color: #777777;
  width: 414px;
  word-wrap: break-word;
  overflow-wrap: break-word;
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
        const problemList: Problem[] = targetDate.questions.map(
          (question, index) => {
            // TRUE_FALSE 타입의 경우 O/X로 변환
            const answer =
              question.answer === "TRUE"
                ? "O"
                : question.answer === "FALSE"
                  ? "X"
                  : question.answer;

            return {
              id: index.toString(),
              question: question.questionText,
              answer: answer,
              explanation: question.explanation,
            };
          }
        );

        setProblems(problemList);
      } catch (err) {
        console.error("Error fetching problem detail:", err);
        setError(
          err instanceof Error
            ? err.message
            : "문제를 불러오는 중 오류가 발생했습니다"
        );
      } finally {
        setLoading(false);
      }
    };

    if (date) {
      fetchProblemDetail();
    }
  }, [date]);

  // 카드들을 왼쪽과 오른쪽 컬럼으로 나누기
  const leftColumnProblems = problems.filter((_, index) => index % 2 === 0);
  const rightColumnProblems = problems.filter((_, index) => index % 2 === 1);

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
          <Column>
            {leftColumnProblems.map((problem, index) => (
              <ProblemCard key={problem.id}>
                <QuestionSection>
                  <QuestionText>
                    Q{leftColumnProblems.indexOf(problem) * 2 + 1}.{" "}
                    {problem.question}
                  </QuestionText>
                  <AnswerText>정답 : {problem.answer}</AnswerText>
                </QuestionSection>
                <ExplanationSection>
                  <ExplanationTitle>해설 요약</ExplanationTitle>
                  <ExplanationText>{problem.explanation}</ExplanationText>
                </ExplanationSection>
              </ProblemCard>
            ))}
          </Column>
          <Column>
            {rightColumnProblems.map((problem, index) => (
              <ProblemCard key={problem.id}>
                <QuestionSection>
                  <QuestionText>
                    Q{rightColumnProblems.indexOf(problem) * 2 + 2}.{" "}
                    {problem.question}
                  </QuestionText>
                  <AnswerText>정답 : {problem.answer}</AnswerText>
                </QuestionSection>
                <ExplanationSection>
                  <ExplanationTitle>해설 요약</ExplanationTitle>
                  <ExplanationText>{problem.explanation}</ExplanationText>
                </ExplanationSection>
              </ProblemCard>
            ))}
          </Column>
        </ProblemGrid>
      </ContentContainer>
    </PageContainer>
  );
};

export default ProblemDetailPage;
