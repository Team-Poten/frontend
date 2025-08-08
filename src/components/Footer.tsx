import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  width: 100%;
  height: 80px;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 전체 디스플레이 컨테이너 (1920px 기준)
const DisplayContainer = styled.div`
  max-width: 1920px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 콘텐츠 영역 컨테이너 (1024px 기준)
const ContentContainer = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  height: 36px;
  padding-left: 24px;
  padding-right: 24px;
  box-sizing: border-box;
`;

const FooterLink = styled.a`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4000000272478377em;
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
  font-size: 14px;
  line-height: 1.4000000272478377em;
  color: #777777;
  padding: 8px 12px;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <DisplayContainer>
        <ContentContainer>
          <FooterLink href="#">이용약관</FooterLink>
          <FooterLink href="#">개인정보처리방침</FooterLink>
          <FooterLink href="#">Team. 에스F레소</FooterLink>
          <FooterLink href="mailto:liz021229@gmail.com">
            문의: liz021229@gmail.com
          </FooterLink>
          <Copyright>© 2025 Quizly. All rights reserved.</Copyright>
        </ContentContainer>
      </DisplayContainer>
    </FooterContainer>
  );
};

export default Footer;
