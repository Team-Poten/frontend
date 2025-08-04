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

const API_BASE_URL = "http://localhost:8080/api/v1";

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
