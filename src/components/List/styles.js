import styled from "styled-components";

export const Container = styled.div`
    padding: 0 15px;
    height: 100%;
    flex: 0 0 280px;
    opacity: ${(props) => (props.done ? 0.6 : 1)};

    border-left: 1px solid rgba(0, 0, 0, 0.05);

    margin-bottom: 20px;

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 42px;

        h2 {
            font-weight: 500;
            font-size: 16px;
            padding: 0 10px;
        }

        button {
            height: 42px;
            width: 42px;
            border-radius: 21px;
            background: var(--color-primary);
            border: 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    ul {
        margin-top: 30px;
        max-height: 460px;
        overflow-y: auto;
    }
`;
