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
  text-align: center;
  margin: 0;
`;

const BookIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2eb05b 0%, #30a10e 100%);
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    width: 20px;
    height: 24px;
    background-color: #ffffff;
    border-radius: 2px;
  }

  &::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 2px;
    background-color: #ffffff;
    border-radius: 1px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
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
  grid-template-columns: repeat(3, 312px);
  gap: 20px;
  justify-content: center;
  max-width: 1000px;
  margin: 0 auto;
`;

const ProblemCard = styled.div<{ isHovered?: boolean }>`
  width: 312px;
  height: 120px;
  background-color: #ffffff;
  border: 1px solid ${(props) => (props.isHovered ? "#30A10E" : "#ededed")};
  border-radius: 12px;
  box-shadow: ${(props) =>
    props.isHovered
      ? "4px 4px 12px 0px rgba(48, 161, 14, 0.04)"
      : "4px 4px 12px 0px rgba(0, 0, 0, 0.04)"};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 40px 26px;

  &:hover {
    border-color: #30a10e;
    box-shadow: 4px 4px 12px 0px rgba(48, 161, 14, 0.04);
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const IconAndDateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CalendarIcon = styled.div`
  width: 28px;
  height: 28px;
  background-color: #ffffff;
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    width: 21px;
    height: 21px;
    background-color: #e4e4e4;
    border-radius: 2px;
  }

  &::after {
    content: "";
    position: absolute;
    width: 15px;
    height: 12px;
    background-color: #e4e4e4;
    border-radius: 1px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const DateText = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  color: #222222;
`;

const ProblemHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [problemCards, setProblemCards] = useState<ProblemCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
        setError(
          err instanceof Error
            ? err.message
            : "문제를 불러오는 중 오류가 발생했습니다"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProblemHistory();
  }, []);

  const handleCardClick = (card: ProblemCard) => {
    navigate(`/history/${card.date}`);
  };

  const handleCardHover = (cardId: string) => {
    setHoveredCard(cardId);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
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
        <TitleSection>
          <Title>복습하고 싶은 문제 다 모아봤어요</Title>
          <BookIcon />
        </TitleSection>
        <ProblemGrid>
          {problemCards.map((card) => (
            <ProblemCard
              key={card.id}
              onClick={() => handleCardClick(card)}
              onMouseEnter={() => handleCardHover(card.id)}
              onMouseLeave={handleCardLeave}
              isHovered={hoveredCard === card.id}
            >
              <CardContent>
                <IconAndDateContainer>
                  <CalendarIcon />
                  <DateText>{card.date}</DateText>
                </IconAndDateContainer>
              </CardContent>
            </ProblemCard>
          ))}
        </ProblemGrid>
      </ContentContainer>
    </PageContainer>
  );
};

export default ProblemHistoryPage;
