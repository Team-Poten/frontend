import React, { useState, useRef } from "react";
import styled from "styled-components";
import {
  createMockExamQuestions,
  MockExamRequest,
  MockExamQuestion,
} from "../services/api";
import LoadingModal from "./LoadingModal";

interface MockExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MockExamSettings) => void;
  onQuestionsGenerated: (questions: MockExamQuestion[]) => void;
  isLoggedIn: boolean;
}

export interface MockExamSettings {
  questionTypes: string[];
  questionCharacteristics: string[];
  studyContent: string;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 32.5rem; /* 520px */
  height: 35.375rem; /* 566px - 기본 모달 높이 증가 (기존 534px에서 32px 증가) */
  background-color: #ffffff;
  border: 0.0625rem solid #ededed; /* 1px */
  border-radius: 1.5rem; /* 24px */
  box-shadow: 0.25rem 0.25rem 0.75rem 0rem rgba(0, 0, 0, 0.04);
  position: relative;
  display: flex;
  flex-direction: column;

  /* 객관식이 선택되었을 때 높이 조정 */
  &.expanded {
    height: 41.25rem; /* 660px - 확장된 높이도 증가 (기존 628px에서 32px 증가) */
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2.5625rem; /* 41px */
  right: 1.75rem; /* 28px */
  width: 1.75rem; /* 28px */
  height: 1.75rem; /* 28px */
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 1.04875rem; /* 16.78px */
    height: 0.1875rem; /* 3px */
    background-color: #555555;
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`;

const ModalContent = styled.div`
  padding: 2.5rem 2.75rem; /* 40px 44px */
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* 4px */
  align-items: flex-end;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* 12px */
  align-self: stretch;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* 24px */
  align-self: stretch;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* 4px */
  width: 15.5rem; /* 248px */
`;

const ModalTitle = styled.h2`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 1.125rem; /* 18px */
  line-height: 1.4em;
  color: #222222;
  margin: 0;
  width: 15.4375rem; /* 247px */
  height: 1.625rem; /* 26px */
`;

const ModalSubtitle = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 0.875rem; /* 14px */
  line-height: 1.4em;
  color: #777777;
  margin: 0;
  align-self: stretch;
`;

const QuestionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* 12px */
  width: 22.0625rem; /* 353px */
`;

const QuestionTitle = styled.h3`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 1rem; /* 16px */
  line-height: 1.4em;
  color: #222222;
  margin: 0;
  align-self: stretch;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125rem; /* 5px */
  align-self: stretch;
`;

const QuestionTypeButton = styled.button<{
  selected: boolean;
  isDisabled?: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625rem; /* 10px */
  padding: 0.5rem 0.75rem; /* 8px 12px */
  background-color: ${(props) =>
    props.isDisabled ? "#ffffff" : props.selected ? "#30a10e" : "#ffffff"};
  border: 0.0625rem solid
    ${(props) =>
      props.isDisabled ? "#dedede" : props.selected ? "#30a10e" : "#dedede"};
  border-radius: 12.5rem; /* 200px */
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 0.875rem; /* 14px */
  line-height: 1.4em;
  color: ${(props) =>
    props.isDisabled ? "#777777" : props.selected ? "#ffffff" : "#777777"};
  transition: all 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    ${(props) =>
      !props.isDisabled &&
      !props.selected &&
      `
      border-color: #30a10e;
      color: #30a10e;
    `}
  }
`;

const CharacteristicSection = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? "flex" : "none")};
  flex-direction: column;
  gap: 0.75rem; /* 12px */
  width: 24.0625rem; /* 385px */
`;

const CharacteristicButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem; /* 4px */
  align-self: stretch;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* 12px */
  align-self: stretch;
`;

const InputHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 8px */
`;

const InputLabel = styled.label`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 1rem; /* 16px */
  line-height: 1.4em;
  color: #222222;
`;

const InfoIcon = styled.div`
  width: 1.5rem; /* 24px - 클릭 영역 확대 */
  height: 1.5rem; /* 24px - 클릭 영역 확대 */
  position: relative;
  cursor: pointer;
  background-color: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem; /* 4px - 추가 패딩으로 클릭 영역 확대 */

  &::after {
    content: "";
    width: 0.875rem; /* 14px */
    height: 0.875rem; /* 14px */
    border: 0.0625rem solid #777777; /* 1px */
    border-radius: 50%;
    position: absolute;
    background-color: #ffffff;
  }

  &::before {
    content: "i";
    font-family: "Pretendard", sans-serif;
    font-size: 0.6875rem; /* 11px */
    font-weight: 400;
    color: #777777;
    z-index: 1;
  }

  &:hover::after {
    background-color: #f5f5f5;
    border-color: #555555;
  }
`;

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Tooltip = styled.div<{ visible: boolean }>`
  position: absolute;
  top: -5.3125rem; /* -85px */
  left: 50%;
  transform: translateX(-50%);
  width: 19.375rem; /* 310px */
  background-color: #333333;
  border-radius: 0.25rem; /* 4px */
  padding: 0.5rem 0.75rem; /* 8px 12px */
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 0.875rem; /* 14px */
  line-height: 1.4em;
  color: #ffffff;
  z-index: 1001;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
  white-space: pre-wrap;
  text-align: center;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 0.5625rem solid transparent; /* 9px */
    border-top-color: #333333;
  }
`;

const TextArea = styled.textarea<{ disabled?: boolean }>`
  padding: 0.75rem; /* 12px */
  border: 0.0625rem solid #dedede; /* 1px */
  border-radius: 0.375rem; /* 6px */
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 0.875rem; /* 14px */
  line-height: 1.4em;
  color: ${(props) => (props.disabled ? "#9e9e9e" : "#222222")};
  background-color: ${(props) => (props.disabled ? "#efefef" : "#ffffff")};
  resize: vertical;
  min-height: 8.75rem; /* 140px */
  align-self: stretch;

  &::placeholder {
    color: #9e9e9e;
  }

  &:focus {
    outline: none;
    border-color: ${(props) => (props.disabled ? "#dedede" : "#30a10e")};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const FileUploadSection = styled.div`
  display: flex;
  flex-direction: row; /* column에서 row로 변경 */
  align-items: center; /* 세로 중앙 정렬 */
  gap: 0.5rem; /* 8px */
  flex-wrap: wrap; /* 필요시 줄바꿈 */
`;

const FileUploadButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem; /* 4px */
  padding: 0.5rem 0.75rem; /* 8px 12px */
  background-color: ${(props) => (props.disabled ? "#f5f5f5" : "#ffffff")};
  border: 0.0625rem solid ${(props) => (props.disabled ? "#e0e0e0" : "#dedede")};
  border-radius: 12.5rem; /* 200px */
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 0.875rem; /* 14px */
  line-height: 1.4em;
  color: ${(props) => (props.disabled ? "#9e9e9e" : "#222222")};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  width: fit-content; /* 내용에 맞게 너비 조정 */
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  flex-shrink: 0; /* 버튼 크기 고정 */

  &:hover {
    ${(props) =>
      !props.disabled &&
      `
      border-color: #30a10e;
      color: #30a10e;
    `}
  }
`;

const FileUploadInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 8px */
  padding: 0.5rem 0.75rem; /* 8px 12px */
  background-color: #f8f9fa;
  border: 0.0625rem solid #e9ecef;
  border-radius: 0.375rem; /* 6px */
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 0.75rem; /* 12px */
  line-height: 1.4em;
  color: #6c757d;
`;

const InfoIconSmall = styled.div`
  width: 1rem; /* 16px */
  height: 1rem; /* 16px */
  position: relative;
  background-color: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    width: 0.75rem; /* 12px */
    height: 0.75rem; /* 12px */
    border: 0.0625rem solid #6c757d;
    border-radius: 50%;
    position: absolute;
    background-color: #ffffff;
  }

  &::before {
    content: "i";
    font-family: "Pretendard", sans-serif;
    font-size: 0.625rem; /* 10px */
    font-weight: 400;
    color: #6c757d;
    z-index: 1;
  }
`;

const UploadIcon = styled.div<{ disabled?: boolean }>`
  width: 1.25rem; /* 20px */
  height: 1.25rem; /* 20px */
  background-image: url("/images/icn_upload.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const FileName = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 0.875rem; /* 14px */
  line-height: 1.4em;
  color: #777777;
  white-space: nowrap; /* 파일명 줄바꿈 방지 */
  overflow: hidden;
  text-overflow: ellipsis; /* 긴 파일명은 ...으로 표시 */
  max-width: 15rem; /* 240px - 최대 너비 제한 */
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ActionButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; /* 12px */
`;

const SaveButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem; /* 8px */
  width: 5.25rem; /* 84px */
  background-color: #30a10e;
  border: none;
  border-radius: 0.375rem; /* 6px */
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 0.875rem; /* 14px */
  line-height: 1.4em;
  color: #ffffff;
  cursor: pointer;

  &:hover {
    background-color: #2a8f0c;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-family: "Pretendard", sans-serif;
  font-size: 0.875rem; /* 14px */
  margin-top: 0.5rem; /* 8px */
  text-align: center;
  max-width: 27.5rem; /* 440px */
`;

// 문제 유형 및 특성 상수 매핑
const QUESTION_TYPE_MAP: Record<string, string> = {
  ox: "TRUE_FALSE",
  multiple: "MULTIPLE_CHOICE",
  subjective: "SHORT_ANSWER",
  essay: "ESSAY",
};

const QUESTION_CHARACTERISTIC_MAP: Record<string, string> = {
  "find-answer": "FIND_CORRECT",
  "find-wrong": "FIND_INCORRECT",
  "find-exception": "FIND_EXCEPTION",
  "find-option": "FIND_MATCH",
};

const MockExamModal: React.FC<MockExamModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onQuestionsGenerated,
  isLoggedIn,
}) => {
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>(
    []
  );
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<
    string[]
  >([]);
  const [studyContent, setStudyContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiPromise, setApiPromise] = useState<Promise<any> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const questionTypes = [
    { id: "ox", label: "OX 퀴즈", disabled: false },
    { id: "multiple", label: "객관식 문제", disabled: !isLoggedIn },
    { id: "subjective", label: "주관식 문제", disabled: !isLoggedIn },
    { id: "essay", label: "서술형 문제", disabled: !isLoggedIn },
  ];

  const characteristics = [
    { id: "find-answer", label: "정답 찾기", disabled: false },
    { id: "find-wrong", label: "옳지 않은 것 찾기", disabled: false },
    { id: "find-exception", label: "예외 찾기", disabled: false },
    { id: "find-option", label: "보기문항 찾기", disabled: false },
  ];

  const handleQuestionTypeToggle = (typeId: string) => {
    const type = questionTypes.find((t) => t.id === typeId);
    if (type?.disabled) return;

    setSelectedQuestionTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleCharacteristicToggle = (charId: string) => {
    setSelectedCharacteristics((prev) =>
      prev.includes(charId)
        ? prev.filter((id) => id !== charId)
        : [...prev, charId]
    );
  };

  const handleFileUpload = () => {
    // 필기 내용이 있으면 파일 업로드 불가
    if (studyContent.trim()) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setStudyContent(""); // 파일 업로드 시 텍스트 내용 초기화
    }
  };

  const handleSave = async () => {
    if (
      selectedQuestionTypes.length === 0 ||
      (!studyContent.trim() && !selectedFile)
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // 선택된 유형과 특성을 상수값으로 변환
    const typeConstants = selectedQuestionTypes
      .map((type) => QUESTION_TYPE_MAP[type])
      .filter(Boolean);
    const characteristicConstants = selectedCharacteristics
      .map((char) => QUESTION_CHARACTERISTIC_MAP[char])
      .filter(Boolean);

    // example_question_text에 모든 상수값을 쉼표로 연결
    const exampleQuestionText = [
      ...typeConstants,
      ...characteristicConstants,
    ].join(",");

    const request: MockExamRequest = {
      exampleQuestionText,
      userContentText: selectedFile ? undefined : studyContent.trim(),
      userContentFile: selectedFile || undefined,
    };

    // API 요청을 Promise로 생성하고 상태에 저장
    const questionPromise = createMockExamQuestions(request);
    setApiPromise(questionPromise);

    // LoadingModal이 apiPromise를 처리하고 완료되면 handleLoadingComplete가 호출됨
  };

  const handleLoadingComplete = async () => {
    try {
      if (!apiPromise) {
        throw new Error("API 요청이 존재하지 않습니다.");
      }

      // 이미 실행된 API 요청의 결과를 가져옴
      const questions = await apiPromise;

      // 성공적으로 문제를 생성한 경우
      onQuestionsGenerated(questions);

      // 설정 정보도 저장 (기존 로직 유지)
      const settings: MockExamSettings = {
        questionTypes: selectedQuestionTypes,
        questionCharacteristics: selectedCharacteristics,
        studyContent: selectedFile ? "" : studyContent.trim(),
      };
      onSave(settings);
    } catch (error) {
      console.error("모의고사 문제 생성 중 오류:", error);
      setError("문제 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
      setApiPromise(null);
    }
  };

  const handleClose = () => {
    setSelectedQuestionTypes([]);
    setSelectedCharacteristics([]);
    setStudyContent("");
    setSelectedFile(null);
    setShowTooltip(false);
    setIsLoading(false);
    setError(null);
    setApiPromise(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const showCharacteristics = selectedQuestionTypes.includes("multiple");
  const isMultipleSelected = selectedQuestionTypes.includes("multiple");

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <ModalOverlay isOpen={isOpen} onClick={handleClose}>
        <ModalContainer
          className={showCharacteristics ? "expanded" : ""}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton onClick={handleClose} />
          <ModalContent>
            <MainContent>
              <ContentSection>
                <TitleSection>
                  <ModalTitle>실전 모의고사 맞춤 설정</ModalTitle>
                  <ModalSubtitle>
                    필요한 유형에 맞춰 모의고사 문제를 받으세요
                  </ModalSubtitle>
                </TitleSection>

                <QuestionSection>
                  <QuestionTitle>
                    어떤 유형의 문제를 만드시겠어요?(복수 선택 가능)
                  </QuestionTitle>
                  <ButtonGroup>
                    {questionTypes.map((type) => (
                      <QuestionTypeButton
                        key={type.id}
                        selected={selectedQuestionTypes.includes(type.id)}
                        isDisabled={type.disabled}
                        onClick={() => handleQuestionTypeToggle(type.id)}
                      >
                        {type.label}
                      </QuestionTypeButton>
                    ))}
                  </ButtonGroup>
                </QuestionSection>

                <CharacteristicSection visible={showCharacteristics}>
                  <QuestionTitle>
                    문항을 어떤 특성으로 출제할까요?(복수 선택 가능)
                  </QuestionTitle>
                  <CharacteristicButtonGroup>
                    {characteristics.map((char) => (
                      <QuestionTypeButton
                        key={char.id}
                        selected={selectedCharacteristics.includes(char.id)}
                        isDisabled={char.disabled}
                        onClick={() => handleCharacteristicToggle(char.id)}
                      >
                        {char.label}
                      </QuestionTypeButton>
                    ))}
                  </CharacteristicButtonGroup>
                </CharacteristicSection>

                <InputSection>
                  <InputHeader>
                    <InputLabel>정리한 필기 내용을 기재해주세요</InputLabel>
                    <TooltipContainer>
                      <InfoIcon
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      />
                      <Tooltip visible={showTooltip}>
                        최소 300자 이상의 내용을 작성해주시면{"\n"}
                        중복 없이 문제를 만들 수 있습니다.{"\n"}
                        ⚠️ 필기 내용과 파일 업로드는 동시에 사용할 수 없습니다.
                      </Tooltip>
                    </TooltipContainer>
                  </InputHeader>
                  <TextArea
                    placeholder={
                      selectedFile
                        ? "파일이 업로드되었습니다"
                        : "필기 내용을 자유롭게 기재해주세요"
                    }
                    value={studyContent}
                    onChange={(e) => setStudyContent(e.target.value)}
                    disabled={!!selectedFile}
                  />
                </InputSection>

                <FileUploadSection>
                  <FileUploadButton
                    onClick={handleFileUpload}
                    disabled={!!studyContent.trim()}
                  >
                    <UploadIcon disabled={!!studyContent.trim()} />
                    파일 업로드
                  </FileUploadButton>
                  {selectedFile && <FileName>{selectedFile.name}</FileName>}
                  <FileUploadInfo>
                    <InfoIconSmall />
                    PDF는 10장까지 업로드 가능합니다.
                  </FileUploadInfo>
                </FileUploadSection>
              </ContentSection>
            </MainContent>

            <ActionButtonContainer>
              <SaveButton
                onClick={handleSave}
                disabled={
                  isLoading ||
                  selectedQuestionTypes.length === 0 ||
                  (!studyContent.trim() && !selectedFile)
                }
              >
                저장하기
              </SaveButton>
            </ActionButtonContainer>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </ModalContent>

          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf,.tiff,.tif"
          />
        </ModalContainer>
      </ModalOverlay>

      <LoadingModal
        isOpen={isLoading}
        onComplete={handleLoadingComplete}
        apiPromise={apiPromise}
      />
    </>
  );
};

export default MockExamModal;
