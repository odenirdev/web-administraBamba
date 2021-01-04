import styled from "styled-components";

export const Container = styled.div`
    background-color: var(--color-primary);
    color: #fafafa;

    padding: 1rem;
    border-radius: 2px;

    box-shadow: 1px 1px 3px -1px #121212;

    cursor: pointer;

    &:hover {
        filter: brightness(120%);
    }

    p {
        margin: 0;
    }
`;
