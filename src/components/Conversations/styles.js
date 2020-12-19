import styled from "styled-components";

export const Container = styled.div`
    background-color: #fafafa;
    width: 100%;
    height: 75vh;

    display: flex;

    border-radius: 3px;

    box-shadow: 1px 1px 3px -1px #121212;

    @media (max-width: 750px) {
        flex-direction: column;
    }
`;

export const List = styled.div`
    background-color: rgba(0, 0, 0, 0.05);

    width: 40%;
    height: 100%;

    @media (max-width: 750px) {
        width: 100%;
        height: auto;
    }

    ul {
        display: flex;
        flex-direction: column;

        height: 90%;

        overflow-y: auto;

        @media (max-width: 750px) {
            display: ${({ show }) => (show ? "flex" : "none")};
        }
    }

    header {
        background-color: var(--color-primary);

        padding: 0.5rem 0;

        display: flex;
        justify-content: center;
        align-items: center;

        height: 10%;

        h1 {
            font-size: 2rem;
            color: #fafafa;
            margin: 0;
        }

        i {
            display: none;

            margin-left: 1rem;

            color: #fafafa;

            cursor: pointer;
        }

        @media (max-width: 750px) {
            i {
                display: initial;
            }
        }
    }

    li {
        list-style: none;
        padding: 1rem;
    }
`;
