import styled, { css } from "styled-components";
import { Col } from "react-bootstrap";

export const Container = styled(Col).attrs({
    className: "task",
})`
    background-color: var(--gray-5);
    color: var(--gray-2);
    width: 100%;
    margin: 10px 0;

    box-shadow: var(--shadow);

    border-radius: 3px;

    cursor: grab;

    &:hover .user-hover-container {
        visibility: visible;
    }

    & header {
        background-color: var(--color-primary) !important;

        border-radius: 3px 3px 0 0;

        display: flex;
        justify-content: flex-start !important;

        & h2 {
            color: var(--gray-5) !important;
            font-size: 1.5rem;
            margin: 0 auto;
            padding: 0 0.5rem;

            & svg {
                margin-right: 1rem;
            }
        }
    }

    & span {
        display: flex;
        align-items: center;
        font-size: 1.2rem;
        padding: 0.5rem;

        & svg {
            margin-right: 5px;
        }
    }

    & div {
        display: flex;
        justify-content: space-between;
    }

    @media (max-width: 750px) {
        & div {
            flex-direction: column;
            align-items: center;
        }

        & header {
            text-align: center;
        }
    }

    ${(props) =>
        props.isDragging &&
        css`
            border: 2px dashed rgba(0, 0, 0, 0.2);
            border-radius: 0;
            background: transparent;
            box-shadow: none;
            cursor: grabbing;

            div,
            header {
                opacity: 0;
            }
        `}
`;
