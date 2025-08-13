import React, { useState, useRef } from "react";
import styled from "styled-components";

interface SearchBarProps {
  onGenerateQuestions: (text: string) => void;
  isLoading?: boolean;
}

const SearchContainer = styled.div`
  position: relative;
  width: 976px;
  height: 72px;
  background-color: #ffffff;
  border: 1px solid #dedede;
  border-radius: 100px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  padding: 20px 32px;
  box-sizing: border-box;
`;

const SearchContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
`;

const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.3999999364217122em;
  color: #222222;
  outline: none;
  width: 768px;

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
  font-size: 18px;
  line-height: 1.3999999364217122em;
  color: #777777;
  cursor: pointer;
  text-decoration: underline;
  width: 768px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    color: #555555;
  }
`;

const SearchIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::before {
    content: "";
    width: 32px;
    height: 32px;
    background-image: url("/images/input.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const DeleteButton = styled.button`
  width: 32px;
  height: 32px;
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
    width: 32px;
    height: 32px;
    background-image: url("/images/icn_delete.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

const UploadButton = styled.button`
  width: 32px;
  height: 32px;
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
    width: 32px;
    height: 32px;
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
  top: -45px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333333;
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
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
    border: 5px solid transparent;
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

const SearchBar: React.FC<SearchBarProps> = ({
  onGenerateQuestions,
  isLoading = false,
}) => {
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    if (inputText.trim()) {
      onGenerateQuestions(inputText.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGenerate();
    }
  };

  const handleClearText = () => {
    setInputText("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setInputText(file.name); // 파일 이름을 입력창에 표시
    }
  };

  const handleFileDownload = () => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      const link = document.createElement("a");
      link.href = url;
      link.download = selectedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <SearchContainer>
      <SearchContent>
        <SearchIcon />
        {selectedFile ? (
          <FileLink onClick={handleFileDownload} title={selectedFile.name}>
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
            <Tooltip>파일 업로드</Tooltip>
          </UploadButtonWrapper>
        </ButtonContainer>
      </SearchContent>
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
