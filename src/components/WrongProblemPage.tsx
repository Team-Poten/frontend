import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  getWrongProblemHistory,
  getWrongProblemHistoryByTopic,
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

const TitleHighlight = styled.span`
  color: #30a10e; // primary 색상
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
  padding: 32px 24px; // 상하 패딩을 48px에서 32px로 줄임
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);
  position: relative;
  min-height: 160px; // 최소 높이를 200px에서 160px로 줄임

  &:hover {
    border-color: #30a10e;
    box-shadow: 4px 4px 16px rgba(48, 161, 14, 0.1);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; // 가운데 정렬
  margin-bottom: 16px;
  margin-top: 20px; // 40px에서 24px로 줄여서 조금 올림
`;

const CardIcon = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
  margin-right: 8px; // 텍스트와의 간격
`;

const CardDate = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500; // 600에서 500으로 변경하여 문제 모아보기와 동일하게
  font-size: 20px;
  color: #222222;
  text-align: center;
`;

const QuestionCount = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 15px; // 14px에서 15px로 조금 키움
  color: #30a10e;
  background-color: #f0f8f0;
  padding: 8px 14px; // 6px 12px에서 8px 14px로 조금 키움
  border-radius: 6px; // 16px에서 6px로 줄임
  position: absolute;
  bottom: 16px;
  right: 16px;
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

const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

const FilterSelect = styled.select`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #222222;
  background-color: #ffffff;
  border: 1px solid #ededed;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #30a10e;
  }

  &:focus {
    outline: none;
    border-color: #30a10e;
    box-shadow: 0 0 0 2px rgba(48, 161, 14, 0.1);
  }
`;

const WrongProblemPage: React.FC = () => {
  const navigate = useNavigate();
  const [wrongProblemCards, setWrongProblemCards] = useState<WrongProblemCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'date' | 'topic'>('date');

  useEffect(() => {
    fetchWrongProblems();
  }, [filterType]);

  const fetchWrongProblems = async () => {
    try {
      setLoading(true);
      let data: ProblemHistoryResponse[];
      
      if (filterType === 'date') {
        data = await getWrongProblemHistory();
      } else {
        data = await getWrongProblemHistoryByTopic();
      }
      
      // 날짜별 또는 주제별로 그룹화하여 카드 생성
      const cards: WrongProblemCard[] = data.map((item: ProblemHistoryResponse) => {
        
        // 주제별일 때는 topic을 사용하고, 없으면 date를 사용
        const displayKey = filterType === 'topic' && item.topic ? item.topic : item.date;
        
        return {
          id: displayKey,
          date: displayKey,
          title: filterType === 'date' 
            ? `${item.date} 틀린 문제` 
            : `${item.topic || item.date} 주제별 틀린 문제`,
          questionCount: item.questions.length,
        };
      });
      
      setWrongProblemCards(cards);
    } catch (error) {
      console.error('API 호출 에러:', error);
      if (error instanceof UnauthorizedError) {
        autoLogout();
      } else {
        setError("틀린 문제 목록을 불러오는 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (displayKey: string) => {
    try {
      // 해당 날짜 또는 주제의 틀린 문제들을 가져와서 QuizPage로 전달
      let data: ProblemHistoryResponse[];
      
      if (filterType === 'date') {
        data = await getWrongProblemHistory();
      } else {
        data = await getWrongProblemHistoryByTopic();
      }
      
      // 주제별일 때는 topic으로 찾고, 날짜별일 때는 date로 찾기
      const targetItem = data.find((item: ProblemHistoryResponse) => {
        if (filterType === 'topic') {
          return item.topic === displayKey || item.date === displayKey;
        } else {
          return item.date === displayKey;
        }
      });
      
      if (targetItem && targetItem.questions.length > 0) {
        // 틀린 문제들을 QuizPage에서 사용할 수 있는 형태로 변환
        const wrongQuestions = targetItem.questions.map(q => ({
          questionId: q.questionId,
          question: q.question,
          type: q.type || "TRUE_FALSE",
          options: q.options || [],
          answer: q.answer,
          explanation: q.explanation,
        }));
        
        // QuizPage로 이동하면서 틀린 문제들 전달
        navigate('/wrong-quiz', { 
          state: { 
            questions: wrongQuestions,
            isWrongProblemMode: true,
            wrongProblemDate: displayKey,
            filterType: filterType
          } 
        });
      }
    } catch (error) {
      console.error("틀린 문제를 불러오는 중 오류:", error);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(event.target.value as 'date' | 'topic');
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
            <Title>
              <TitleHighlight>틀린문제</TitleHighlight> 다시 한번 풀어봐요
            </Title>
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
          <Title>
            <TitleHighlight>틀린문제</TitleHighlight> 다시 한번 풀어봐요
          </Title>
          <BookIcon src="/images/icn_checkbox.png" alt="Book" />
        </TitleSection>
        
        <FilterContainer>
          <FilterSelect value={filterType} onChange={handleFilterChange}>
            <option value="date">날짜순</option>
            <option value="topic">주제순</option>
          </FilterSelect>
        </FilterContainer>
        
        <CardGrid>
          {wrongProblemCards.map((card) => (
            <ProblemCard key={card.id} onClick={() => handleCardClick(card.date)}>
              <CardHeader>
                <CardIcon 
                  src={filterType === 'date' 
                    ? "/images/icn_calendar.png" 
                    : "/images/icn_note.png"
                  } 
                  alt={filterType === 'date' ? "Calendar" : "Book"} 
                />
                <CardDate>{card.date}</CardDate>
              </CardHeader>
              
              <QuestionCount>틀린문제 {card.questionCount}개</QuestionCount>
            </ProblemCard>
          ))}
        </CardGrid>
      </ContentContainer>
    </PageContainer>
  );
};

export default WrongProblemPage;
