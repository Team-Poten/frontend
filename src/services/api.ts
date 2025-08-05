export interface Question {
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

const API_BASE_URL = "http://localhost:8080/api/v1";

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
    const response = await fetch(`${API_BASE_URL}/clova/question`, {
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

export const getProblemHistory = async (): Promise<ProblemHistoryResponse[]> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("로그인이 필요합니다");
    }

    const response = await fetch(`${API_BASE_URL}/question`, {
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
