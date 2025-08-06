import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../services/api";

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
  line-height: 1.399999976158142em;
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
  line-height: 1.193359375em;
  cursor: pointer;
  transition: background-color 0.2s ease;

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
    // 로그인하지 않은 상태에서 틀린문제 풀어보기나 문제 모아보기 접근 시
    if (!loggedIn && (path === "/wrong-problems" || path === "/history")) {
      // 로그인하지 않은 상태에서는 해당 페이지로 이동 (게스트 페이지가 표시됨)
      navigate(path);
    } else {
      navigate(path);
    }
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
    if (path === "/history" && location.pathname.startsWith("/history"))
      return true;
    if (path === "/wrong-problems" && location.pathname === "/wrong-problems")
      return true;
    return false;
  };

  return (
    <HeaderContainer>
      <div></div>
      <Navigation>
        <NavTab active={isActive("/")} onClick={() => handleNavigation("/")}>
          문제 만들기
        </NavTab>
        <NavTab
          active={isActive("/history")}
          onClick={() => handleNavigation("/history")}
        >
          문제 모아보기
        </NavTab>
        <NavTab
          active={isActive("/wrong-problems")}
          onClick={() => handleNavigation("/wrong-problems")}
        >
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
    </HeaderContainer>
  );
};

export default Header;
