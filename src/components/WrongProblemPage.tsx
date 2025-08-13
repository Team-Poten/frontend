import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  getWrongProblemHistory,
  isLoggedIn,
  UnauthorizedError,
  autoLogout,
  ProblemHistoryResponse,
} from "../services/api";

interface WrongProblemCard {
  id: string;
  date: string;
  title: string;
  questionCount: number;
}

const PageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 180px);
  background-color: #f8f9fa;
  padding: 90px;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1.4;
  color: #222222;
  margin: 0;
`;

const BookIcon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 40px;
`;

const ProblemCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #ededed;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: #30a10e;
    box-shadow: 4px 4px 16px rgba(48, 161, 14, 0.1);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const CardDate = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: #222222;
`;

const QuestionCount = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #30a10e;
  background-color: #f0f8f0;
  padding: 6px 12px;
  border-radius: 16px;
`;

const CardTitle = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #666666;
  line-height: 1.5;
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

const EmptyMessage = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #777777;
  text-align: center;
  margin-top: 100px;
`;

const WrongProblemPage: React.FC = () => {
  const navigate = useNavigate();
  const [wrongProblemCards, setWrongProblemCards] = useState<WrongProblemCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWrongProblems = async () => {
      try {
        setLoading(true);
        const data = await getWrongProblemHistory();
        
        // 날짜별로 그룹화하여 카드 생성
        const cards: WrongProblemCard[] = data.map((item: ProblemHistoryResponse) => ({
          id: item.date,
          date: item.date,
          title: `${item.date} 틀린 문제`,
          questionCount: item.questions.length,
        }));
        
        setWrongProblemCards(cards);
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          autoLogout();
        } else {
          setError("틀린 문제 목록을 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWrongProblems();
  }, []);

  const handleCardClick = async (date: string) => {
    try {
      // 해당 날짜의 틀린 문제들을 가져와서 QuizPage로 전달
      const data = await getWrongProblemHistory();
      const targetDate = data.find((item: ProblemHistoryResponse) => item.date === date);
      
      if (targetDate && targetDate.questions.length > 0) {
        // 틀린 문제들을 QuizPage에서 사용할 수 있는 형태로 변환
        const wrongQuestions = targetDate.questions.map(q => ({
          questionId: q.questionId,
          question: q.question,
          type: q.type || "TRUE_FALSE", // type이 없으면 기본값으로 TRUE_FALSE 설정
          options: q.options || [], // options가 없으면 빈 배열로 설정
          answer: q.answer,
          explanation: q.explanation,
        }));
        
        // QuizPage로 이동하면서 틀린 문제들 전달
        navigate('/wrong-quiz', { 
          state: { 
            questions: wrongQuestions,
            isWrongProblemMode: true,
            wrongProblemDate: date
          } 
        });
      }
    } catch (error) {
      console.error("틀린 문제를 불러오는 중 오류:", error);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentContainer>
          <LoadingMessage>틀린 문제 목록을 불러오는 중...</LoadingMessage>
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

  if (wrongProblemCards.length === 0) {
    return (
      <PageContainer>
        <ContentContainer>
          <TitleSection>
            <Title>틀린 문제 모아보기</Title>
            <BookIcon src="/images/icn_book.png" alt="Book" />
          </TitleSection>
          <EmptyMessage>아직 틀린 문제가 없습니다.</EmptyMessage>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentContainer>
        <TitleSection>
          <Title>틀린 문제 모아보기</Title>
          <BookIcon src="/images/icn_book.png" alt="Book" />
        </TitleSection>
        
        <CardGrid>
          {wrongProblemCards.map((card) => (
            <ProblemCard key={card.id} onClick={() => handleCardClick(card.date)}>
              <CardHeader>
                <CardDate>{card.date}</CardDate>
                <QuestionCount>{card.questionCount}문제</QuestionCount>
              </CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </ProblemCard>
          ))}
        </CardGrid>
      </ContentContainer>
    </PageContainer>
  );
};

export default WrongProblemPage;
