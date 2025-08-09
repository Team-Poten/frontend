import React, { useState } from "react";
import styled from "styled-components";

const SearchContainer = styled.div`
  width: 100%;
  max-width: 600px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 20px 0 50px;
  border: 2px solid #dedede;
  border-radius: 24px;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  line-height: 1.4em;
  color: #222222;
  background-color: #ffffff;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #30a10e;
  }

  &::placeholder {
    color: #999999;
  }
`;

const SearchIcon = styled.img`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
`;

const SearchBar: React.FC<{
  onSearch: (query: string) => void;
  placeholder?: string;
}> = ({ onSearch, placeholder = "문제를 검색해보세요" }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <SearchContainer>
      <form onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
        />
        <SearchIcon src="/images/input.png" alt="Search" />
      </form>
    </SearchContainer>
  );
};

export default SearchBar;
