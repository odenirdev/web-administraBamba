import styled, { css } from "styled-components";

export const Container = styled.li`
    width: 100%;
    min-height: 20%;

    list-style: none;

    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ReceivedMessage = css`
    background-color: #ffff;
    border-radius: 50px 50px 50px 0;
`;

const SendMessage = css`
    background-color: var(--purple-6);
    border-radius: 50px 50px 0 50px;
    margin-left: auto;
`;

export const Grid = styled.div`
    width: fit-content;
    display: flex;
    flex-direction: column;

    margin-left: ${(props) => props.send && "auto"};

    p {
        box-shadow: var(--shadow);

        margin-bottom: 0.2rem;

        width: fit-content;

        padding: 0.3rem 1rem;

        font-size: 1.2rem;

        ${(props) => (props.send ? SendMessage : ReceivedMessage)}
    }

    span {
        color: rgba(0, 0, 0, 0.7);
        font-size: 1rem;

        margin-left: auto;
    }
`;
