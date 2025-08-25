import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: ${(props) => (props.isOpen ? "block" : "none")};
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease-out;
  cursor: pointer;
`;

const Spotlight = styled.div<{ position: { top: string; left: string; width: string; height: string; transform?: string } }>`
  position: absolute;
  top: ${props => props.position.top};
  left: ${props => props.position.left};
  width: ${props => props.position.width};
  height: ${props => props.position.height};
  transform: ${props => props.position.transform || 'none'};
  border: 3px solid #30a10e;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(48, 161, 14, 0.6);
  background: rgba(48, 161, 14, 0.1);
  z-index: 2001;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Tooltip = styled.div<{ position: { top: string; left: string; transform?: string } }>`
  position: absolute;
  top: ${props => props.position.top};
  left: ${props => props.position.left};
  transform: ${props => props.position.transform || 'none'};
  background: #30a10e;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 1rem;
  max-width: 350px;
  z-index: 2002;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.5s ease-out;
  
  &::after {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #30a10e;
  }
`;

const CloseButton = styled.button`
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  background: #30a10e;
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  z-index: 2003;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;

  &:hover {
    background: #2a8f0c;
    transform: scale(1.1);
  }
`;

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightPosition, setSpotlightPosition] = useState({ top: '0px', left: '0px', width: '0px', height: '0px' });
  const [tooltipPosition, setTooltipPosition] = useState({ top: '0px', left: '0px' });

  // 도움말 단계별 설정
  const helpSteps = [
    {
      target: '[data-testid="search-bar"]',
      fallback: '.SearchContainer',
      title: "문제 생성하기",
      description: "이곳에 정리한 내용을 텍스트로 입력하거나 파일을 업로드하면 AI가 자동으로 문제를 만들어줍니다. O/X 문제와 객관식 문제 중 원하는 유형을 선택할 수 있어요!",
      tooltipOffset: 0.5
    },
    {
      target: 'nav button:contains("실전 모의고사")',
      fallback: 'nav button:nth-child(2)',
      title: "실전 모의고사",
      description: "실제 시험과 동일한 환경에서 모의고사를 풀어볼 수 있습니다. 시간 제한과 함께 문제를 풀어보고 실전 감각을 키워보세요!",
      tooltipOffset: 0.5
    },
    {
      target: 'nav button:contains("문제 모아보기")',
      fallback: 'nav button:nth-child(3)',
      title: "문제 모아보기",
      description: "지금까지 생성한 모든 문제들을 한 곳에서 확인할 수 있습니다. 문제를 다시 풀어보거나 수정할 수도 있어요!",
      tooltipOffset: 0.5
    },
    {
      target: 'nav button:contains("틀린문제 풀어보기")',
      fallback: 'nav button:nth-child(4)',
      title: "틀린 문제 풀어보기",
      description: "모의고사나 연습 문제에서 틀렸던 문제들만 따로 모아서 다시 풀어볼 수 있습니다. 취약한 부분을 집중적으로 공부해보세요!",
      tooltipOffset: 0.5
    }
  ];

  const updateSpotlight = (stepIndex: number) => {
    const step = helpSteps[stepIndex];
    let target = null;
    
    if (stepIndex === 0) {
      // 첫 번째 단계: SearchBar 찾기
      target = document.querySelector(step.target) || 
               document.querySelector(step.fallback);
    } else {
      // 나머지 단계: Header의 Navigation 버튼들 찾기
      const navButtons = document.querySelectorAll('nav button');
      if (navButtons.length >= 4) {
        // 문제 만들기(0), 실전 모의고사(1), 문제 모아보기(2), 틀린문제 풀어보기(3)
        target = navButtons[stepIndex];
      }
    }
    
    if (target) {
      const rect = target.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      // 스포트라이트 위치 설정
      setSpotlightPosition({
        top: `${rect.top + scrollTop}px`,
        left: `${rect.left + scrollLeft}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`
      });
      
      // 말풍선 위치를 스포트라이트 아래쪽에 상대적으로 배치
      const tooltipOffset = rect.height * step.tooltipOffset;
      setTooltipPosition({
        top: `${rect.bottom + scrollTop + tooltipOffset}px`,
        left: `${rect.left + scrollLeft + rect.width / 2}px`
      });
    } else {
      // fallback: 화면 중앙에 위치
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const fallbackHeight = 72;
      
      setSpotlightPosition({
        top: `${centerY - fallbackHeight / 2}px`,
        left: `${centerX - 400}px`,
        width: '800px',
        height: `${fallbackHeight}px`
      });
      
      const tooltipOffset = fallbackHeight * step.tooltipOffset;
      setTooltipPosition({
        top: `${centerY + fallbackHeight / 2 + tooltipOffset}px`,
        left: `${centerX}px`
      });
    }
  };

  // 모달이 열릴 때마다 currentStep을 0으로 초기화
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      updateSpotlight(0);
    }
  }, [isOpen]);

  // currentStep이 변경될 때마다 스포트라이트 업데이트
  useEffect(() => {
    if (isOpen) {
      updateSpotlight(currentStep);
    }
  }, [currentStep]);

  // 윈도우 리사이즈 시 위치 재계산
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        updateSpotlight(currentStep);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, currentStep]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    // CloseButton 클릭 시에는 다음 단계로 넘어가지 않음
    if ((e.target as Element).closest('button')) {
      return;
    }
    
    // 다음 단계로 넘어가기
    if (currentStep < helpSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 마지막 단계에서는 모달 닫기
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentHelpStep = helpSteps[currentStep];

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <CloseButton onClick={onClose}>×</CloseButton>
      
      {/* 현재 단계에 따른 스포트라이트 */}
      <Spotlight position={spotlightPosition} />
      <Tooltip position={{ 
        top: tooltipPosition.top, 
        left: tooltipPosition.left, 
        transform: 'translateX(-50%)' 
      }}>
        <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
          {currentHelpStep.title}
        </div>
        {currentHelpStep.description}
        <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.9 }}>
          {currentStep < helpSteps.length - 1 ? '클릭하여 다음 단계로' : '클릭하여 닫기'}
        </div>
      </Tooltip>
    </ModalOverlay>
  );
};

export default HelpModal;
