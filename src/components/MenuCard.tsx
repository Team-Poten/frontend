import React from "react";
import styled from "styled-components";

interface MenuCardProps {
  title: string;
  description: string;
  icon: string;
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 26px;
  background-color: #ffffff;
  border: 1px solid #ededed;
  border-radius: 16px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  width: 260px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 6px 6px 16px rgba(0, 0, 0, 0.08);
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconBox = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h3`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4em;
  color: #222222;
  margin: 0;
`;

const Description = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.399999976158142em;
  color: #777777;
  text-align: center;
  margin: 0;
  width: 260px;
`;

const LightIcon = () => (
  <svg
    width="17"
    height="23"
    viewBox="0 0 17 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5.54 2.33L16.92 23.33H0L5.54 2.33Z" fill="#FFE267" />
  </svg>
);

const BookIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="28" height="28" fill="white" />
    <rect x="4" y="2" width="20" height="24" fill="#2EB05B" rx="3" />
    <rect x="7" y="6" width="14" height="6" fill="white" rx="1" />
  </svg>
);

const WriteIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.92 0.01L20.21 20.21H0.01L4.92 0.01Z" fill="#FFB682" />
    <path d="M1.25 16.77L7.12 23.89H0L1.25 16.77Z" fill="#00BCF8" />
    <path d="M16.17 0.01L25.12 8.96H16.17V0.01Z" fill="#00BCF8" />
  </svg>
);

const MenuCard: React.FC<MenuCardProps> = ({ title, description, icon }) => {
  const renderIcon = () => {
    switch (icon) {
      case "light":
        return <LightIcon />;
      case "book":
        return <BookIcon />;
      case "write":
        return <WriteIcon />;
      default:
        return null;
    }
  };

  return (
    <CardContainer>
      <IconContainer>
        <IconBox>{renderIcon()}</IconBox>
        <Title>{title}</Title>
      </IconContainer>
      <Description>{description}</Description>
    </CardContainer>
  );
};

export default MenuCard;
