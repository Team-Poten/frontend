import React, { useRef, useState } from "react";
import styled from "styled-components";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MockExamContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  font-family: "Pretendard", sans-serif;
  line-height: 1.6;
  color: #333;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  border-bottom: 3px solid #30a10e;
  padding-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #30a10e;
  margin: 0 0 10px 0;
`;

const Subtitle = styled.div`
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
`;

const ExamInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
`;

const QuestionSection = styled.div`
  margin-bottom: 40px;
  page-break-inside: avoid;
`;

const QuestionNumber = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #30a10e;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
`;

const QuestionText = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
  line-height: 1.8;
`;

const Options = styled.div`
  margin-left: 20px;
`;

const Option = styled.div`
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
`;

const OptionLabel = styled.span`
  font-weight: 600;
  margin-right: 10px;
  min-width: 20px;
`;

const OptionText = styled.span`
  line-height: 1.6;
`;

const PageBreak = styled.div`
  page-break-before: always;
  margin-top: 40px;
`;

const PDFButton = styled.button`
  background: linear-gradient(135deg, #30a10e 0%, #2d8f0d 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 15px 30px;
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(48, 161, 14, 0.3);
  margin: 40px auto;
  display: block;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(48, 161, 14, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const MockExam: React.FC = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const examRef = useRef<HTMLDivElement>(null);

  const handleSaveAsPDF = async () => {
    if (!examRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // PDF 생성
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // 1페이지 캡처 (1-10번 문제)
      const firstPageElement = examRef.current.querySelector('[data-page="1"]');
      if (firstPageElement) {
        const canvas1 = await html2canvas(firstPageElement as HTMLElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "white",
          width: (firstPageElement as HTMLElement).scrollWidth,
          height: (firstPageElement as HTMLElement).scrollHeight,
        });

        const imgData1 = canvas1.toDataURL("image/png");
        const imgWidth = 190; // A4 너비에서 여백 제외
        const imgHeight = (canvas1.height * imgWidth) / canvas1.width;
        
        pdf.addImage(imgData1, "PNG", 10, 10, imgWidth, imgHeight);
      }

      // 2페이지 추가 및 캡처 (11-20번 문제)
      const secondPageElement = examRef.current.querySelector('[data-page="2"]');
      if (secondPageElement) {
        pdf.addPage();
        
        const canvas2 = await html2canvas(secondPageElement as HTMLElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "white",
          width: (secondPageElement as HTMLElement).scrollWidth,
          height: (secondPageElement as HTMLElement).scrollHeight,
        });

        const imgData2 = canvas2.toDataURL("image/png");
        const imgWidth = 190;
        const imgHeight = (canvas2.height * imgWidth) / canvas2.width;
        
        pdf.addImage(imgData2, "PNG", 10, 10, imgWidth, imgHeight);
      }

      pdf.save("quizly-mock-exam.pdf");
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert("PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <MockExamContainer ref={examRef}>
      {/* 1페이지 */}
      <div data-page="1">
        <Header>
          <Title>2024년 퀴즐리 모의고사</Title>
          <Subtitle>문제 해결 능력 평가</Subtitle>
          <ExamInfo>
            <span>시험 시간: 60분</span>
            <span>총 문항 수: 20문항</span>
            <span>배점: 100점</span>
          </ExamInfo>
        </Header>

        {/* 1-10번 문제들 */}
        <QuestionSection>
          <QuestionNumber>1.</QuestionNumber>
          <QuestionText>
            다음 중 JavaScript에서 배열의 마지막 요소를 제거하는 메서드는 무엇인가요?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>push()</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>pop()</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>shift()</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>unshift()</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>2.</QuestionNumber>
          <QuestionText>
            React에서 컴포넌트의 상태를 관리하기 위해 사용하는 Hook은 무엇인가요?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>useEffect</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>useState</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>useContext</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>useReducer</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>3.</QuestionNumber>
          <QuestionText>
            CSS에서 요소를 화면 중앙에 배치하기 위해 사용하는 속성 조합으로 올바른 것은?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>margin: auto;</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>display: flex; justify-content: center; align-items: center;</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>position: absolute; top: 50%; left: 50%;</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>text-align: center;</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>4.</QuestionNumber>
          <QuestionText>
            다음 중 TypeScript의 타입 정의가 올바른 것은 무엇인가요?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>let name: string = 123;</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>const age: number = "25";</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>let isActive: boolean = true;</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>const scores: number[] = ["90", "85", "95"];</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>5.</QuestionNumber>
          <QuestionText>
            Git에서 현재 작업 중인 브랜치를 확인하는 명령어는 무엇인가요?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>git status</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>git branch</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>git checkout</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>git log</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>6.</QuestionNumber>
          <QuestionText>
            다음 중 HTTP 상태 코드 404의 의미로 올바른 것은?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>OK - 요청이 성공적으로 처리됨</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>Not Found - 요청한 리소스를 찾을 수 없음</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>Internal Server Error - 서버 내부 오류</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>Unauthorized - 인증이 필요함</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>7.</QuestionNumber>
          <QuestionText>
            JavaScript에서 비동기 작업을 처리하기 위해 사용하는 키워드는?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>async/await</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>try/catch</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>for/in</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>switch/case</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>8.</QuestionNumber>
          <QuestionText>
            CSS Grid에서 그리드 아이템을 세로 방향으로 정렬하는 속성은?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>justify-items</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>align-items</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>justify-content</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>align-content</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>9.</QuestionNumber>
          <QuestionText>
            다음 중 React의 생명주기 메서드가 아닌 것은?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>componentDidMount</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>componentWillUnmount</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>componentDidUpdate</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>componentWillRender</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>10.</QuestionNumber>
          <QuestionText>
            JavaScript에서 객체의 모든 키를 배열로 반환하는 메서드는?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>Object.keys()</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>Object.values()</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>Object.entries()</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>Object.assign()</OptionText>
            </Option>
          </Options>
        </QuestionSection>
      </div>

      {/* 2페이지 */}
      <div data-page="2">
        <Header>
          <Title>2024년 퀴즐리 모의고사 (계속)</Title>
          <Subtitle>문제 해결 능력 평가</Subtitle>
          <ExamInfo>
            <span>시험 시간: 60분</span>
            <span>총 문항 수: 20문항</span>
            <span>배점: 100점</span>
          </ExamInfo>
        </Header>

        {/* 11-20번 문제들 */}
        <QuestionSection>
          <QuestionNumber>11.</QuestionNumber>
          <QuestionText>
            CSS에서 요소에 그림자 효과를 주는 속성은?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>box-shadow</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>text-shadow</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>filter: drop-shadow()</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>모든 것</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>12.</QuestionNumber>
          <QuestionText>
            TypeScript에서 인터페이스를 정의할 때 사용하는 키워드는?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>class</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>interface</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>type</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>enum</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>13.</QuestionNumber>
          <QuestionText>
            Git에서 변경사항을 스테이징 영역에 추가하는 명령어는?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>git add</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>git commit</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>git push</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>git pull</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>14.</QuestionNumber>
          <QuestionText>
            JavaScript에서 배열의 모든 요소에 함수를 적용하는 메서드는?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>map()</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>filter()</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>reduce()</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>forEach()</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>15.</QuestionNumber>
          <QuestionText>
            React에서 컴포넌트 간 데이터를 전달하는 방법은?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>Props</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>State</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>Context</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>모든 것</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>16.</QuestionNumber>
          <QuestionText>
            CSS에서 요소를 숨기는 방법이 아닌 것은?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>display: none;</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>visibility: hidden;</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>opacity: 0;</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>position: absolute;</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>17.</QuestionNumber>
          <QuestionText>
            JavaScript에서 이벤트 리스너를 제거하는 메서드는?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>removeEventListener()</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>addEventListener()</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>attachEvent()</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>detachEvent()</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>18.</QuestionNumber>
          <QuestionText>
            TypeScript에서 제네릭을 사용하는 이유는?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>코드 재사용성 향상</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>타입 안정성 확보</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>런타임 성능 향상</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>①과 ②</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>19.</QuestionNumber>
          <QuestionText>
            CSS Flexbox에서 주축을 변경하는 속성은?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>flex-direction</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>justify-content</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>align-items</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>flex-wrap</OptionText>
            </Option>
          </Options>
        </QuestionSection>

        <QuestionSection>
          <QuestionNumber>20.</QuestionNumber>
          <QuestionText>
            Git에서 원격 저장소의 변경사항을 가져오는 명령어는?
          </QuestionText>
          <Options>
            <Option>
              <OptionLabel>①</OptionLabel>
              <OptionText>git fetch</OptionText>
            </Option>
            <Option>
              <OptionLabel>②</OptionLabel>
              <OptionText>git pull</OptionText>
            </Option>
            <Option>
              <OptionLabel>③</OptionLabel>
              <OptionText>git clone</OptionText>
            </Option>
            <Option>
              <OptionLabel>④</OptionLabel>
              <OptionText>모든 것</OptionText>
            </Option>
          </Options>
        </QuestionSection>
      </div>

      <PDFButton 
        onClick={handleSaveAsPDF} 
        disabled={isGeneratingPDF}
      >
        {isGeneratingPDF ? "PDF 생성 중..." : "모의고사 PDF로 저장"}
      </PDFButton>
    </MockExamContainer>
  );
};

export default MockExam;
