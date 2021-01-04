import styled from "styled-components";

export const Container = styled.div`
    position: absolute;
    z-index: 100;
    top: 80px;
    right: 70px;

    max-height: 500px;
    overflow-y: auto;

    display: ${(props) => (props.show ? "block" : "none")};

    div {
        margin-top: 1rem;
    }

    div:first-child {
        margin-top: 0;
    }
`;
