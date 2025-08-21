import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

interface SearchBarProps {
  onGenerateQuestions: (text: string, file?: File) => void;
  isLoading?: boolean;
}

const ErrorTooltip = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff4444;
  color: #ffffff;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  font-family: "Pretendard", sans-serif;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 1000;
  margin-top: 0.5rem;
  
  &::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 0.25rem solid transparent;
    border-bottom-color: #ff4444;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  background-color: #ffffff;
  border: 0.0625rem solid #dedede;
  border-radius: 6.25rem;
  box-shadow: 0.25rem 0.25rem 0.75rem rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem 2rem;
  box-sizing: border-box;
  min-height: 4.5rem;
`;

const SearchContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.75rem; /* 12px */
`;

const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 1.125rem; /* 18px */
  line-height: 1.4em;
  color: #222222;
  outline: none;
  min-width: 0;

  &::placeholder {
    color: #777777;
  }

  &:focus {
    color: #222222;
  }
`;

const FileLink = styled.span`
  flex: 1;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 1.125rem; /* 18px */
  line-height: 1.4em;
  color: #222222;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SearchIcon = styled.div`
  width: 2rem; /* 32px */
  height: 2rem; /* 32px */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::before {
    content: "";
    width: 2rem; /* 32px */
    height: 2rem; /* 32px */
    background-image: url("/images/input.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem; /* 24px */
`;

const DeleteButton = styled.button`
  width: 2rem; /* 32px */
  height: 2rem; /* 32px */
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: relative;

  &::before {
    content: "";
    width: 2rem; /* 32px */
    height: 2rem; /* 32px */
    background-image: url("/images/icn_delete.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

const UploadButton = styled.button`
  width: 2rem; /* 32px */
  height: 2rem; /* 32px */
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: relative;

  &::before {
    content: "";
    width: 2rem; /* 32px */
    height: 2rem; /* 32px */
    background-image: url("/images/icn_upload.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
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
  white-space: nowrap;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;

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

const UploadButtonWrapper = styled.div`
  position: relative;

  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
  font-family: 'Pretendard, sans-serif';
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  
  &::before {
    content: "⚠️";
    font-size: 1rem;
  }
`;

// PDF.js CDN에서 로드
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const SearchBar: React.FC<SearchBarProps> = ({
  onGenerateQuestions,
  isLoading = false,
}) => {
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileLinkRef = useRef<HTMLSpanElement>(null);

  // 파일이 선택되면 자동으로 FileLink에 포커스 이동
  useEffect(() => {
    if (selectedFile && fileLinkRef.current) {
      fileLinkRef.current.focus();
    }
  }, [selectedFile]);

  // PDF.js가 로드되었는지 확인
  useEffect(() => {
    if (!window.pdfjsLib) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        // 워커 설정
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      };
      document.head.appendChild(script);
    }
  }, []);

  const handleGenerate = () => {
    if (inputText.trim() || selectedFile) {
      onGenerateQuestions(inputText.trim(), selectedFile || undefined);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 기본 동작 방지
      handleGenerate();
    }
  };

  const handleClearText = () => {
    setInputText("");
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const getPDFPageCount = async (file: File): Promise<number> => {
    try {
      if (!window.pdfjsLib) {
        throw new Error('PDF.js가 아직 로드되지 않았습니다.');
      }
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      return pdf.numPages;
    } catch (error) {
      console.error('PDF 페이지 수 확인 중 오류:', error);
      throw new Error('PDF 파일을 읽을 수 없습니다.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // PDF 파일인 경우 실제 페이지 수 확인
        if (file.type === 'application/pdf') {
          const pageCount = await getPDFPageCount(file);
          if (pageCount > 10) {
            setError("PDF는 10장까지 가능합니다. 현재 파일은 " + pageCount + "장입니다.");
            setSelectedFile(null);
            setInputText("");
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            return;
          }
        }
        
        setError(null);
        setSelectedFile(file);
        setInputText(file.name);
        
        // 파일 업로드 후 자동으로 문제 생성 모달 열기
        setTimeout(() => {
          onGenerateQuestions(file.name, file);
        }, 100);
      } catch (error) {
        setError(error instanceof Error ? error.message : "파일 처리 중 오류가 발생했습니다.");
        setSelectedFile(null);
        setInputText("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  return (
    <SearchContainer>
      <SearchContent>
        <SearchIcon />
        {selectedFile ? (
          <FileLink
            ref={fileLinkRef}
            onKeyPress={handleKeyPress}
            title={selectedFile.name}
            tabIndex={0}
          >
            {selectedFile.name}
          </FileLink>
        ) : (
          <SearchInput
            type="text"
            placeholder="정리한 내용을 입력하거나 파일을 업로드 해주세요."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        )}
        <ButtonContainer>
          {(inputText || selectedFile) && (
            <DeleteButton onClick={handleClearText} />
          )}
          <UploadButtonWrapper>
            <UploadButton onClick={handleFileUpload} />
            <Tooltip>PDF는 10장까지 가능합니다.</Tooltip>
          </UploadButtonWrapper>
        </ButtonContainer>
      </SearchContent>
      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}
      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.pdf,.tiff,.tif"
      />
    </SearchContainer>
  );
};

export default SearchBar;
