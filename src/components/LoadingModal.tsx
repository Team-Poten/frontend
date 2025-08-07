import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface LoadingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  apiPromise?: Promise<any> | null; // API 응답을 기다리기 위한 Promise
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(248, 249, 250, 0.8);
  backdrop-filter: blur(18px);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 790px;
  height: 227px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 50px;
`;

const Title = styled.h2`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 28px;
  line-height: 1.4000000272478377em;
  color: #222222;
  margin: 0;
  text-align: center;
`;

const Subtitle = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.3999999364217122em;
  color: #777777;
  margin: 0;
  text-align: center;
  white-space: pre-line;
`;

const CardsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Card = styled.div<{ isCompleted: boolean }>`
  width: 250px;
  padding: 24px 26px;
  background-color: #ffffff;
  border: 1px solid #ededed;
  border-radius: 12px;
  box-shadow: 4px 4px 12px 0px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CheckIcon = styled.div<{ isCompleted: boolean }>`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.isCompleted ? "#f6fbf4" : "transparent"};
  border-radius: 50%;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 14.93px;
    height: 11.2px;
    background-color: ${(props) =>
      props.isCompleted ? "#30a10e" : "transparent"};
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 15 12'%3E%3Cpath d='M1.5 6L5.5 10L13.5 2' stroke='%2330A10E' stroke-width='2' fill='none'/%3E%3C/svg%3E")
      no-repeat center;
    mask-size: contain;
  }
`;

const CardText = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.3999999364217122em;
  color: #222222;
`;

const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  onComplete,
  apiPromise,
}) => {
  const [step1Completed, setStep1Completed] = useState(false);
  const [step2Completed, setStep2Completed] = useState(false);
  const [step3Completed, setStep3Completed] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // 모달이 닫힐 때 상태 초기화
      setStep1Completed(false);
      setStep2Completed(false);
      setStep3Completed(false);
      return;
    }

    // 3초 후 첫 번째 단계 완료 (입력 텍스트 분석)
    const timer1 = setTimeout(() => {
      setStep1Completed(true);
    }, 3000);

    // API 응답을 기다리는 로직
    const handleApiResponse = async () => {
      try {
        if (apiPromise) {
          await apiPromise; // API 응답 대기
        } else {
          // API Promise가 없으면 8초 후 시뮬레이션
          await new Promise((resolve) => setTimeout(resolve, 8000));
        }

        // API 응답 후 두 번째 단계 완료 (문제 생성 중)
        setStep2Completed(true);

        // 1초 후 세 번째 단계 완료 (문제 생성 완료)
        const timer3 = setTimeout(() => {
          setStep3Completed(true);

          // 2초 후 완료 콜백 호출
          const timer4 = setTimeout(() => {
            onComplete();
          }, 2000);

          return () => clearTimeout(timer4);
        }, 1000);

        return () => clearTimeout(timer3);
      } catch (error) {
        console.error("API Error:", error);
        // 에러 발생 시에도 UI는 계속 진행
        setStep2Completed(true);

        const timer3 = setTimeout(() => {
          setStep3Completed(true);

          const timer4 = setTimeout(() => {
            onComplete();
          }, 500);

          return () => clearTimeout(timer4);
        }, 1000);

        return () => clearTimeout(timer3);
      }
    };

    // API 응답 처리 시작
    handleApiResponse();

    return () => {
      clearTimeout(timer1);
    };
  }, [isOpen, onComplete, apiPromise]);

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        <TitleSection>
          <Title>AI가 문제를 만드는 중이에요...</Title>
          <Subtitle>
            {`잠시만 기다려주세요!\n이 작업은 최대 2분까지 소요될 수 있어요.`}
          </Subtitle>
        </TitleSection>

        <CardsContainer>
          <Card isCompleted={step1Completed}>
            <CardContent>
              <CheckIcon isCompleted={step1Completed} />
              <CardText>입력 텍스트 분석</CardText>
            </CardContent>
          </Card>

          <Card isCompleted={step2Completed}>
            <CardContent>
              <CheckIcon isCompleted={step2Completed} />
              <CardText>문제 생성 중...</CardText>
            </CardContent>
          </Card>

          <Card isCompleted={step3Completed}>
            <CardContent>
              <CheckIcon isCompleted={step3Completed} />
              <CardText>문제 생성 완료!</CardText>
            </CardContent>
          </Card>
        </CardsContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default LoadingModal;
