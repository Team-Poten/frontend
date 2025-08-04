import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  width: 100%;
  height: 90px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const NavTab = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  padding: 8px 12px;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.4;
  color: ${(props) => (props.active ? "#222222" : "#777777")};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #222222;
  }
`;

const LoginButton = styled.button`
  background-color: #30a10e;
  color: #ffffff;
  border: none;
  border-radius: 200px;
  padding: 10px 8px;
  width: 70px;
  height: 38px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.193;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2a8f0c;
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <div></div>
      <Navigation>
        <NavTab active>문제 만들기</NavTab>
        <NavTab>문제 모아보기</NavTab>
        <NavTab>틀린문제 풀어보기</NavTab>
      </Navigation>
      <LoginButton>로그인</LoginButton>
    </HeaderContainer>
  );
};

export default Header;
