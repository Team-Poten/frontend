import React, { useState } from "react";
import styled from "styled-components";

interface SearchBarProps {
  onGenerateQuestions: (text: string) => void;
  isLoading?: boolean;
}

const SearchContainer = styled.div`
  position: relative;
  width: 976px;
  height: 72px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border: 1px solid #dedede;
  border-radius: 100px;
  padding: 20px 32px 20px 64px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.4;
  color: #777777;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);
  outline: none;

  &::placeholder {
    color: #777777;
  }

  &:focus {
    border-color: #30a10e;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 32px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777777;
`;

const GenerateButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #30a10e;
  color: #ffffff;
  border: none;
  border-radius: 100px;
  padding: 12px 24px;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2a8f0c;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const SearchBar: React.FC<SearchBarProps> = ({ onGenerateQuestions, isLoading = false }) => {
  const [inputText, setInputText] = useState("");

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

  return (
    <SearchContainer>
      <SearchIcon>
        <svg
          width="20"
          height="22"
          viewBox="0 0 20 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="12.71" y="13.75" width="8.08" height="7.92" fill="#000000" />
          <ellipse cx="8.68" cy="8.68" rx="8.68" ry="8.68" stroke="#000000" strokeWidth="2.5" />
        </svg>
      </SearchIcon>
      <SearchInput
        type="text"
        placeholder="텍스트를 입력하거나 파일을 업로드 해주세요."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />
      <GenerateButton onClick={handleGenerate} disabled={!inputText.trim() || isLoading}>
        {isLoading ? "생성 중..." : "문제 만들기"}
      </GenerateButton>
    </SearchContainer>
  );
};

export default SearchBar;
