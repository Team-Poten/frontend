import React, { useState } from "react";
import styled from "styled-components";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family:
    "Pretendard",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "Roboto",
    sans-serif;
`;

// 전체 디스플레이 컨테이너 (1920px 기준)
const DisplayContainer = styled.div`
  max-width: 1920px;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// 콘텐츠 영역 컨테이너 (1024px 기준)
const ContentContainer = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  const handleQuestionsGenerated = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    setIsQuizStarted(true);
  };

  const handleBackToHome = () => {
    setQuestions([]);
    setIsQuizStarted(false);
  };

  return (
    <Router>
      <AppContainer>
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
                    <ContentContainer>
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
                <>
                  <Header />
                  <ContentContainer>
                    {isLoggedIn() ? (
                      <ProblemHistoryPage />
                    ) : (
                      <ProblemHistoryGuestPage />
                    )}
                  </ContentContainer>
                  <Footer />
                </>
              }
            />
            <Route
              path="/history/:date"
              element={
                <>
                  <Header />
                  <ContentContainer>
                    <ProblemDetailPage />
                  </ContentContainer>
                  <Footer />
                </>
              }
            />
            <Route
              path="/wrong-problems"
              element={
                <>
                  <Header />
                  <ContentContainer>
                    {isLoggedIn() ? (
                      <WrongProblemPage />
                    ) : (
                      <WrongProblemGuestPage />
                    )}
                  </ContentContainer>
                  <Footer />
                </>
              }
            />
            <Route
              path="/signup"
              element={
                <>
                  <Header />
                  <ContentContainer>
                    <SignUpPage />
                  </ContentContainer>
                  <Footer />
                </>
              }
            />
          </Routes>
        </DisplayContainer>
      </AppContainer>
    </Router>
  );
};

export default App;
