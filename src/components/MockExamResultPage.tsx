import React, { useRef } from "react";
import styled from "styled-components";
import { MockExamQuestion } from "../services/api";

interface MockExamResultPageProps {
  questions: MockExamQuestion[];
  onBack: () => void;
}

const PageContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 170px); /* Header(90px) + Footer(80px) 제외 */
  background-color: #f8f9fa;
  padding: 80px;
  padding-bottom: 100px; /* Footer와의 간격 확보 */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 976px;
  margin-bottom: 40px;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PageTitle = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1.4em;
  color: #222222;
  margin: 0;
`;

const PageSubtitle = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.4em;
  color: #777777;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button<{ variant: "primary" | "secondary" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 8px;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.4em;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) =>
    props.variant === "primary"
      ? `
    background-color: #30a10e;
    color: #ffffff;
    border: none;
    
    &:hover {
      background-color: #2a8f0c;
    }
  `
      : `
    background-color: #ffffff;
    color: #222222;
    border: 1px solid #dedede;
    
    &:hover {
      border-color: #30a10e;
      color: #30a10e;
    }
  `}
`;

const ExamPaperContainer = styled.div`
  width: 976px;
  background-color: #ffffff;
  border: 1px solid #dedede;
  border-radius: 12px;
  box-shadow: 4px 4px 12px 0px rgba(0, 0, 0, 0.04);
  padding: 60px;
`;

const ExamHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ExamHeaderImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  margin-bottom: 40px;
  object-fit: contain;
`;

const ExamInstructionsImage = styled.img`
  width: 448px;
  height: auto;
  margin-bottom: 0;
  object-fit: contain;
`;

// 임시로 기존 구조를 유지하되 스타일을 헤더 이미지처럼 만들기
const ExamHeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 856px;
  padding: 20px;
  background: linear-gradient(to right, #ffffff 0%, #f8f9fa 50%, #ffffff 100%);
  border-radius: 12px;
  margin-bottom: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const HeaderTitle = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4em;
  text-align: center;
  color: #30a10e;
  margin-bottom: 8px;
`;

const HeaderSubtitle = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1.4em;
  text-align: center;
  color: #222222;
  margin-bottom: 20px;
`;

const CharacterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CharacterImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
`;

const InputSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const NameGroup = styled.div`
  display: flex;
  align-items: center;
  width: 144px;
  height: 30px;
`;

const NameLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
  border: 1px solid #222222;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.4em;
  text-align: center;
  color: #222222;
`;

const NameInput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
  width: 100px;
  border: 1px solid #222222;
  border-left: none;
`;

const NumberGroup = styled.div`
  display: flex;
  align-items: center;
  width: 342px;
  height: 30px;
`;

const NumberLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
  border: 1px solid #222222;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.4em;
  text-align: center;
  color: #222222;
`;

const NumberInput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
  width: 30px;
  border: 1px solid #222222;
  border-left: none;
`;

const NoticeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px 12px;
  width: 448px;
  border-bottom: 1px solid #222222;
  margin-bottom: 40px;
`;

const NoticeText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4em;
  text-align: left;
  color: #000000;
  width: 100%;
`;

const DividerLine = styled.div`
  width: 896px;
  height: 2px;
  background-color: #222222;
  margin-bottom: 40px;
`;

const VerticalLine = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  width: 1px;
  height: 100%;
  background-color: #222222;
`;

const QuestionsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 0;
  width: 896px;
`;

const QuestionColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 448px;
`;

// OX 문제 컴포넌트
const TrueFalseQuestion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 12px;
  width: 100%;
`;

const QuestionText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.4em;
  color: #222222;
  width: 100%;
`;

const AnswerText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4em;
  color: #555555;
  width: 100%;
`;

// 객관식 문제 컴포넌트
const MultipleChoiceQuestion = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  padding: 20px 12px;
  width: 100%;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 8px;
  width: 100%;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  gap: 6px;
  width: 100%;
`;

const OptionNumber = styled.div`
  width: 18px;
  height: 18px;
  position: relative;
`;

const OptionCircle = styled.div`
  width: 18px;
  height: 18px;
  border: 1.5px solid #555555;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
`;

const OptionNumberText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 1.4em;
  color: #555555;
  position: absolute;
  top: 0.43px;
  left: 50%;
  transform: translateX(-50%);
`;

const OptionText = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4em;
  color: #555555;
  width: 100%;
`;

// 주관식 문제 컴포넌트
const ShortAnswerQuestion = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  padding: 20px 12px;
  width: 100%;
`;

const AnswerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const AnswerBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: stretch;
  align-self: stretch;
  padding: 12px;
  background-color: #ffffff;
  border: 1px solid #dedede;
  border-radius: 6px;
  min-height: 60px;
`;

const AnswerPlaceholder = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

// 서술형 문제 컴포넌트
const EssayQuestion = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  padding: 20px 12px;
  width: 100%;
`;

const EssayAnswerBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: stretch;
  align-self: stretch;
  padding: 12px;
  background-color: #ffffff;
  border: 1px solid #dedede;
  border-radius: 6px;
  min-height: 120px;
`;

const MockExamResultPage: React.FC<MockExamResultPageProps> = ({
  questions,
  onBack,
}) => {
  const examPaperRef = useRef<HTMLDivElement>(null);
  const answerSheetRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!examPaperRef.current) return;

    try {
      // PDF 라이브러리를 동적으로 import
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = examPaperRef.current;

      // HTML을 캔버스로 변환
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      // PDF 생성
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // PDF 다운로드
      pdf.save("실전모의고사.pdf");
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    }
  };

  const handleExportAnswerSheet = async () => {
    if (!answerSheetRef.current) return;

    try {
      // PDF 라이브러리를 동적으로 import
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = answerSheetRef.current;

      // HTML을 캔버스로 변환
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      // PDF 생성
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // PDF 다운로드
      pdf.save("실전모의고사_해설지.pdf");
    } catch (error) {
      console.error("해설지 PDF 생성 중 오류 발생:", error);
      alert("해설지 PDF 생성 중 오류가 발생했습니다.");
    }
  };

  const renderQuestion = (question: MockExamQuestion, index: number) => {
    const questionNumber = index + 1;

    switch (question.type) {
      case "TRUE_FALSE":
        return (
          <TrueFalseQuestion key={question.questionId}>
            <QuestionText>
              {questionNumber}. {question.question}
            </QuestionText>
            <AnswerText>(O / X)</AnswerText>
          </TrueFalseQuestion>
        );

      case "MULTIPLE_CHOICE":
      case "COMBINATION":
        return (
          <MultipleChoiceQuestion key={question.questionId}>
            <QuestionText>
              {questionNumber}. {question.question}
            </QuestionText>
            <OptionsContainer>
              {question.options.map((option, optionIndex) => (
                <OptionItem key={optionIndex}>
                  <OptionNumber>
                    <OptionCircle />
                    <OptionNumberText>{optionIndex + 1}</OptionNumberText>
                  </OptionNumber>
                  <OptionText>{option}</OptionText>
                </OptionItem>
              ))}
            </OptionsContainer>
          </MultipleChoiceQuestion>
        );

      case "FIND_EXCEPTION":
        return (
          <MultipleChoiceQuestion key={question.questionId}>
            <QuestionText>
              {questionNumber}. {question.question}
            </QuestionText>
            <OptionsContainer>
              {question.options.map((option, optionIndex) => (
                <OptionItem key={optionIndex}>
                  <OptionNumber>
                    <OptionCircle />
                    <OptionNumberText>{optionIndex + 1}</OptionNumberText>
                  </OptionNumber>
                  <OptionText>{option}</OptionText>
                </OptionItem>
              ))}
            </OptionsContainer>
          </MultipleChoiceQuestion>
        );

      case "SHORT_ANSWER":
        return (
          <ShortAnswerQuestion key={question.questionId}>
            <QuestionText>
              {questionNumber}. {question.question}
            </QuestionText>
            <AnswerContainer>
              <AnswerBox>
                <AnswerPlaceholder />
              </AnswerBox>
            </AnswerContainer>
          </ShortAnswerQuestion>
        );

      case "ESSAY":
        return (
          <EssayQuestion key={question.questionId}>
            <QuestionText>
              {questionNumber}. {question.question}
            </QuestionText>
            <AnswerContainer>
              <EssayAnswerBox>
                <AnswerPlaceholder />
              </EssayAnswerBox>
            </AnswerContainer>
          </EssayQuestion>
        );

      default:
        console.warn(`알 수 없는 문제 타입: ${question.type}`);
        return (
          <div
            key={question.questionId}
            style={{
              padding: "20px",
              border: "2px solid red",
              margin: "10px 0",
            }}
          >
            <strong>
              {questionNumber}. {question.question}
            </strong>
            <br />
            <small style={{ color: "red" }}>
              지원하지 않는 문제 타입: {question.type}
            </small>
          </div>
        );
    }
  };

  const renderAnswerSheet = () => {
    const getAnswerDisplay = (question: MockExamQuestion) => {
      if (question.type === 'MULTIPLE_CHOICE' || question.type === 'COMBINATION' || question.type === 'FIND_EXCEPTION') {
        // 객관식인 경우 정답 번호 찾기
        const correctOptionIndex = question.options?.findIndex(option => option === question.answer);
        if (correctOptionIndex !== -1) {
          return (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: '2px solid #000000',
              color: '#000000',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {correctOptionIndex + 1}
            </span>
          );
        }
      } else if (question.type === 'TRUE_FALSE') {
        // OX문제인 경우 TRUE는 O, FALSE는 X로 표시 (동그라미 없이)
        if (question.answer === 'TRUE') {
          return 'O';
        } else if (question.answer === 'FALSE') {
          return 'X';
        }
      }
      return question.answer;
    };

    return (
      <div ref={answerSheetRef} style={{ 
        backgroundColor: '#ffffff',
        border: '1px solid #dedede',
        borderRadius: '12px',
        padding: '60px',
        marginTop: '40px',
        boxShadow: '4px 4px 12px 0px rgba(0, 0, 0, 0.04)',
        width: '976px'
      }}>
        {/* 해설지 헤더 - 크기 더 줄임 */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          position: 'relative'
        }}>
          <img
            src="/images/exam-answer-header.png"
            alt="퀴즐리와 함께하는 시험 준비 - 실전 모의고사 해설 및 답안"
            style={{
              width: '80%', // 70%에서 80%로 늘림
              height: 'auto',
              maxWidth: '500px' // 400px에서 500px로 늘림
            }}
          />
          {/* 가로선 - 헤더 이미지 아래에 직접 그리기 */}
          <div style={{
            width: '100%',
            height: '2px',
            backgroundColor: '#222222',
            marginTop: '20px'
          }} />
        </div>

        {/* 해설 내용 */}
        <div style={{ 
          position: 'relative',
          display: 'flex',
          gap: '0'
        }}>
          {/* 세로선 - 가로선과 딱 맞게 닿도록 조정 */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '-30px', // 가로선까지 올라가도록
            width: '2px',
            height: 'calc(100% + 50px)', // 가로선까지 포함
            backgroundColor: '#dedede',
            transform: 'translateX(-50%)'
          }} />
          
          {/* 왼쪽 열 */}
          <div style={{ 
            flex: 1, 
            paddingRight: '30px',
            position: 'relative'
          }}>
            {questions
              .filter((_, index) => index % 2 === 0)
              .map((question, index) => (
                <div key={index * 2} style={{ marginBottom: '40px' }}>
                  <div style={{ 
                    fontSize: '18px', // 원래대로 18px
                    fontWeight: '600', // bold에서 500으로 줄임
                    marginBottom: '8px',
                    color: '#222222'
                  }}>
                    {index * 2 + 1}. {getAnswerDisplay(question)}
                  </div>
                  <div style={{ 
                    fontSize: '16px', // 원래대로 16px
                    color: '#30A10E',
                    fontWeight: '500', // bold에서 500으로 줄임
                    marginBottom: '8px'
                  }}>
                    해설요약
                  </div>
                  <div style={{ 
                    fontSize: '16px', // 원래대로 16px
                    color: '#666666',
                    lineHeight: '1.6'
                  }}>
                    {question.explanation}
                  </div>
                </div>
              ))}
          </div>

          {/* 오른쪽 열 */}
          <div style={{ 
            flex: 1, 
            paddingLeft: '30px',
            position: 'relative'
          }}>
            {questions
              .filter((_, index) => index % 2 === 1)
              .map((question, index) => (
                <div key={index * 2 + 1} style={{ marginBottom: '40px' }}>
                  <div style={{ 
                    fontSize: '18px', // 원래대로 18px
                    fontWeight: '600', // bold에서 500으로 줄임
                    marginBottom: '8px',
                    color: '#222222'
                  }}>
                    {index * 2 + 2}. {getAnswerDisplay(question)}
                  </div>
                  <div style={{ 
                    fontSize: '16px', // 원래대로 16px
                    color: '#30A10E',
                    fontWeight: '500', // bold에서 500으로 줄임
                    marginBottom: '8px'
                  }}>
                    해설요약
                  </div>
                  <div style={{ 
                    fontSize: '16px', // 원래대로 16px
                    color: '#666666',
                    lineHeight: '1.6'
                  }}>
                    {question.explanation}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
  };

  return (
    <PageContainer>
      <HeaderSection>
        <TitleSection></TitleSection>
        <ButtonGroup>
          <ActionButton variant="secondary" onClick={onBack}>
            뒤로가기
          </ActionButton>
          <ActionButton variant="primary" onClick={handleExportPDF}>
            문제 내보내기
          </ActionButton>
          <ActionButton variant="primary" onClick={handleExportAnswerSheet}>
            해설 내보내기
          </ActionButton>
        </ButtonGroup>
      </HeaderSection>

      {/* 문제지 */}
      <ExamPaperContainer ref={examPaperRef}>
        <ExamHeader>
          <ExamHeaderImage
            src="/images/exam-header.png"
            alt="퀴즐리와 함께하는 시험 준비 - 실전 모의고사 영역"
          />
          <DividerLine />
        </ExamHeader>

        <QuestionsContainer>
          <VerticalLine />
          <QuestionColumn>
            <ExamInstructionsImage
              src="/images/exam-instructions.png"
              alt="시험 안내사항 - 문제지에 성명과 수험번호를 작성하세요. 문제가 제대로 생성이 됐는지 확인하세요. 문항에 따라 난이도가 다르니 참고하세요."
            />
            {questions
              .filter((_, index) => index % 2 === 0)
              .map((question, index) => renderQuestion(question, index * 2))}
          </QuestionColumn>
          <QuestionColumn>
            {questions
              .filter((_, index) => index % 2 === 1)
              .map((question, index) =>
                renderQuestion(question, index * 2 + 1)
              )}
          </QuestionColumn>
        </QuestionsContainer>
      </ExamPaperContainer>

      {/* 해설지 (독립적인 컴포넌트) */}
      {renderAnswerSheet()}
    </PageContainer>
  );
};

export default MockExamResultPage;
