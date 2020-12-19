import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    justify-content: center;
`;

export const IconGrid = styled.div`
    margin-bottom: 1rem;

    color: var(--gray-2);
    font-size: 32px;

    svg {
        cursor: pointer;
        transition: 0.1s;
    }

    .chat-icon:hover {
        color: var(--green);
    }
`;
