import React, { useState } from "react";
import styled from "styled-components";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import QuizPage from "./components/QuizPage";
import ProblemHistoryPage from "./components/ProblemHistoryPage";
import ProblemHistoryGuestPage from "./components/ProblemHistoryGuestPage";
import ProblemDetailPage from "./components/ProblemDetailPage";
import WrongProblemPage from "./components/WrongProblemPage";
import WrongProblemGuestPage from "./components/WrongProblemGuestPage";
import SignUpPage from "./components/SignUpPage";
import { Question, isLoggedIn } from "./services/api";

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #f8f9fa;
  font-family:
    "Pretendard",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "Roboto",
    sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0;

  /* 세로 화면에서는 상단 정렬 */
  @media (orientation: portrait) {
    align-items: flex-start;
    padding-top: 10px;
  }
`;

// 16:9 비율 고정 컨테이너 (1920x1080 기준)
const FixedRatioContainer = styled.div`
  width: 1920px;
  height: 1080px;
  aspect-ratio: 16 / 9;
  background-color: #f8f9fa;
  position: relative;
  transform-origin: center;
  flex-shrink: 0;
  transform: scale(var(--scale-ratio, 1));

  /* 화면이 1920x1080보다 작을 때 자동으로 축소 */
  @media (max-width: 1920px), (max-height: 1080px) {
    transform: scale(var(--scale-ratio, 1));
  }

  /* 세로 화면에서는 상단 정렬 */
  @media (orientation: portrait) {
    transform-origin: top center;
  }
`;

// 전체 디스플레이 컨테이너 (1920px 기준)
const DisplayContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// 콘텐츠 영역 컨테이너 (조건부 스크롤)
const ContentContainer = styled.div<{ allowScroll: boolean }>`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: ${(props) => (props.allowScroll ? "auto" : "hidden")};

  /* 스크롤바 스타일링 (스크롤이 허용된 경우에만) */
  ${(props) =>
    props.allowScroll &&
    `
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `}
`;

// 라우트별 콘텐츠 래퍼
const RouteContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const isHistoryPage = location.pathname === "/history";
  const isHistoryDetailPage = location.pathname.startsWith("/history/");

  return (
    <>
      <Header />
      <ContentContainer allowScroll={isHistoryPage || isHistoryDetailPage}>
        {children}
      </ContentContainer>
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isQuizStarted] = useState(false);

  // 화면 크기에 따른 스케일 비율 계산
  React.useEffect(() => {
    const calculateScale = () => {
      const container = document.documentElement;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // 세로 화면(스마트폰)에서는 너비 기준으로 스케일 계산
      if (windowHeight > windowWidth) {
        // 세로 화면: 너비에 맞춰 스케일링 (390px 기준)
        const scale = windowWidth / 1920;
        container.style.setProperty("--scale-ratio", scale.toString());
      } else {
        // 가로 화면: 기존 로직 유지
        const scaleX = windowWidth / 1920;
        const scaleY = windowHeight / 1080;
        let scale = Math.min(scaleX, scaleY);
        scale = Math.max(scale, 0.4);
        scale = Math.min(scale, 1);
        container.style.setProperty("--scale-ratio", scale.toString());
      }
    };

    // 초기 계산
    calculateScale();

    // 리사이즈 이벤트 리스너
    window.addEventListener("resize", calculateScale);

    return () => {
      window.removeEventListener("resize", calculateScale);
    };
  }, []);

  const handleQuestionsGenerated = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
  };

  const handleBackToHome = () => {
    setQuestions([]);
  };

  return (
    <Router>
      <AppContainer>
        <FixedRatioContainer>
          <DisplayContainer>
            <Routes>
              <Route
                path="/"
                element={
                  isQuizStarted ? (
                    <Navigate to="/quiz" replace />
                  ) : (
                    <>
                      <Header />
                      <ContentContainer allowScroll={false}>
                        <MainContent
                          onQuestionsGenerated={handleQuestionsGenerated}
                        />
                      </ContentContainer>
                      <Footer />
                    </>
                  )
                }
              />
              <Route
                path="/quiz"
                element={
                  questions.length > 0 ? (
                    <QuizPage questions={questions} onBack={handleBackToHome} />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/history"
                element={
                  <RouteContent>
                    {isLoggedIn() ? (
                      <ProblemHistoryPage />
                    ) : (
                      <ProblemHistoryGuestPage />
                    )}
                  </RouteContent>
                }
              />
              <Route
                path="/history/:date"
                element={
                  <RouteContent>
                    <ProblemDetailPage />
                  </RouteContent>
                }
              />
              <Route
                path="/wrong-problems"
                element={
                  <RouteContent>
                    {isLoggedIn() ? (
                      <WrongProblemPage />
                    ) : (
                      <WrongProblemGuestPage />
                    )}
                  </RouteContent>
                }
              />
              <Route
                path="/signup"
                element={
                  <RouteContent>
                    <SignUpPage />
                  </RouteContent>
                }
              />
            </Routes>
          </DisplayContainer>
        </FixedRatioContainer>
      </AppContainer>
    </Router>
  );
};

export default App;
