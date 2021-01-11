import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    width: 100%;

    background-color: #fafafa;

    margin-top: 0.5rem;

    box-shadow: var(--shadow);

    section {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0.5rem;
    }

    img {
        width: 42px;
        height: 42px;
        border-radius: 21px;
    }

    label {
        display: flex;
        flex-direction: column;

        color: var(--gray-3);
        font-size: 1rem;
        margin: 0;
    }

    span,
    strong {
        font-size: 1.5rem;
    }

    span {
        font-weight: 400;
        color: var(--gray-1);
    }

    strong {
        color: var(--gray-1);
    }

    div {
        outline: 0;
        border: 0;
        width: 54px;

        border: 0 2px 2px 0;

        color: var(--red);
        background-color: rgba(0, 0, 0, 0.1);

        display: flex;
        justify-content: center;
        align-items: center;

        cursor: pointer;
    }

    div:hover {
        color: #fff;
        background-color: var(--red);
    }
`;
