import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface MenuCardProps {
  title: string;
  icon: string;
}

const CardContainer = styled.div<{ disabled?: boolean }>`
  display: inline-flex; /* 변경: flex -> inline-flex */
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  background-color: #ffffff;
  border: 1px solid #ededed;
  border-radius: 16px;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04);
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  box-sizing: border-box;
  position: relative;

  /* width 속성이 없는 것이 핵심입니다! */

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.disabled
        ? "4px 4px 12px rgba(0, 0, 0, 0.04)"
        : "6px 6px 16px rgba(0, 0, 0, 0.08)"};
    border-color: ${(props) => (props.disabled ? "#ededed" : "#30a10e")};
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

const Title = styled.h3<{ disabled?: boolean }>`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.4em;
  color: ${(props) => (props.disabled ? "#cccccc" : "#222222")};
  margin: 0;
  white-space: nowrap;
`;

const Tooltip = styled.div`
  position: absolute;
  top: -45px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333333;
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4000000272478377em;
  white-space: nowrap;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #333333;
  }
`;

const CardWrapper = styled.div`
  position: relative;

  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

const MenuCard: React.FC<MenuCardProps> = ({ title, icon }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // "객관식 문제 만들기"는 클릭 비활성화
    if (title === "객관식 문제 만들기") {
      return;
    }

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

  const isDisabled = title === "객관식 문제 만들기";
  const tooltipText = isDisabled ? "로그인이 필요합니다" : "";

  return (
    <CardWrapper>
      <CardContainer onClick={handleClick} disabled={isDisabled}>
        <IconContainer>
          <IconBox>
            <IconImage src={getIconSrc()} alt={title} />
          </IconBox>
          <Title disabled={isDisabled}>{title}</Title>
        </IconContainer>
      </CardContainer>
      {isDisabled && <Tooltip>{tooltipText}</Tooltip>}
    </CardWrapper>
  );
};

export default MenuCard;
