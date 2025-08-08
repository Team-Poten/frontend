import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface LoadingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  apiPromise?: Promise<any> | null;
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
  color: #222222;
  margin: 0;
  text-align: center;
`;

const Subtitle = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 18px;
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
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 28px;
  height: 28px;
  border: 2px solid #f6fbf4;
  border-top: 2px solid #30a10e;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const CheckIcon = styled.div`
  width: 28px;
  height: 28px;
  background-color: #f6fbf4;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    width: 12px;
    height: 8px;
    border-left: 2px solid #30a10e;
    border-bottom: 2px solid #30a10e;
    transform: rotate(-45deg) translate(1px, -1px);
  }
`;

const CardText = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
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
      setStep1Completed(false);
      setStep2Completed(false);
      setStep3Completed(false);
      return;
    }

    let timers: NodeJS.Timeout[] = [];
    let isCancelled = false;

    const executeSequence = async () => {
      try {
        // Step 1
        await new Promise((resolve) => {
          const timer = setTimeout(() => {
            if (!isCancelled) setStep1Completed(true);
            resolve(void 0);
          }, 3000);
          timers.push(timer);
        });

        if (isCancelled) return;

        // Step 2
        if (apiPromise) {
          await apiPromise;
        } else {
          await new Promise((resolve) => {
            const timer = setTimeout(resolve, 8000);
            timers.push(timer);
          });
        }

        if (!isCancelled) setStep2Completed(true);

        // Step 3
        await new Promise((resolve) => {
          const timer = setTimeout(() => {
            if (!isCancelled) setStep3Completed(true);
            resolve(void 0);
          }, 1000);
          timers.push(timer);
        });

        if (!isCancelled) {
          await new Promise((resolve) => {
            const timer = setTimeout(() => {
              if (!isCancelled) onComplete();
              resolve(void 0);
            }, 2000);
            timers.push(timer);
          });
        }
      } catch (error) {
        console.error("API Error:", error);

        setStep2Completed(true);

        await new Promise((resolve) => {
          const timer = setTimeout(() => {
            if (!isCancelled) setStep3Completed(true);
            resolve(void 0);
          }, 1000);
          timers.push(timer);
        });

        await new Promise((resolve) => {
          const timer = setTimeout(() => {
            if (!isCancelled) onComplete();
            resolve(void 0);
          }, 1000);
          timers.push(timer);
        });
      }
    };

    executeSequence();

    return () => {
      isCancelled = true;
      timers.forEach(clearTimeout);
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
              {!step1Completed ? <LoadingSpinner /> : <CheckIcon />}
              <CardText>입력 텍스트 분석</CardText>
            </CardContent>
          </Card>

          <Card isCompleted={step2Completed}>
            <CardContent>
              {!step2Completed ? <LoadingSpinner /> : <CheckIcon />}
              <CardText>문제 생성 중...</CardText>
            </CardContent>
          </Card>

          <Card isCompleted={step3Completed}>
            <CardContent>
              {!step3Completed ? <LoadingSpinner /> : <CheckIcon />}
              <CardText>문제 생성 완료!</CardText>
            </CardContent>
          </Card>
        </CardsContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default LoadingModal;
