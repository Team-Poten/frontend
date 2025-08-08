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
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
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

const CheckIcon = styled.div<{ isCompleted: boolean; isLoading: boolean }>`
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
    display: ${(props) => (props.isCompleted ? "block" : "none")};
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

  // 로딩 상태 관리 (스피너 표시)
  const [step1Loading, setStep1Loading] = useState(false);
  const [step2Loading, setStep2Loading] = useState(false);
  const [step3Loading, setStep3Loading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // 모달이 닫힐 때 상태 초기화
      setStep1Completed(false);
      setStep2Completed(false);
      setStep3Completed(false);
      setStep1Loading(false);
      setStep2Loading(false);
      setStep3Loading(false);
      return;
    }

    let timers: NodeJS.Timeout[] = []; // 모든 타이머 추적
    let isCancelled = false;

    const executeSequence = async () => {
      try {
        // === 1단계: 입력 텍스트 분석 ===
        setStep1Loading(true);

        await new Promise((resolve) => {
          const timer = setTimeout(() => {
            if (!isCancelled) {
              setStep1Loading(false);
              setStep1Completed(true);
            }
            resolve(void 0);
          }, 3000);
          timers.push(timer);
        });

        if (isCancelled) return;

        // === 2단계: 문제 생성 중 ===
        setStep2Loading(true);

        // API 응답 대기
        if (apiPromise) {
          await apiPromise;
        } else {
          await new Promise((resolve) => {
            const timer = setTimeout(resolve, 8000);
            timers.push(timer);
          });
        }

        if (isCancelled) return;

        setStep2Loading(false);
        setStep2Completed(true);

        // === 3단계: 문제 생성 완료 ===
        setStep3Loading(true);

        await new Promise((resolve) => {
          const timer = setTimeout(() => {
            if (!isCancelled) {
              setStep3Loading(false);
              setStep3Completed(true);
            }
            resolve(void 0);
          }, 1000);
          timers.push(timer);
        });

        if (isCancelled) return;

        // === 완료 후 대기 ===
        await new Promise((resolve) => {
          const timer = setTimeout(() => {
            if (!isCancelled) {
              onComplete();
            }
            resolve(void 0);
          }, 2000);
          timers.push(timer);
        });
      } catch (error) {
        if (isCancelled) return;

        console.error("API Error:", error);

        // 에러 시에도 2단계 완료하고 3단계 진행
        setStep2Loading(false);
        setStep2Completed(true);
        setStep3Loading(true);

        await new Promise((resolve) => {
          const timer = setTimeout(() => {
            if (!isCancelled) {
              setStep3Loading(false);
              setStep3Completed(true);
            }
            resolve(void 0);
          }, 1000);
          timers.push(timer);
        });

        if (isCancelled) return;

        await new Promise((resolve) => {
          const timer = setTimeout(() => {
            if (!isCancelled) {
              onComplete();
            }
            resolve(void 0);
          }, 500);
          timers.push(timer);
        });
      }
    };

    executeSequence();

    return () => {
      isCancelled = true;
      timers.forEach((timer) => clearTimeout(timer));
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
              {step1Loading ? (
                <LoadingSpinner />
              ) : (
                <CheckIcon
                  isCompleted={step1Completed}
                  isLoading={step1Loading}
                />
              )}
              <CardText>입력 텍스트 분석</CardText>
            </CardContent>
          </Card>

          <Card isCompleted={step2Completed}>
            <CardContent>
              {step2Loading ? (
                <LoadingSpinner />
              ) : (
                <CheckIcon
                  isCompleted={step2Completed}
                  isLoading={step2Loading}
                />
              )}
              <CardText>문제 생성 중...</CardText>
            </CardContent>
          </Card>

          <Card isCompleted={step3Completed}>
            <CardContent>
              {step3Loading ? (
                <LoadingSpinner />
              ) : (
                <CheckIcon
                  isCompleted={step3Completed}
                  isLoading={step3Loading}
                />
              )}
              <CardText>문제 생성 완료!</CardText>
            </CardContent>
          </Card>
        </CardsContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default LoadingModal;
