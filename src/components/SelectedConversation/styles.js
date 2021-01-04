import styled from "styled-components";

export const Container = styled.div`
    width: inherit;
    height: 100%;

    border-left: 1px solid rgba(0, 0, 0, 0.05);
`;

export const FormSendMessage = styled.form`
    background-color: rgba(0, 0, 0, 0.1);

    width: 100%;
    height: 20%;

    padding: 0 1rem;

    display: flex;
    align-items: center;

    input {
        margin: 0;
    }

    button {
        width: 54px;
        height: 54px;

        outline: 0;
        border: 0;
        border-radius: 50%;

        background-color: var(--green);

        display: flex;
        align-items: center;
        justify-content: center;

        color: #fafafa;

        margin-left: 1rem;

        box-shadow: var(--shadow);

        cursor: pointer;
    }
`;

export const MessagesGrid = styled.ul.attrs({
    className: "messages-grid",
})`
    width: 100%;
    height: 80%;
    overflow-y: auto;

    padding: 0 1rem;
    margin: 0;

    background-color: rgba(0, 0, 0, 0.005);
`;
