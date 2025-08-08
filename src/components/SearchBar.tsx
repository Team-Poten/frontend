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
  background-color: #ffffff;
  border: 1px solid #dedede;
  border-radius: 100px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  padding: 20px 32px;
  box-sizing: border-box;
`;

const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.3999999364217122em;
  color: #777777;
  outline: none;
  margin-left: 12px;

  &::placeholder {
    color: #777777;
  }

  &:focus {
    color: #222222;
  }
`;

const SearchIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    width: 20.79px;
    height: 21.67px;
    background-image: url("/images/input.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

const SearchBar: React.FC<SearchBarProps> = ({
  onGenerateQuestions,
  isLoading = false,
}) => {
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
      <SearchIcon />
      <SearchInput
        type="text"
        placeholder="텍스트를 입력하거나 파일을 업로드 해주세요."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />
    </SearchContainer>
  );
};

export default SearchBar;
