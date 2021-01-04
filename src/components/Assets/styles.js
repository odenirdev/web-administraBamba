import styled from "styled-components";

export const Container = styled.div`
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;

        h1 {
            font-size: 1.8rem;
            margin: 0;
        }
    }

    .open-icon {
        color: var(--brown);
        cursor: pointer;

        &:hover {
            filter: brightness(120%);
        }
    }
`;
