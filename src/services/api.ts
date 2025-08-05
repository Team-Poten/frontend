export interface Question {
  id?: number;
  question: string;
  type: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface CreateQuestionRequest {
  plainText: string;
  type: string;
}

export interface ProblemHistory {
  id: string;
  date: string;
  title: string;
  questionCount: number;
  createdAt: string;
}

export interface QuestionDetail {
  questionText: string;
  answer: string;
  questionType: string;
  explanation: string;
}

export interface ProblemHistoryResponse {
  date: string;
  questions: QuestionDetail[];
}

export interface GuestAnswerRequest {
  userAnswer: string;
}

export interface GuestAnswerResponse {
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  correct?: boolean; // 추가된 필드
  explanation: string;
}

// 회원용 채점 API (기존 GuestAnswerResponse와 동일한 응답 구조)
export interface AnswerRequest {
  userAnswer: string;
}

export interface AnswerResponse {
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  correct?: boolean; // 추가된 필드
  explanation: string;
}

const API_BASE_URL = "http://localhost:8080/api";

// 로그인 상태 확인
export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("accessToken");
  return !!token;
};

// Access Token 가져오기
export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const createQuestions = async (plainText: string): Promise<Question[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/clova/question`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plainText,
        type: "TRUE_FALSE",
      } as CreateQuestionRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating questions:", error);
    throw error;
  }
};

// 문제 날짜별 조회 API
export const getProblemHistory = async (): Promise<ProblemHistoryResponse[]> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("로그인이 필요합니다");
    }

    const response = await fetch(`${API_BASE_URL}/v1/question`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching problem history:", error);
    throw error;
  }
};

// 비회원용 채점 API
export const submitGuestAnswer = async (
  questionId: number,
  userAnswer: string
): Promise<GuestAnswerResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/guest-answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userAnswer,
      } as GuestAnswerRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting guest answer:", error);
    throw error;
  }
};

// 문제 ID로 문제 조회
export const getProblemById = async (id: string): Promise<Question[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/problems/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching problem by id:", error);
    throw error;
  }
};

// 회원용 채점 API
export const submitAnswer = async (
  questionId: number,
  userAnswer: string
): Promise<AnswerResponse> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userAnswer,
      } as AnswerRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting answer:", error);
    throw error;
  }
};