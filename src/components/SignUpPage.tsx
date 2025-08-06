import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { signUp, SignUpRequest } from "../services/api";
import character1 from "../assets/character1.png";
import character2 from "../assets/character2.png";
import character3 from "../assets/character3.png";
import character4 from "../assets/character4.png";

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
  width: 974px;
  height: 690px;
  background-color: #fcfcfc;
  border: 1px solid #dedede;
  border-radius: 30px;
  box-shadow: 4px 4px 12px 0px rgba(0, 0, 0, 0.04);
  display: flex;
  position: relative;
`;

const LeftSection = styled.div`
  width: 466px;
  height: 687px;
  background-color: #f4f4f4;
  border-radius: 30px 0 0 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const CharacterGroup = styled.div`
  width: 334px;
  height: 284px;
  display: flex;
  position: relative;
  margin-bottom: 40px;
`;

const Character = styled.img`
  position: absolute;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 6px 10px 10px 0px rgba(0, 0, 0, 0.14);
`;

const Character1 = styled(Character)`
  width: 75.7px;
  height: 75.61px;
  top: 0;
  left: 20.93px;
`;

const Character2 = styled(Character)`
  width: 83.28px;
  height: 83.09px;
  top: 92.13px;
  left: 0;
`;

const Character3 = styled(Character)`
  width: 80px;
  height: 80px;
  top: 204.01px;
  left: 76px;
`;

const Character4 = styled(Character)`
  width: 130px;
  height: 130px;
  top: 154.01px;
  left: 204px;
`;

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 28px;
  line-height: 1.4;
  color: #222222;
  text-align: center;
  margin: 0 0 20px 0;
  width: 314px;
  height: 78px;
`;

const Subtitle = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.4;
  color: #777777;
  text-align: center;
  margin: 0;
  width: 158px;
  height: 60px;
`;

const RightSection = styled.div`
  width: 508px;
  height: 690px;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormTitle = styled.h2`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 28px;
  line-height: 1.4;
  color: #222222;
  text-align: center;
  margin: 0 0 40px 0;
  width: 113px;
  height: 45px;
`;

const InputGroup = styled.div`
  width: 343px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const InputLabel = styled.label`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.4;
  color: #777777;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const Input = styled.input`
  flex: 1;
  padding: 16px 0;
  border: none;
  border-bottom: 1px solid #dedede;
  background: transparent;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  color: #222222;
  outline: none;

  &::placeholder {
    color: #222222;
  }
`;

const DuplicateCheckButton = styled.button`
  width: 70px;
  height: 34px;
  background-color: transparent;
  border: 1px solid #30a10e;
  border-radius: 200px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  color: #222222;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #30a10e;
    color: #ffffff;
  }
`;

const PasswordConfirmMessage = styled.p<{ isError: boolean }>`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  color: ${(props) => (props.isError ? "#ff0000" : "#30a10e")};
  margin: 4px 0 0 0;
  text-align: left;
  width: 100%;
`;

const SignUpButton = styled.button`
  width: 343px;
  height: 48px;
  background-color: #30a10e;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 20px;

  &:hover {
    background-color: #2a8f0c;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 비밀번호 확인 검증
    if (name === "password" || name === "passwordConfirm") {
      if (name === "password") {
        if (formData.passwordConfirm && value !== formData.passwordConfirm) {
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

  const handleDuplicateCheck = () => {
    // 추후 중복확인 API 연결 예정
    console.log("중복확인 버튼 클릭");
  };

  const handleSignUp = async () => {
    if (formData.password !== formData.passwordConfirm) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
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
          <CharacterGroup>
            <Character1 src={character1} alt="캐릭터1" />
            <Character2 src={character2} alt="캐릭터2" />
            <Character3 src={character3} alt="캐릭터3" />
            <Character4 src={character4} alt="캐릭터4" />
          </CharacterGroup>
          <Title>
            요약한 내용을 문제로!
            <br />
            오답까지 챙겨주는 나만의 AI
          </Title>
          <Subtitle>
            로그인하여 더 많은
            <br />
            문제를 생성해보세요 !
          </Subtitle>
        </LeftSection>
        <RightSection>
          <FormTitle>회원가입</FormTitle>

          <InputGroup>
            <InputLabel>아이디</InputLabel>
            <InputContainer>
              <Input
                type="text"
                name="loginId"
                value={formData.loginId}
                onChange={handleInputChange}
                placeholder="아이디를 입력하세요"
              />
              <DuplicateCheckButton onClick={handleDuplicateCheck}>
                중복확인*
              </DuplicateCheckButton>
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <InputLabel>비밀번호</InputLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
            />
          </InputGroup>

          <InputGroup>
            <InputLabel>비밀번호 확인</InputLabel>
            <Input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 입력하세요"
            />
            {passwordError && (
              <PasswordConfirmMessage isError={true}>
                {passwordError}
              </PasswordConfirmMessage>
            )}
            {formData.passwordConfirm &&
              !passwordError &&
              formData.password === formData.passwordConfirm && (
                <PasswordConfirmMessage isError={false}>
                  비밀번호가 일치합니다.
                </PasswordConfirmMessage>
              )}
          </InputGroup>

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

          <SignUpButton onClick={handleSignUp} disabled={isLoading}>
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
