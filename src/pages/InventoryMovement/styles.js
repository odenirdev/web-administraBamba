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

        h1 {
            font-size: 2.2rem;
        }

        div {
            display: flex;

            .col:first-child {
                margin-right: 0.5rem;
            }
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
