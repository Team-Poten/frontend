import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  getWrongProblemHistory,
  getWrongProblemHistoryByTopic,
  updateTopic,
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
  gap: 8px; // 4px에서 8px로 증가
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 700; // 700에서 400으로 변경하여 bold 해제
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
  font-weight: 400; // 500에서 400으로 변경하여 bold 해제
  font-size: 15px;
  color: #30a10e;
  background-color: #f0f8f0;
  padding: 10px 18px; // 8px 14px에서 10px 18px로 증가하여 간격 늘림
  border-radius: 6px;
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

const CardActions = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  z-index: 10;
`;

const DotsButton = styled.div`
  font-size: 20px;
  color: #777777;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
    color: #333333;
  }
`;

// 드롭다운 메뉴 스타일 수정
const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #ededed;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: auto; // min-width 제거하고 자동 너비로 설정
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  transition: all 0.2s ease;
  z-index: 20;
  transform-origin: top right;
`;

const DropdownItem = styled.div`
  padding: 10px 12px; // 10px 16px에서 10px 12px로 줄여서 양쪽 여백 최소화
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  color: #222222;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-align: center;
  white-space: nowrap;

  &:hover {
    background-color: #f8f9fa;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const EditModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 16px;
  width: 430px; // 400px에서 430px로 증가
  height: 324px; // 높이 추가
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between; // 내용을 위아래로 분산 배치
`;

const ModalTitle = styled.h3`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 20px;
  color: #222222;
  margin: 0 0 24px 0;
  text-align: center;
`;

const InputGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #555555;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ededed;
  border-radius: 8px;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #30a10e;
    box-shadow: 0 0 0 2px rgba(48, 161, 14, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 12px; // 12px 12px에서 8px 12px로 줄임
  border: none;
  border-radius: 8px;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.variant === 'primary' ? '#30a10e' : '#f0f0f0'};
  color: ${props => props.variant === 'primary' ? 'white' : '#333333'};
  min-width: 60px;
  height: 46px;
  flex: 1;

  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#2a8f0c' : '#e0e0e0'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const WrongProblemPage: React.FC = () => {
  const navigate = useNavigate();
  const [wrongProblemCards, setWrongProblemCards] = useState<WrongProblemCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'date' | 'topic'>('date');
  
  // 주제 수정 관련 상태
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCard, setEditingCard] = useState<WrongProblemCard | null>(null);
  const [newTopic, setNewTopic] = useState('');
  const [updating, setUpdating] = useState(false);
  
  // 드롭다운 메뉴 상태 추가
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

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

  const handleEditTopic = (card: WrongProblemCard) => {
    setEditingCard(card);
    setNewTopic(''); // 기존 주제를 초기값으로 설정하지 않고 빈 문자열로 설정
    setShowEditModal(true);
    setOpenDropdownId(null);
  };

  // 드롭다운 토글 함수 추가
  const toggleDropdown = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === cardId ? null : cardId);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdownId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleUpdateTopic = async () => {
    if (!editingCard || !newTopic.trim()) return;

    try {
      setUpdating(true);
      
      // 해당 카드의 문제 ID들을 가져오기 위해 API 호출
      let data: ProblemHistoryResponse[];
      
      if (filterType === 'date') {
        data = await getWrongProblemHistory();
      } else {
        data = await getWrongProblemHistoryByTopic();
      }
      
      // 해당 날짜/주제의 문제들을 찾기
      const targetItem = data.find((item: ProblemHistoryResponse) => {
        if (filterType === 'topic') {
          return item.topic === editingCard.date || item.date === editingCard.date;
        } else {
          return item.date === editingCard.date;
        }
      });
      
      if (targetItem && targetItem.questions.length > 0) {
        const questionIds = targetItem.questions.map(q => q.questionId);
        
        // 주제 수정 API 호출
        await updateTopic(newTopic.trim(), questionIds);
        
        // 성공 후 모달 닫고 목록 새로고침
        setShowEditModal(false);
        setEditingCard(null);
        setNewTopic('');
        fetchWrongProblems(); // 목록 새로고침
      }
    } catch (error) {
      console.error("주제 수정 중 오류:", error);
      alert("주제 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingCard(null);
    setNewTopic('');
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
              {/* 주제 수정 버튼 - 주제순일 때만 표시 */}
              {filterType === 'topic' && (
                <CardActions onClick={(e) => e.stopPropagation()}>
                  <DotsButton onClick={(e) => toggleDropdown(card.id, e)}>
                    ⋯
                  </DotsButton>
                  
                  {/* 드롭다운 메뉴 */}
                  <DropdownMenu isOpen={openDropdownId === card.id}>
                    <DropdownItem onClick={() => handleEditTopic(card)}>
                      주제 수정하기
                    </DropdownItem>
                  </DropdownMenu>
                </CardActions>
              )}
              
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

      {/* 주제 수정 모달 */}
      {showEditModal && (
        <EditModal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>주제 수정하기</ModalTitle>
            
            <InputGroup>
              <Label>새로운 주제</Label>
              <Input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder={editingCard?.date || ''} // 기존 주제를 placeholder로 설정
                maxLength={50}
              />
            </InputGroup>
            
            <ButtonGroup>
              <Button variant="secondary" onClick={handleCloseModal}>
                취소
              </Button>
              <Button 
                variant="primary" 
                onClick={handleUpdateTopic}
                disabled={updating || !newTopic.trim()}
              >
                {updating ? '수정 중...' : '수정하기'}
              </Button>
            </ButtonGroup>
          </ModalContent>
        </EditModal>
      )}
    </PageContainer>
  );
};

export default WrongProblemPage;
