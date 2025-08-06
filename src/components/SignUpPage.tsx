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
  width: 334px;
  height: 284px;
  display: flex;
  position: relative;
  margin-top: 40px;
`;

const Character = styled.img`
  position: absolute;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: -6px 6px 12px 0px rgba(0, 0, 0, 0.16);
`;

const Character1 = styled(Character)`
  width: 156px;
  height: 156px;
  top: 154px;
  left: 204px;
`;

const Character2 = styled(Character)`
  width: 85px;
  height: 78px;
  top: 92px;
  left: 0px;
`;

const Character3 = styled(Character)`
  width: 120px;
  height: 120px;
  top: 204px;
  left: 76px;
`;

const Character4 = styled(Character)`
  width: 72px;
  height: 72px;
  top: 0px;
  left: 204px;
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
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
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
  padding: 12px 0;
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
  color: ${(props) => {
    switch (props.type) {
      case "error":
        return "#FF243E";
      case "success":
        return "#2473FC";
      case "info":
        return "#777777";
      default:
        return "#777777";
    }
  }};
  margin: 4px 0 0 0;
  text-align: left;
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
  width: 440px;
  height: 356px;
  background-color: #ffffff;
  border: 1px solid #b7b7b7;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
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

const ModalTitle = styled.h3`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.4;
  color: #222222;
  text-align: center;
  margin: 0 0 20px 0;
  width: 206px;
  height: 34px;
`;

const ModalSubtitle = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.4;
  color: #777777;
  text-align: center;
  margin: 0 0 20px 0;
  width: 83px;
  height: 25px;
`;

const ModalDescription = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  color: #777777;
  text-align: center;
  margin: 0;
  width: 266px;
  height: 25px;
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

  // 비밀번호 조건 검증 함수
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

  // 각 단계별 활성화 상태 확인
  const isNicknameEnabled = formData.nickname.trim() !== "";
  const isPasswordEnabled = isNicknameEnabled && idDuplicateStatus === "available";
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

    // ID 변경 시 중복 확인 상태 초기화
    if (name === "loginId") {
      setIdDuplicateStatus("none");
    }

    // 비밀번호 확인 검증
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
    if (!isSignUpEnabled) {
      return;
    }

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
        // 에러 응답
        alert(response.message || "회원가입에 실패했습니다.");
      } else {
        // 성공 응답
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
            <Character1 src="/images/character1.png" alt="캐릭터1" />
            <Character2 src="/images/character3.png" alt="캐릭터3" />
            <Character3 src="/images/character2.png" alt="캐릭터2" />
            <Character4 src="/images/character4.png" alt="캐릭터4" />
          </CharacterGroup>
        </LeftSection>
        <RightSection>
          <FormTitle>회원가입</FormTitle>

          <InputGroup>
            <InputLabel>닉네임</InputLabel>
            <Input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              placeholder="닉네임을 입력하세요"
            />
          </InputGroup>

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
            {idDuplicateStatus === "duplicate" && (
              <MessageText type="error">중복된 아이디 입니다.</MessageText>
            )}
            {idDuplicateStatus === "available" && (
              <MessageText type="success">
                아이디 사용이 가능합니다.
              </MessageText>
            )}
          </InputGroup>

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
            {passwordError &&
              formData.password &&
              !validatePassword(formData.password).isValid && (
                <MessageText type="error">{passwordError}</MessageText>
              )}
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
            {passwordError && formData.passwordConfirm && (
              <MessageText type="error">{passwordError}</MessageText>
            )}
            {formData.passwordConfirm &&
              !passwordError &&
              formData.password === formData.passwordConfirm && (
                <MessageText type="success">비밀번호가 일치합니다.</MessageText>
              )}
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
          <ModalTitle>아이디가 생성됐어요 !</ModalTitle>
          <ModalSubtitle>{formData.loginId}</ModalSubtitle>
          <ModalDescription>
            더 많은 문제를 생성해보러 가볼까요 ?
          </ModalDescription>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default SignUpPage;
