import styled from "styled-components";

export const Container = styled.div`
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.2rem;
        border-radius: 2px;

        div {
            height: 100%;
            width: 85%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            transition: 0.2s;
            color: var(--color-primary);
        }

        div:hover,
        div:hover h1 {
            filter: brightness(120%);
        }

        h1 {
            color: var(--color-primary);
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
