import React from "react";
import styled from "styled-components";

interface QuestionTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: "ox" | "multiple") => void;
  isLoggedIn: boolean;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: transparent;
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: center;
`;

const TypeCard = styled.div<{ isActive: boolean; isDisabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 24px;
  background-color: ${props => props.isDisabled ? '#f5f5f5' : '#ffffff'};
  border: 2px solid ${props => props.isActive ? '#30a10e' : props.isDisabled ? '#e0e0e0' : '#ededed'};
  border-radius: 20px;
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  width: 200px;
  opacity: ${props => props.isDisabled ? 0.6 : 1};
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);

  &:hover {
    ${props => !props.isDisabled && `
      transform: translateY(-4px);
      box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.2);
      border-color: #30a10e;
    `}
  }
`;

const IconContainer = styled.div<{ isDisabled: boolean }>`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.isDisabled ? '#f0f0f0' : 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)'};
  border-radius: 16px;
  border: 1px solid ${props => props.isDisabled ? '#e0e0e0' : '#ffd54f'};
`;

const IconImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const TypeTitle = styled.h3<{ isDisabled: boolean }>`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.isDisabled ? '#999999' : '#222222'};
  margin: 0;
`;

const TypeDescription = styled.p<{ isDisabled: boolean }>`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: ${props => props.isDisabled ? '#cccccc' : '#666666'};
  margin: 0;
  line-height: 1.4;
`;

const QuestionTypeModal: React.FC<QuestionTypeModalProps> = ({
  isOpen,
  onClose,
  onSelectType,
  isLoggedIn
}) => {
  const handleCardClick = (type: "ox" | "multiple") => {
    // 비회원은 객관식 선택 불가
    if (type === "multiple" && !isLoggedIn) return;
    onSelectType(type);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <TypeCard
          isActive={false}
          isDisabled={!isLoggedIn}
          onClick={() => handleCardClick("multiple")}
        >
          <IconContainer isDisabled={!isLoggedIn}>
            <IconImage src="/images/icn_light.png" alt="객관식" />
          </IconContainer>
          <TypeTitle isDisabled={!isLoggedIn}>객관식 문제 만들기</TypeTitle>
          <TypeDescription isDisabled={!isLoggedIn}>
            {isLoggedIn ? "10개의 객관식 문제를 만들어 드립니다." : "회원만 이용 가능합니다."}
          </TypeDescription>
        </TypeCard>

        <TypeCard
          isActive={false}
          isDisabled={false}
          onClick={() => handleCardClick("ox")}
        >
          <IconContainer isDisabled={false}>
            <IconImage src="/images/icn_ox.png" alt="OX" />
          </IconContainer>
          <TypeTitle isDisabled={false}>OX 문제 만들기</TypeTitle>
          <TypeDescription isDisabled={false}>
            {isLoggedIn ? "10개의 OX 문제를 만들어 드립니다." : "3개의 OX 문제를 만들어 드립니다."}
          </TypeDescription>
        </TypeCard>
      </ModalContent>
    </ModalOverlay>
  );
};

export default QuestionTypeModal;
