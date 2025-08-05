import React, { useState } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import QuizPage from "./components/QuizPage";
import ProblemHistoryPage from "./components/ProblemHistoryPage";
import ProblemDetailPage from "./components/ProblemDetailPage";
import { Question } from "./services/api";

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
        <Routes>
          <Route
            path="/"
            element={
              isQuizStarted ? (
                <Navigate to="/quiz" replace />
              ) : (
                <>
                  <Header />
                  <MainContent onQuestionsGenerated={handleQuestionsGenerated} />
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
                <ProblemHistoryPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/history/:date"
            element={
              <>
                <Header />
                <ProblemDetailPage />
                <Footer />
              </>
            }
          />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;
