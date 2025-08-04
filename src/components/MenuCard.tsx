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
  background-color: #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const Title = styled.h3`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  color: #222222;
  margin: 0;
`;

const Description = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  color: #777777;
  text-align: center;
  margin: 0;
  width: 260px;
`;

const MenuCard: React.FC<MenuCardProps> = ({ title, description, icon }) => {
  return (
    <CardContainer>
      <IconContainer>
        <IconBox>{icon}</IconBox>
        <Title>{title}</Title>
      </IconContainer>
      <Description>{description}</Description>
    </CardContainer>
  );
};

export default MenuCard;
