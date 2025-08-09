import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);
  padding: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 8px 8px 24px rgba(0, 0, 0, 0.08);
    border-color: #30a10e;
  }
`;

const CardTitle = styled.h3`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 1.4em;
  color: #222222;
  margin-bottom: 16px;
`;

const CardDescription = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5em;
  color: #777777;
  margin-bottom: 24px;
`;

const CardIcon = styled.img`
  width: 48px;
  height: 48px;
  margin-bottom: 24px;
`;

const MenuCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}> = ({ title, description, icon, onClick }) => {
  return (
    <CardContainer onClick={onClick}>
      <CardIcon src={icon} alt={`${title} icon`} />
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardContainer>
  );
};

export default MenuCard;
