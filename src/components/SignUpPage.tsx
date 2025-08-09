import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { signUp, SignUpRequest, checkIdDuplicate } from "../services/api";

const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 170px);
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

const SignUpCard = styled.div`
  width: 976px;
  height: 688px;
  background-color: #ffffff;
  border: 1px solid #dedede;
  border-radius: 24px;
  box-shadow: 4px 4px 12px 0px rgba(0, 0, 0, 0.04);
  display: flex;
  position: relative;
`;

const LeftSection = styled.div`
  width: 486px;
  height: 688px;
  background-color: #f6f6f6;
  border-radius: 24px 0 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  overflow: hidden;
  padding-top: 80px;
`;

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.3999999364217122em;
  color: #222222;
  text-align: center;
  margin: 0 0 20px 0;
  width: 316px;
  height: 68px;
`;

const Subtitle = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.3999999364217122em;
  color: #777777;
  text-align: center;
  margin: 0 0 40px 0;
  width: 185px;
  height: 50px;
`;

const CharacterGroup = styled.div`
  width: 286px;
  height: 330px;
  display: flex;
  position: relative;
  margin-top: 40px;
`;

const SignUpImage = styled.img`
  width: 286px;
  height: 330px;
  object-fit: contain;
`;

const RightSection = styled.div`
  width: 490px;
  height: 688px;
  padding: 70px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormTitle = styled.h2`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.3999999364217122em;
  color: #222222;
  text-align: center;
  margin: 0 0 40px 0;
  width: 83px;
  height: 34px;
`;

const InputGroup = styled.div`
  width: 350px;
  display: grid;
  grid-template-rows: auto auto 20px; /* label, input, message */
  margin-bottom: 8px;
`;

const MessageRow = styled.div`
  height: 20px;
  display: flex;
  align-items: flex-start;
`;

const InputLabel = styled.label`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.399999976158142em;
  color: #777777;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const Input = styled.input<{ disabled?: boolean }>`
  flex: 1;
  padding: 10px 0;
  border: none;
  border-bottom: 1px solid #dedede;
  background: transparent;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.399999976158142em;
  color: ${(props) => (props.disabled ? "#cccccc" : "#222222")};
  outline: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "text")};

  &::placeholder {
    color: ${(props) => (props.disabled ? "#cccccc" : "#9e9e9e")};
  }

  &:disabled {
    background-color: transparent;
  }
`;

const DuplicateCheckButton = styled.button`
  width: 82px;
  height: 48px;
  background-color: #f6fbf4;
  border: none;
  border-radius: 6px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.399999976158142em;
  color: #30a10e;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e8f5e6;
  }
`;

const MessageText = styled.p<{ type: "error" | "success" | "info" }>`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4000000272478377em;
  margin: 0; /* ← 여기! margin-top 제거 */
  text-align: left;
  width: 100%;
  color: ${(props) => {
    switch (props.type) {
      case "error":
        return "#FF243E";
      case "success":
        return "#2473FC";
      case "info":
      default:
        return "#777777";
    }
  }};
  transition: opacity 0.15s ease; /* 부드럽게 */
`;

/** 메시지 영역 고정(항상 렌더링, 필요 없으면 visibility로만 숨김) */
const MessageWrapper = styled.div`
  min-height: 20px; /* 14px 글자 + line-height 대비 안정 높이 */
  width: 100%;
`;

const SignUpButton = styled.button<{ disabled: boolean }>`
  width: 350px;
  height: 48px;
  background-color: ${(props) => (props.disabled ? "#cccccc" : "#30a10e")};
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.399999976158142em;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s ease;
  margin-top: 20px;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#cccccc" : "#2a8f0c")};
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 420px;
  height: 314px;
  background-color: #ffffff;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 40px 50px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 14.77px;
    height: 2.5px;
    background-color: #494949;
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`;

const SuccessIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: #f6fbf4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 32px;
    height: 24px;
    background: url("data:image/svg+xml,%3Csvg width='32' height='24' viewBox='0 0 32 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 12L12 22L30 2' stroke='%2330A10E' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
      no-repeat center;
    background-size: contain;
  }
`;

const ModalTitle = styled.h3`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.3999999364217122em;
  color: #222222;
  text-align: center;
  margin: 0 0 12px 0;
`;

const ModalDescription = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.399999976158142em;
  color: #777777;
  text-align: center;
  margin: 0 0 24px 0;
  white-space: pre-line;
`;

const ActionButton = styled.button`
  width: 160px;
  padding: 12px 16px;
  background-color: #30a10e;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.399999976158142em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #2a8f0c;
  }
`;

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [idDuplicateStatus, setIdDuplicateStatus] = useState<
    "none" | "checking" | "duplicate" | "available"
  >("none");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    const hasEnglish = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8 && password.length <= 16;

    return {
      hasEnglish,
      hasNumber,
      hasSpecial,
      isValidLength,
      isValid: hasEnglish && hasNumber && hasSpecial && isValidLength,
    };
  };

  const isNicknameEnabled = formData.nickname.trim() !== "";
  const isPasswordEnabled =
    isNicknameEnabled && idDuplicateStatus === "available";
  const isPasswordConfirmEnabled =
    isPasswordEnabled && validatePassword(formData.password).isValid;
  const isSignUpEnabled =
    isPasswordConfirmEnabled &&
    formData.passwordConfirm &&
    formData.password === formData.passwordConfirm &&
    formData.nickname.trim() !== "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "loginId") {
      setIdDuplicateStatus("none");
    }

    if (name === "password" || name === "passwordConfirm") {
      if (name === "password") {
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
          setPasswordError("영어, 숫자, 특수문자 포함 8~16자");
        } else if (
          formData.passwordConfirm &&
          value !== formData.passwordConfirm
        ) {
          setPasswordError("비밀번호가 일치하지 않습니다.");
        } else if (
          formData.passwordConfirm &&
          value === formData.passwordConfirm
        ) {
          setPasswordError("");
        } else {
          setPasswordError("");
        }
      } else if (name === "passwordConfirm") {
        if (formData.password && value !== formData.password) {
          setPasswordError("비밀번호가 일치하지 않습니다.");
        } else if (formData.password && value === formData.password) {
          setPasswordError("");
        }
      }
    }
  };

  const handleDuplicateCheck = async () => {
    if (!formData.loginId.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }

    setIdDuplicateStatus("checking");

    try {
      const isDuplicate = await checkIdDuplicate(formData.loginId);
      setIdDuplicateStatus(isDuplicate ? "duplicate" : "available");
    } catch (error) {
      console.error("ID 중복 확인 에러:", error);
      alert("ID 중복 확인 중 오류가 발생했습니다.");
      setIdDuplicateStatus("none");
    }
  };

  const handleSignUp = async () => {
    if (!isSignUpEnabled) return;

    if (formData.password !== formData.passwordConfirm) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setPasswordError("영어, 숫자, 특수문자 포함 8~16자");
      return;
    }

    if (idDuplicateStatus !== "available") {
      alert("아이디 중복 확인을 완료해주세요.");
      return;
    }

    if (!formData.loginId || !formData.password || !formData.nickname) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const signUpRequest: SignUpRequest = {
        loginId: formData.loginId,
        password: formData.password,
        nickname: formData.nickname,
      };

      const response = await signUp(signUpRequest);

      if (response.code) {
        alert(response.message || "회원가입에 실패했습니다.");
      } else {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  // 표시 여부 계산(가독성용)
  const showIdMsg =
    idDuplicateStatus === "duplicate" || idDuplicateStatus === "available";
  const idMsgText =
    idDuplicateStatus === "duplicate"
      ? "중복된 아이디 입니다."
      : "아이디 사용이 가능합니다.";
  const idMsgType =
    idDuplicateStatus === "duplicate"
      ? ("error" as const)
      : ("success" as const);

  const showPwError =
    !!passwordError &&
    !!formData.password &&
    !validatePassword(formData.password).isValid;

  const showConfirmError = !!passwordError && !!formData.passwordConfirm;
  const showConfirmSuccess =
    !!formData.passwordConfirm &&
    !passwordError &&
    formData.password === formData.passwordConfirm;

  return (
    <Container>
      <SignUpCard>
        <LeftSection>
          <Title>
            요약한 내용을 문제로!
            <br />
            오답까지 챙겨주는 나만의 AI 공부
          </Title>
          <Subtitle>
            로그인해서 더 많은 문제를
            <br />
            생성하고 복습해보세요!
          </Subtitle>
          <CharacterGroup>
            <SignUpImage src="/images/signupGroup.png" alt="회원가입 그룹" />
          </CharacterGroup>
        </LeftSection>

        <RightSection>
          <FormTitle>회원가입</FormTitle>

          {/* 닉네임 */}
          <InputGroup>
            <InputLabel>닉네임</InputLabel>
            <Input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              placeholder="닉네임을 입력하세요"
            />
            {/* 닉네임은 메시지 없음 → 공간 유지 불필요 */}
          </InputGroup>

          {/* 아이디 + 중복 확인 메시지 (고정 영역) */}
          <InputGroup>
            <InputLabel>아이디</InputLabel>

            <InputContainer>
              <Input
                type="text"
                name="loginId"
                value={formData.loginId}
                onChange={handleInputChange}
                placeholder="아이디를 입력하세요"
                disabled={!isNicknameEnabled}
              />
              <DuplicateCheckButton onClick={handleDuplicateCheck}>
                {idDuplicateStatus === "checking" ? "확인중..." : "중복확인"}
              </DuplicateCheckButton>
            </InputContainer>

            <MessageRow>
              <MessageText
                type={showIdMsg ? idMsgType : "info"}
                style={{ opacity: showIdMsg ? 1 : 0 }}
              >
                {showIdMsg ? idMsgText : ""}
              </MessageText>
            </MessageRow>
          </InputGroup>

          {/* 비밀번호 메시지 (고정 영역) */}
          <InputGroup>
            <InputLabel>비밀번호</InputLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력해주세요"
              disabled={!isPasswordEnabled}
            />
            <MessageRow>
              <MessageText
                type="error"
                style={{ opacity: showPwError ? 1 : 0 }}
              >
                {showPwError ? passwordError : ""}
              </MessageText>
            </MessageRow>
          </InputGroup>

          <InputGroup>
            <InputLabel>비밀번호 확인</InputLabel>
            <Input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 입력해주세요"
              disabled={!isPasswordConfirmEnabled}
            />
            <MessageRow>
              <MessageText
                type={showConfirmError ? "error" : "success"}
                style={{
                  opacity: showConfirmError || showConfirmSuccess ? 1 : 0,
                }}
              >
                {showConfirmError
                  ? passwordError
                  : showConfirmSuccess
                    ? "비밀번호가 일치합니다."
                    : ""}
              </MessageText>
            </MessageRow>
          </InputGroup>

          <SignUpButton
            onClick={handleSignUp}
            disabled={!isSignUpEnabled || isLoading}
          >
            {isLoading ? "처리중..." : "회원가입 하기"}
          </SignUpButton>
        </RightSection>
      </SignUpCard>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <CloseButton onClick={handleCloseModal} />
          <SuccessIcon />
          <ModalTitle>회원가입 완료</ModalTitle>
          <ModalDescription>
            {
              "당신만의 학습 도우미가 준비됐어요!\n오늘은 어떤 걸 공부해 볼까요?"
            }
          </ModalDescription>
          <ActionButton onClick={handleCloseModal}>
            문제 만들러 가기
          </ActionButton>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default SignUpPage;
