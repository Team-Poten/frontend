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
  background-color: rgba(119, 119, 119, 0.7); // #777777에 0.7 투명도 적용
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  display: flex;
  gap: 2rem; /* 32px */
  justify-content: center;
  align-items: center;
  background: transparent; /* ← 배경 제거 */
  padding: 0; /* ← 패딩 제거 */
  border-radius: 0; /* ← 둥근 모서리 제거 */
  box-shadow: none;
`;

const TypeCard = styled.div<{ isDisabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem; /* 20px - 간격 늘림 (16px -> 20px) */
  padding: 2.5rem 2rem; /* 40px 32px - 패딩 늘림 (32px 24px -> 40px 32px) */
  background-color: #ffffff;
  border: 0.125rem solid
    ${(props) => (props.isDisabled ? "#e0e0e0" : "#ededed")}; /* 2px */
  border-radius: 1.25rem; /* 20px */
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  width: 26.25rem; /* 420px - 너비를 420px로 설정 */
  height: 19.125rem; /* 306px - 높이를 306px로 설정 */
  background-color: #ffffff;
  /* opacity: ${(props) => (props.isDisabled ? 0.6 : 1)};  ← 이 줄 삭제 */
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};

  position: relative; /* 아래 마스크용 */

  /* 비활성 시 흐리게 보이게(배경은 불투명 유지) */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 1.25rem; /* 20px */
    background: ${(p) =>
      p.isDisabled ? "rgba(255,255,255,0.55)" : "transparent"};
    pointer-events: none;
  }
  box-shadow: 0rem 0.5rem 1.5rem rgba(0, 0, 0, 0.15); /* 0px 8px 24px */
  justify-content: center; // 중앙 정렬 추가

  &:hover {
    ${(props) =>
      !props.isDisabled &&
      `
      transform: translateY(-0.25rem); /* -4px */
      box-shadow: 0rem 0.75rem 2rem rgba(0, 0, 0, 0.2); /* 0px 12px 32px */
      border-color: #30a10e;
    `}
  }
`;

const IconContainer = styled.div<{ isDisabled: boolean }>`
  width: 5rem; /* 80px - 크기 늘림 (64px -> 80px) */
  height: 5rem; /* 80px - 크기 늘림 (64px -> 80px) */
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent; // 노란 배경 제거
  border-radius: 1.25rem; /* 20px - 둥글기 늘림 (16px -> 20px) */
  border: none; // 테두리도 제거
`;

const IconImage = styled.img`
  width: 3.125rem; /* 50px */
  height: 3.125rem; /* 50px */
  object-fit: contain;
`;

const OXIconImage = styled.img`
  width: 8rem; /* 128px */
  height: 3.75rem; /* 60px */
  object-fit: contain;
`;

const LightIconImage = styled.img`
  width: 3.75rem; /* 60px */
  height: 3.75rem; /* 60px */
  object-fit: contain;
`;

const TypeTitle = styled.h3<{ isDisabled: boolean }>`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 1.25rem; /* 20px - 폰트 크기 늘림 (18px -> 20px) */
  color: ${(props) => (props.isDisabled ? "#999999" : "#222222")};
  margin: 0;
  text-align: center;
`;

const TypeDescription = styled.p<{ isDisabled: boolean }>`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 0.9375rem; /* 15px - 폰트 크기 늘림 (14px -> 15px) */
  color: ${(props) => (props.isDisabled ? "#cccccc" : "#666666")};
  margin: 0;
  line-height: 1.4;
  text-align: center;
`;

const Tooltip = styled.div`
  position: absolute;
  top: -2.8125rem; /* -45px */
  left: 50%;
  transform: translateX(-50%);
  background-color: #333333;
  color: #ffffff;
  padding: 0.5rem 0.75rem; /* 8px 12px */
  border-radius: 0.25rem; /* 4px */
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 0.875rem; /* 14px */
  line-height: 1.4000000272478377em;
  white-space: pre-line;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
  text-align: center;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 0.3125rem solid transparent; /* 5px */
    border-top-color: #333333;
  }
`;

const CardWrapper = styled.div`
  position: relative;

  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

const QuestionTypeModal: React.FC<QuestionTypeModalProps> = ({
  isOpen,
  onClose,
  onSelectType,
  isLoggedIn,
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
        <CardWrapper>
          <TypeCard
            isDisabled={!isLoggedIn}
            onClick={() => handleCardClick("multiple")}
          >
            <IconContainer isDisabled={!isLoggedIn}>
              <LightIconImage src="/images/icn_light.png" alt="객관식" />
            </IconContainer>
            <TypeTitle isDisabled={!isLoggedIn}>객관식 문제 만들기</TypeTitle>
            <TypeDescription isDisabled={!isLoggedIn}>
              {isLoggedIn
                ? "사지선다형의 객관식 문제를 만들어 드립니다."
                : "회원만 이용 가능합니다."}
            </TypeDescription>
          </TypeCard>
          {!isLoggedIn && (
            <Tooltip>
              {"객관식 문제 만들기는\n회원일 경우만 가능합니다."}
            </Tooltip>
          )}
        </CardWrapper>

        <TypeCard isDisabled={false} onClick={() => handleCardClick("ox")}>
          <IconContainer isDisabled={false}>
            <OXIconImage src="/images/icn_ox.png" alt="OX" />
          </IconContainer>
          <TypeTitle isDisabled={false}>OX 문제 만들기</TypeTitle>
          <TypeDescription isDisabled={false}>
            {isLoggedIn
              ? "간단한 OX 형식의 문제를 만들어 드립니다."
              : "간단한 OX 형식의 문제를 만들어 드립니다."}
          </TypeDescription>
        </TypeCard>
      </ModalContent>
    </ModalOverlay>
  );
};

export default QuestionTypeModal;
