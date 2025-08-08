import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProblemHistory,
  isLoggedIn,
  UnauthorizedError,
  autoLogout,
} from "../services/api";
import { QuestionDetail } from "../services/api";

interface Problem {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  createdAt: string;
}

interface GroupedProblems {
  timeGroup: string;
  problems: Problem[];
}

const PageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 180px);
  background-color: #f8f9fa;
  padding: 80px;
`;

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  width: 976px;
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

const QuestionNumber = styled.span`
  color: #30a10e;
  font-weight: 500;
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
  color: #777777;
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
  color: #222222;
  width: 414px;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const Divider = styled.div`
  width: 976px;
  height: 1px;
  background-color: #bebebe;
  margin: 20px 0;
`;

const ProblemDetailPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [groupedProblems, setGroupedProblems] = useState<GroupedProblems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // createdAt을 분 단위로 그룹화하는 함수
  const groupProblemsByMinute = (
    questions: QuestionDetail[]
  ): GroupedProblems[] => {
    const groups: { [key: string]: QuestionDetail[] } = {};

    questions.forEach((question) => {
      // createdAt에서 분 단위까지만 추출 (YYYY-MM-DDTHH:MM)
      const createdAt = new Date(question.createdAt);
      const timeGroup = createdAt.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM

      if (!groups[timeGroup]) {
        groups[timeGroup] = [];
      }
      groups[timeGroup].push(question);
    });

    // 시간 순으로 정렬
    return Object.keys(groups)
      .sort()
      .map((timeGroup) => ({
        timeGroup,
        problems: groups[timeGroup].map((question, index) => {
          const answer =
            question.answer === "TRUE"
              ? "O"
              : question.answer === "FALSE"
                ? "X"
                : question.answer;

          return {
            id: `${timeGroup}-${index}`,
            question: question.question,
            answer: answer,
            explanation: question.explanation,
            createdAt: question.createdAt,
          };
        }),
      }));
  };

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
        console.log("******************************");
        console.log(targetDate.questions);
        console.log("******************************");
        // 문제들을 분 단위로 그룹화
        const grouped = groupProblemsByMinute(targetDate.questions);
        setGroupedProblems(grouped);
      } catch (err) {
        console.error("Error fetching problem detail:", err);

        if (err instanceof UnauthorizedError) {
          // 403 에러인 경우 자동 로그아웃 (새로고침 후 Header에서 로그인 모달 자동 열림)
          autoLogout();
          return; // autoLogout에서 새로고침하므로 여기서 종료
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "문제를 불러오는 중 오류가 발생했습니다"
          );
        }
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
        {groupedProblems.map((group, groupIndex) => (
          <React.Fragment key={group.timeGroup}>
            <ProblemGrid>
              <Column>
                {group.problems
                  .filter((_, index) => index % 2 === 0)
                  .map((problem, index) => (
                    <ProblemCard key={problem.id}>
                      <QuestionSection>
                        <QuestionText>
                          <QuestionNumber>Q{index * 2 + 1}.</QuestionNumber>{" "}
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
                {group.problems
                  .filter((_, index) => index % 2 === 1)
                  .map((problem, index) => (
                    <ProblemCard key={problem.id}>
                      <QuestionSection>
                        <QuestionText>
                          <QuestionNumber>Q{index * 2 + 2}.</QuestionNumber>{" "}
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
            {groupIndex < groupedProblems.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </ContentContainer>
    </PageContainer>
  );
};

export default ProblemDetailPage;
