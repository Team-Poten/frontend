import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

interface LoadingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  apiPromise?: Promise<any> | null;
  variant?: "default" | "mockExam"; // 새로운 prop 추가
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(248, 249, 250, 0.8);
  backdrop-filter: blur(1.125rem); /* 18px */
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 49.375rem; /* 790px */
  height: 14.1875rem; /* 227px */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem; /* 12px */
  margin-bottom: 3.125rem; /* 50px */
`;

const Title = styled.h2`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 1.75rem; /* 28px */
  color: #222222;
  margin: 0;
  text-align: center;
`;

const Subtitle = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 1.125rem; /* 18px */
  color: #777777;
  margin: 0;
  text-align: center;
  white-space: pre-line;
`;

const CardsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem; /* 20px */
`;

const Card = styled.div<{ isCompleted: boolean }>`
  width: 15.625rem; /* 250px */
  padding: 1.5rem 1.625rem; /* 24px 26px */
  background-color: #ffffff;
  border: 0.0625rem solid #ededed; /* 1px */
  border-radius: 0.75rem; /* 12px */
  box-shadow: 0.25rem 0.25rem 0.75rem rgba(0, 0, 0, 0.04); /* 4px 4px 12px */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem; /* 12px */
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; /* 16px */
`;

const LoadingSpinner = styled.div`
  width: 1.75rem; /* 28px */
  height: 1.75rem; /* 28px */
  border: 0.125rem solid #f6fbf4; /* 2px */
  border-top: 0.125rem solid #30a10e; /* 2px */
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
  width: 1.75rem; /* 28px */
  height: 1.75rem; /* 28px */
  background-color: #f6fbf4;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    width: 0.75rem; /* 12px */
    height: 0.5rem; /* 8px */
    border-left: 0.125rem solid #30a10e; /* 2px */
    border-bottom: 0.125rem solid #30a10e; /* 2px */
    transform: rotate(-45deg) translate(0.0625rem, -0.0625rem); /* 1px, -1px */
  }
`;

const PlaceholderIcon = styled.div`
  width: 1.75rem; /* 28px */
  height: 1.75rem; /* 28px */
  background-color: #fafafa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardText = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 1.125rem; /* 18px */
  color: #222222;
`;

const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  onComplete,
  apiPromise,
  variant = "default",
}) => {
  const [step1Loading, setStep1Loading] = useState(false);
  const [step1Completed, setStep1Completed] = useState(false);
  const [step2Loading, setStep2Loading] = useState(false);
  const [step2Completed, setStep2Completed] = useState(false);
  const [step3Loading, setStep3Loading] = useState(false);
  const [step3Completed, setStep3Completed] = useState(false);

  const apiPromiseRef = useRef(apiPromise);
  const apiCompletedRef = useRef(false);

  // apiPromise가 변경될 때마다 ref 업데이트
  useEffect(() => {
    apiPromiseRef.current = apiPromise;
    if (apiPromise) {
      // API Promise가 설정되면 완료 상태를 추적
      apiPromise.then(() => {
        apiCompletedRef.current = true;
      }).catch(() => {
        apiCompletedRef.current = true;
      });
    }
  }, [apiPromise]);

  useEffect(() => {
    if (!isOpen) {
      setStep1Loading(false);
      setStep1Completed(false);
      setStep2Loading(false);
      setStep2Completed(false);
      setStep3Loading(false);
      setStep3Completed(false);
      apiCompletedRef.current = false;
      return;
    }

    let timers: NodeJS.Timeout[] = [];
    let isCancelled = false;

    const executeSequence = async () => {
      try {
        // Step 1: 왼쪽 카드부터 시작 (2초 로딩)
        setStep1Loading(true);
        await new Promise((resolve) => {
          const timer = setTimeout(() => {
            if (!isCancelled) {
              setStep1Loading(false);
              setStep1Completed(true);
              setStep2Loading(true); // 2번 카드 로딩 시작
            }
            resolve(void 0);
          }, 2000); // 2초 로딩
          timers.push(timer);
        });

        if (isCancelled) return;

        // Step 2: API 응답 완료까지 대기
        while (!apiCompletedRef.current && !isCancelled) {
          await new Promise(resolve => setTimeout(resolve, 100)); // 100ms마다 체크
        }

        if (isCancelled) return;

        setStep2Loading(false);
        setStep2Completed(true);
        setStep3Loading(true); // 3번 카드 로딩 시작

        if (isCancelled) return;
        
        // Step 3: 1초 로딩
        await new Promise((resolve) => {
          const timer = setTimeout(() => {
            if (!isCancelled) {
              setStep3Loading(false);
              setStep3Completed(true);
            }
            resolve(void 0);
          }, 1000); // 1초 로딩
          timers.push(timer);
        });

        if (isCancelled) return;

        // 1초 체크 표시 후 완료
        await new Promise((resolve) => {
          const timer = setTimeout(() => {
            if (!isCancelled) {
              onComplete();
            }
            resolve(void 0);
          }, 1000); // 1초 체크 표시
          timers.push(timer);
        });
      } catch (error) {
        // 에러 시에도 동일한 플로우
        if (!isCancelled) {
          setStep2Loading(false);
          setStep2Completed(true);
          setStep3Loading(true);
        }

        if (isCancelled) return;
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
  }, [isOpen, onComplete]);

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        <TitleSection>
          <Title>AI가 문제를 만드는 중이에요...</Title>
          <Subtitle>
            {variant === "mockExam" 
              ? `잠시만 기다려주세요!\n이 작업은 최대 5분까지 소요될 수 있어요.`
              : `잠시만 기다려주세요!\n이 작업은 최대 2분까지 소요될 수 있어요.`
            }
          </Subtitle>
        </TitleSection>

        <CardsContainer>
          <Card isCompleted={step1Completed}>
            <CardContent>
              {step1Completed ? (
                <CheckIcon />
              ) : step1Loading ? (
                <LoadingSpinner />
              ) : (
                <PlaceholderIcon />
              )}
              <CardText>입력 텍스트 분석</CardText>
            </CardContent>
          </Card>

          <Card isCompleted={step2Completed}>
            <CardContent>
              {step2Completed ? (
                <CheckIcon />
              ) : step2Loading ? (
                <LoadingSpinner />
              ) : (
                <PlaceholderIcon />
              )}
              <CardText>문제 생성 중...</CardText>
            </CardContent>
          </Card>

          <Card isCompleted={step3Completed}>
            <CardContent>
              {step3Completed ? (
                <CheckIcon />
              ) : step3Loading ? (
                <LoadingSpinner />
              ) : (
                <PlaceholderIcon />
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
