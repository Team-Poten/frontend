export interface Question {
  questionId: number;
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
  questionId: number;
  question: string;
  type: string;
  options: string[];
  answer: string;
  explanation: string;
  createdAt: string;
  updatedAt: string;
  latestSolveStatus: string; // "CORRECT" | "INCORRECT"
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

export interface SignUpRequest {
  loginId: string;
  password: string;
  nickname: string;
}

export interface SignUpResponse {
  code?: string;
  message?: string;
}

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  code?: string;
  message?: string;
}

const API_BASE_URL = "https://api.quicklyapp.store/api";
//const API_BASE_URL = "http://localhost:8080/api";
//

// 403 에러를 위한 커스텀 에러 클래스
export class UnauthorizedError extends Error {
  constructor(
    message: string = "인증이 만료되었습니다. 로그인을 다시 해주세요."
  ) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

// 로그인 상태 확인
export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("accessToken");
  return !!token;
};

// 로그아웃 (토큰 제거)
export const logout = (): void => {
  localStorage.removeItem("accessToken");
  // 쿠키에서 refreshToken 제거
  document.cookie =
    "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

// 자동 로그아웃 (403 에러 시 사용) - 토큰 제거 후 로그인 모달 표시용 파라미터와 함께 새로고침
export const autoLogout = (): void => {
  logout();
  // 새로고침 후 로그인 모달을 열기 위한 쿼리 파라미터 추가
  const url = new URL(window.location.href);
  url.searchParams.set("showLogin", "true");
  window.location.href = url.toString();
};

// Access Token 가져오기
export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

// 로그인 API
export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return data; // 에러 응답
    }

    // 성공 시 토큰 저장
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);

      // refreshToken을 쿠키에 저장
      document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=2592000`; // 30일
    }

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const createQuestions = async (
  text: string,
  type?: "TRUE_FALSE" | "MULTIPLE_CHOICE"
): Promise<Question[]> => {
  try {
    const requestBody = {
      plainText: text,
      type: type || "TRUE_FALSE",
    };

    // 기본 헤더만 설정
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // 로그인된 사용자만 Authorization 헤더 추가
    const token = getAccessToken();
    if (token && token.trim() !== "") {
      headers.Authorization = `Bearer ${token}`;
    }


    const response = await fetch(`${API_BASE_URL}/v1/clova/question`, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });


    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
        console.error("API 에러 응답 본문:", errorText);
      } catch (e) {
        console.error("API 에러 응답 본문 읽기 실패:", e);
      }

      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();

    let questionData: any = data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      if (data.questions && Array.isArray(data.questions)) {
        questionData = data.questions;
      } else if (data.data && Array.isArray(data.data)) {
        questionData = data.data;
      }
    }

    return questionData || data;
  } catch (error) {
    console.error("Error creating questions:", error);
    throw error;
  }
};

// 파일 업로드를 통한 문제 생성 API
export const createQuestionsFromFile = async (
  file: File,
  type: "TRUE_FALSE" | "MULTIPLE_CHOICE"
): Promise<Question[]> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);

    // 기본 헤더만 설정 (Content-Type은 FormData가 자동으로 설정)
    const headers: Record<string, string> = {};

    // 로그인된 사용자만 Authorization 헤더 추가
    const token = getAccessToken();
    if (token && token.trim() !== "") {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/v1/clova/question/ocr`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
        console.error("파일 업로드 API 에러 응답 본문:", errorText);
      } catch (e) {
        console.error("파일 업로드 API 에러 응답 본문 읽기 실패:", e);
      }

      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating questions from file:", error);
    throw error;
  }
};

// 문제 날짜별 조회 API
export const getProblemHistory = async (): Promise<
  ProblemHistoryResponse[]
> => {
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
      if (response.status === 403) {
        throw new UnauthorizedError();
      }
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
    const response = await fetch(
      `${API_BASE_URL}/questions/${questionId}/guest-answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAnswer,
        } as GuestAnswerRequest),
      }
    );

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

    const response = await fetch(
      `${API_BASE_URL}/questions/${questionId}/answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userAnswer,
        } as AnswerRequest),
      }
    );

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

// 회원가입 API
export const signUp = async (
  request: SignUpRequest
): Promise<SignUpResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData;
    }

    return {};
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// ID 중복 확인 API
export const checkIdDuplicate = async (loginId: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/user/check-id?loginId=${encodeURIComponent(loginId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // true: 중복, false: 사용 가능
  } catch (error) {
    console.error("Error checking ID duplicate:", error);
    throw error;
  }
};
