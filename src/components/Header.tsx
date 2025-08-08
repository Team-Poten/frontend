import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { isLoggedIn, login } from "../services/api";
import LoginModal from "./LoginModal";

const HeaderContainer = styled.header`
  width: 100%;
  background-color: #f8f9fa;
`;

// 전체 디스플레이 컨테이너 (1920px 기준)
const DisplayContainer = styled.div`
  max-width: 1920px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 26px;
  padding-bottom: 26px;
  padding-left: 1030px;
  padding-right: 300px;
  box-sizing: border-box;
`;

// 메뉴 네비게이션
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
  line-height: 1.4em;
  color: ${(props) => (props.active ? "#222222" : "#777777")};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: #222222;
  }
`;

// 로그인/로그아웃 버튼
const AuthButton = styled.button`
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
  line-height: 1.19em;
  cursor: pointer;
  white-space: nowrap;
  margin-left: 32px;

  &:hover {
    background-color: #2a8f0c;
  }
`;

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);

  // URL 파라미터 확인해서 로그인 모달 자동 열기 (403 에러 후 새로고침 시)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("showLogin") === "true" && !loggedIn) {
      setIsLoginModalOpen(true);
      setLoginError("인증이 만료되었습니다. 로그인을 다시 해주세요.");
      // URL에서 파라미터 제거
      urlParams.delete("showLogin");
      const newUrl = `${window.location.pathname}${urlParams.toString() ? "?" + urlParams.toString() : ""}`;
      window.history.replaceState({}, "", newUrl);
    }
  }, [loggedIn]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleAuth = () => {
    if (loggedIn) {
      localStorage.removeItem("accessToken");
      // 쿠키에서 refreshToken 제거
      document.cookie =
        "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.reload();
    } else {
      setIsLoginModalOpen(true);
      setLoginError(undefined);
    }
  };

  const handleLogin = async (loginId: string, password: string) => {
    try {
      const response = await login({ loginId, password });

      if (response.accessToken) {
        // 로그인 성공
        setIsLoginModalOpen(false);
        window.location.reload();
      } else {
        // 로그인 실패
        setLoginError(response.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
    setLoginError(undefined);
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
    <>
      <HeaderContainer>
        <DisplayContainer>
          <Navigation>
            <NavTab
              active={isActive("/")}
              onClick={() => handleNavigation("/")}
            >
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
          <AuthButton onClick={handleAuth}>
            {loggedIn ? "로그아웃" : "로그인"}
          </AuthButton>
        </DisplayContainer>
      </HeaderContainer>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseModal}
        onLogin={handleLogin}
        error={loginError}
      />
    </>
  );
};

export default Header;
