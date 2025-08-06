import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/api";

const HeaderContainer = styled.header`
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
`;

// 전체 폭 기준 여백 적용
const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  padding-top: 26px;
  padding-bottom: 26px;

  /* 1920px 기준 비율 적용 */
  padding-left: calc(1030 / 1920 * 100%);
  padding-right: calc(792 / 1920 * 100%);

  /* 최소 여백 보장 (너무 작아졌을 때) */
  @media (max-width: 1024px) {
    padding-left: 24px;
    padding-right: 24px;
  }
`;


// 메뉴 네비게이션
const Navigation = styled.nav`
  display: flex;
  align-items: center;
`;

const NavTab = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  padding: 8px 12px;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.4em;
  color: ${(props) => (props.active ? "#222222" : "#777777")};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: #222222;
  }

  &:nth-child(2) {
    margin-left: 40px;
  }

  &:nth-child(3) {
    margin-left: 40px;
  }
`;

// 로그인 버튼
const LoginButton = styled.button`
  background-color: #30a10e;
  color: #ffffff;
  border: none;
  border-radius: 200px;
  padding: 10px 16px;
  width: 70px;
  height: 38px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.19em;
  cursor: pointer;
  white-space: nowrap;
  margin-left: 32px;

  &:hover {
    background-color: #2a8f0c;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #222222;
  margin-left: 32px;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #777777;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #222222;
  }
`;

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogin = () => {
    navigate("/signup");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path === "/history" && location.pathname.startsWith("/history")) return true;
    if (path === "/wrong-problems" && location.pathname === "/wrong-problems") return true;
    return false;
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Navigation>
          <NavTab active={isActive("/")} onClick={() => handleNavigation("/")}>
            문제 만들기
          </NavTab>
          <NavTab active={isActive("/history")} onClick={() => handleNavigation("/history")}>
            문제 모아보기
          </NavTab>
          <NavTab active={isActive("/wrong-problems")} onClick={() => handleNavigation("/wrong-problems")}>
            틀린문제 풀어보기
          </NavTab>
        </Navigation>
        {loggedIn ? (
          <UserInfo>
            <span>회원님</span>
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
          </UserInfo>
        ) : (
          <LoginButton onClick={handleLogin}>로그인</LoginButton>
        )}
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
