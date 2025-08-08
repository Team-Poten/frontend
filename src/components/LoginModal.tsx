import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (loginId: string, password: string) => void;
  error?: string;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 500px;
  height: 526px;
  background-color: #ffffff;
  border: 1px solid #dedede;
  border-radius: 24px;
  box-shadow: 4px 4px 12px 0px rgba(0, 0, 0, 0.04);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
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

const ModalTitle = styled.h2`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.3999999364217122em;
  color: #222222;
  margin: 70px 0 32px 0;
  text-align: center;
`;

const InputContainer = styled.div`
  width: 350px;
  margin-bottom: 36px;
`;

const InputLabel = styled.label`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.399999976158142em;
  color: #777777;
  display: block;
  margin-bottom: 0px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 8px 0;
  border: none;
  border-bottom: 1px solid #dedede;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.399999976158142em;
  color: #222222;
  background: none;
  outline: none;

  &::placeholder {
    color: #9e9e9e;
  }

  &:focus {
    border-bottom-color: #30a10e;
  }
`;

const LoginButton = styled.button`
  width: 350px;
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
  margin-bottom: 20px;

  &:hover {
    background-color: #2a8f0c;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const SignUpButton = styled.button`
  width: 350px;
  padding: 12px 16px;
  background-color: #f6fbf4;
  color: #30a10e;
  border: none;
  border-radius: 6px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.399999976158142em;
  cursor: pointer;

  &:hover {
    background-color: #e8f5e8;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  error,
}) => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId.trim() && password.trim()) {
      onLogin(loginId.trim(), password.trim());
    }
  };

  const handleClose = () => {
    setLoginId("");
    setPassword("");
    onClose();
  };

  const handleSignUp = () => {
    handleClose();
    navigate("/signup");
  };

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        <CloseButton onClick={handleClose} />
        <ModalTitle>로그인</ModalTitle>
        <form onSubmit={handleSubmit}>
          <InputContainer>
            <InputLabel>아이디</InputLabel>
            <InputField
              type="text"
              placeholder="아이디를 입력해주세요"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />
          </InputContainer>
          <InputContainer>
            <InputLabel>비밀번호</InputLabel>
            <InputField
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputContainer>
          <LoginButton
            type="submit"
            disabled={!loginId.trim() || !password.trim()}
          >
            로그인
          </LoginButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
        <SignUpButton type="button" onClick={handleSignUp}>
          회원가입
        </SignUpButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default LoginModal;
