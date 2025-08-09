import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  width: 100%;
  background-color: #f8f9fa;
  border-top: 1px solid #dedede;
`;

const FooterContent = styled.div`
  max-width: 1920px;
  margin: 0 auto;
  padding: 40px 360px 40px 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FooterText = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4em;
  color: #777777;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>© 2024 Quizly. All rights reserved.</FooterText>
        <FooterText>Made with ❤️ for better learning</FooterText>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
