import Styled from "styled-components";
import { Col } from "react-bootstrap";
import Img from "../Img";

export const Grid = Styled(Col)`
    margin: 0.5rem 0;
`;

export const Container = Styled(Col)`
    width: 100%;
    background-color: var(--gray-5);
    box-shadow: var(--shadow);

    display: flex;

    border-radius: 2px;

    padding: 0.5rem;

    cursor: pointer;

    &:hover .user-hover-container {
        visibility: visible;
    }

`;

export const ImageContainer = Styled(Col)`
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 0;
`;

export const FieldsContainer = Styled(Col)`

`;

export const StyledImg = Styled(Img)`
    width: 62px;
    height: 62px;
    border-radius: 50%;
`;

export const Field = Styled(Col)`
    margin: 0.2rem;

    & h3 {
        color: var(--purple-1);
        font-size: 1.3rem;
        margin: 0;
    }

    & span {
        color: var(--gray-1);
        font-size: 1.2rem;
    }
`;

export const HoverContainer = Styled.div.attrs({
    className: "user-hover-container",
})`
    visibility: hidden;

    width: 100%;
    height: 100%;
    background-color: rgba(26, 26, 26, 0.4);

    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;

    & svg {
        position: absolute;
        bottom: 5px;
        right: 5px;
        z-index: 100;        
        color: var(--gray-5);
    }
`;
