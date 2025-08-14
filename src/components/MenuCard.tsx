import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface MenuCardProps {
  title: string;
  icon: string;
}

const CardContainer = styled.div`
  display: inline-flex; /* 변경: flex -> inline-flex */
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  background-color: #ffffff;
  border: 1px solid #ededed;
  border-radius: 16px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  box-sizing: border-box;

  /* width 속성이 없는 것이 핵심입니다! */

  &:hover {
    transform: translateY(-2px);
    box-shadow: 6px 6px 16px rgba(0, 0, 0, 0.08);
    border-color: #30a10e;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconBox = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const IconImage = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const Title = styled.h3`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.4em;
  color: #222222;
  margin: 0;
  white-space: nowrap;
`;

const MenuCard: React.FC<MenuCardProps> = ({ title, icon }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    switch (title) {
      case "문제 만들기":
        navigate("/");
        break;
      case "문제 모아보기":
        navigate("/history");
        break;
      case "틀린문제 풀어보기":
        navigate("/wrong-problems");
        break;
      default:
        break;
    }
  };

  const getIconSrc = () => {
    switch (icon) {
      case "light":
        return "/images/icn_light.png";
      case "book":
        return "/images/icn_book.png";
      case "write":
        return "/images/icn_write.png";
      default:
        return "";
    }
  };

  return (
    <CardContainer onClick={handleClick}>
      <IconContainer>
        <IconBox>
          <IconImage src={getIconSrc()} alt={title} />
        </IconBox>
        <Title>{title}</Title>
      </IconContainer>
    </CardContainer>
  );
};

export default MenuCard;