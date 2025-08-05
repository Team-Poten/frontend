import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getProblemHistory, isLoggedIn } from "../services/api";

interface ProblemCard {
  id: string;
  date: string;
  title: string;
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

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 28px;
  color: #222222;
  margin-bottom: 40px;
  text-align: center;
`;

const LoginRequiredMessage = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #777777;
  text-align: center;
  margin-top: 100px;
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
  grid-template-columns: repeat(auto-fit, minmax(312px, 1fr));
  gap: 20px;
  justify-items: center;
  max-width: 1000px;
  margin: 0 auto;
`;

const ProblemCard = styled.div`
  width: 312px;
  height: 120px;
  background-color: #ffffff;
  border: 1px solid #ededed;
  border-radius: 16px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  padding: 0 20px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 6px 6px 16px rgba(0, 0, 0, 0.08);
  }
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 30px;
  position: relative;
`;

const NotepadIcon = styled.div`
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  border-radius: 4px;
  flex-shrink: 0;
  position: relative;
  margin-left: 18px;

  &::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    height: 1px;
    background-color: #d0d0d0;
  }

  &::after {
    content: "";
    position: absolute;
    top: 6px;
    left: 2px;
    right: 2px;
    height: 1px;
    background-color: #d0d0d0;
  }
`;

const DateText = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  color: #222222;
  margin-left: 4px;
`;

const ProblemHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [problemCards, setProblemCards] = useState<ProblemCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblemHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!isLoggedIn()) {
          setError("로그인이 필요합니다");
          setLoading(false);
          return;
        }

        const data = await getProblemHistory();

        // API 응답을 카드 형태로 변환
        const cards: ProblemCard[] = data.map((item, index) => ({
          id: index.toString(),
          date: item.date,
          title: `${item.questions.length}개의 문제`,
        }));

        setProblemCards(cards);
      } catch (err) {
        console.error("Error fetching problem history:", err);
        setError(err instanceof Error ? err.message : "문제를 불러오는 중 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchProblemHistory();
  }, []);

  const handleCardClick = (card: ProblemCard) => {
    navigate(`/history/${card.date}`);
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentContainer>
          <LoadingMessage>문제 목록을 불러오는 중...</LoadingMessage>
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
        <Title>지난 문제 모아보기</Title>
        <ProblemGrid>
          {problemCards.map((card) => (
            <ProblemCard key={card.id} onClick={() => handleCardClick(card)}>
              <CardContent>
                <NotepadIcon />
                <DateText>{card.date}</DateText>
              </CardContent>
            </ProblemCard>
          ))}
        </ProblemGrid>
      </ContentContainer>
    </PageContainer>
  );
};

export default ProblemHistoryPage;
