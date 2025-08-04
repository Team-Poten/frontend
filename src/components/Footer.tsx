import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  width: 100%;
  height: 90px;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FooterContent = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  max-width: 916px;
  width: 100%;
  justify-content: center;
`;

const FooterLink = styled.a`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  color: #777777;
  text-decoration: none;
  padding: 8px 12px;
  transition: color 0.2s ease;

  &:hover {
    color: #222222;
  }
`;

const Copyright = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  color: #777777;
  padding: 8px 12px;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLink href="#">이용약관</FooterLink>
        <FooterLink href="#">개인정보처리방침</FooterLink>
        <FooterLink href="#">Team. 에스F레소</FooterLink>
        <FooterLink href="mailto:liz021229@gmail.com">문의: liz021229@gmail.com</FooterLink>
        <Copyright>© 2025 Quizly. All rights reserved.</Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
