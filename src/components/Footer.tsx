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
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

// 콘텐츠 영역 컨테이너 (867px 기준 - Figma 디자인에 맞춤)
const ContentContainer = styled.div`
  width: 867px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-sizing: border-box;
  position: relative;
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
  position: absolute;

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
  position: absolute;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <DisplayContainer>
        <ContentContainer>
          <FooterLink
            href="https://www.notion.so/2480d810a5198028a431f471d3327ce0?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            style={{ left: "0px" }}
          >
            이용약관
          </FooterLink>
          <FooterLink
            href="https://www.notion.so/2480d810a51980b8831edc3dbb13333d?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            style={{ left: "103px" }}
          >
            개인정보처리방침
          </FooterLink>
          <FooterLink href="#" style={{ left: "254px" }}>
            Team. 에스F레소
          </FooterLink>
          <FooterLink
            href="mailto:liz021229@gmail.com"
            style={{ left: "406px" }}
          >
            문의: liz021229@gmail.com
          </FooterLink>
          <Copyright style={{ left: "629px" }}>
            © 2025 Quizly. All rights reserved.
          </Copyright>
        </ContentContainer>
      </DisplayContainer>
    </FooterContainer>
  );
};

export default Footer;
