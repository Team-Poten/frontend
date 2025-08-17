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
import WrongQuizPage from "./components/WrongQuizPage";
import DynamicQuiz from "./components/DynamicQuiz";
import SignUpPage from "./components/SignUpPage";
import MockExamPage from "./components/MockExamPage";
import { Question, isLoggedIn } from "./services/api";

// 전체 앱 컨테이너
const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family:
    "Pretendard",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "Roboto",
    sans-serif;
  display: flex;
  flex-direction: column;
  overflow-x: auto; /* 가로 스크롤 허용 */
  scroll-behavior: smooth; /* 부드러운 스크롤 */
`;

// 메인 콘텐츠 래퍼 (1920px 기준으로 통합)
const MainWrapper = styled.div`
  width: 100%;
  min-width: 120rem; /* 1920px - 최소 너비로 통합 */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
  position: relative;
  margin: 0 auto; /* 중앙 정렬 */
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

// 콘텐츠 영역 컨테이너 (조건부 스크롤)
const ContentContainer = styled.div<{ allowScroll: boolean }>`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: ${(props) => (props.allowScroll ? "auto" : "hidden")};
`;

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleQuestionsGenerated = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
  };

  const handleBackToHome = () => {
    setQuestions([]);
  };

  return (
    <Router>
      <AppContainer>
        <MainWrapper>
          <Routes>
            <Route
              path="/"
              element={
                questions.length > 0 ? (
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
                  <RouteContent>
                    <QuizPage questions={questions} onBack={handleBackToHome} />
                  </RouteContent>
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
              path="/wrong-quiz"
              element={
                <RouteContent>
                  <WrongQuizPage />
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
            <Route
              path="/mock-exam"
              element={
                <RouteContent>
                  <MockExamPage />
                </RouteContent>
              }
            />
          </Routes>
        </MainWrapper>
      </AppContainer>
    </Router>
  );
};

export default App;
