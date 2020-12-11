import styled from "styled-components";

export const Container = styled.div`
    display: ${(props) => (props.show ? "flex" : "none")};
`;

export const Grid = styled.div`
    background-color: #fafafa;

    border-radius: 2px;

    box-shadow: 1px 1px 3px -1px #121212;

    display: flex;

    width: 100%;

    cursor: pointer;

    div {
        padding: 0;
    }

    .select-user-image,
    .select-user-plus,
    .select-user-minus {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .select-user-info {
        padding: 0.5rem;

        display: flex;
        flex-direction: column;

        strong {
            font-size: 1.2rem;
        }

        span {
            font-size: 1rem;
        }
    }

    img {
        width: 42px;
        height: 42px;

        border-radius: 21px;
    }

    .select-user-plus {
        color: var(--green);
        background-color: rgba(0, 0, 0, 0.1);

        transition: 0.2s;
    }

    .select-user-plus:hover {
        color: #fafafa;
        background-color: var(--green);
    }

    .select-user-minus {
        color: var(--red);
        background-color: rgba(0, 0, 0, 0.1);

        transition: 0.2s;
    }

    .select-user-minus:hover {
        color: #fafafa;
        background-color: var(--red);
    }
`;
