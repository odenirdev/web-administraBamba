import styled from "styled-components";

export const Container = styled.div`
    background-color: var(--white);
    box-shadow: var(--shadow);
    border-radius: 2px;

    padding: 1rem;

    height: 100%;

    .my-boards-container {
        width: 100%;

        div {
            display: flex;
            flex-direction: column;
        }

        .created {
            color: var(--blue-3);
        }

        .contribution {
            color: var(--purple-4);
        }
    }

    h2 {
        margin: 0;
        margin-bottom: 1rem;
    }
`;
