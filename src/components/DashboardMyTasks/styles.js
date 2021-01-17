import styled from "styled-components";

export const Container = styled.div`
    background-color: var(--white);
    box-shadow: var(--shadow);
    border-radius: 2px;

    padding: 1rem;

    div {
        display: flex;
        flex-direction: column;
    }

    h2 {
        margin: 0;
        margin-bottom: 1rem;
    }
`;
