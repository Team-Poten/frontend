import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  getProblemHistory,
  isLoggedIn,
  UnauthorizedError,
  autoLogout,
} from "../services/api";

interface ProblemCard {
  id: string;
  date: string;
  title: string;
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
  text-align: center;
  margin: 0;
`;

const BookIcon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
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
  height: 108px;
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

const CalendarIcon = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
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
          <BookIcon src="/images/icn_book.png" alt="Book" />
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
                  <CalendarIcon src="/images/icn_calendar.png" alt="Calendar" />
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
