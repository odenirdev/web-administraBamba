import styled from "styled-components";
import { Col } from "react-bootstrap";

export const Container = styled.div`
    max-height: 100vh;
    padding: 20px;

    .board-lists {
        display: flex;

        margin-top: 14px;

        width: 100%;

        overflow-x: auto;
    }
`;

export const Title = styled(Col)`
    & h3 {
        color: var(--purple-1);
        margin: 0;
    }

    & span {
        color: var(--gray-1);
    }
`;

export const Description = styled(Title)`
    margin-top: 0.5rem;

    & span {
        color: var(--gray-1);
    }
`;

export const Header = styled.header.attrs({
    className: "row",
})``;

export const Information = styled(Col)`
    position: relative;

    & svg {
        position: absolute;
        top: 0;
        right: 0;

        cursor: pointer;
        color: var(--gray-2);

        transition: 200ms;

        &:hover {
            color: var(--color-primary);
            filter: brightness(120%);
        }
    }
`;
