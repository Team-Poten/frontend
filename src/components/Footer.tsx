import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  width: 100%;
  height: 5rem; /* 80px */
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
  min-width: 120rem; /* 1920px - 최소 너비 설정으로 간격 유지 */
  margin: 0 auto;

  /* 1920px 이상에서는 max-width 제한 */
  @media (min-width: 120rem) {
    max-width: 120rem; /* 1920px */
  }
`;

// 콘텐츠 영역 컨테이너 (867px 기준 - Figma 디자인에 맞춤)
const ContentContainer = styled.div`
  width: 54.1875rem; /* 867px */
  height: 2.25rem; /* 36px */
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
  font-size: 0.875rem; /* 14px */
  line-height: 1.4000000272478377em;
  color: #777777;
  text-decoration: none;
  padding: 0.5rem 0.75rem; /* 8px 12px */
  transition: color 0.2s ease;
  position: absolute;

  &:hover {
    color: #222222;
  }
`;

const Copyright = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 0.875rem; /* 14px */
  line-height: 1.4000000272478377em;
  color: #777777;
  padding: 0.5rem 0.75rem; /* 8px 12px */
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
            style={{ left: "0rem" }} /* 0px */
          >
            이용약관
          </FooterLink>
          <FooterLink
            href="https://www.notion.so/2480d810a51980b8831edc3dbb13333d?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            style={{ left: "6.4375rem" }} /* 103px */
          >
            개인정보처리방침
          </FooterLink>
          <FooterLink href="#" style={{ left: "15.875rem" }}>
            {" "}
            {/* 254px */}
            Team. 에스F레소
          </FooterLink>
          <FooterLink
            href="mailto:liz021229@gmail.com"
            style={{ left: "25.375rem" }} /* 406px */
          >
            문의: liz021229@gmail.com
          </FooterLink>
          <Copyright style={{ left: "39.3125rem" }}>
            {" "}
            {/* 629px */}© 2025 Quizly. All rights reserved.
          </Copyright>
        </ContentContainer>
      </DisplayContainer>
    </FooterContainer>
  );
};

export default Footer;
