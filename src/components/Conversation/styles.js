import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    align-items: center;
    background-color: #fafafa;
    box-shadow: var(--shadow);
    border-radius: 2px;
    padding: 0.5rem;
    cursor: pointer;

    transition: background-color 0.2s;

    &.selected {
        background-color: var(--color-primary);
        color: #fafafa;
    }

    &:hover {
        background-color: var(--purple-5);
    }

    img {
        width: 42px;
        height: 42px;
        border-radius: 21px;
    }

    div {
        margin-left: 1rem;

        display: flex;
        flex-direction: column;

        strong {
            font-size: 1.5rem;
        }

        span {
            font-size: 1rem;
        }
    }
`;
