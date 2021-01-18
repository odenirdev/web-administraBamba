import styled from "styled-components";

export const Container = styled.div`
    header {
        margin-bottom: 1rem;

        display: flex;
        align-items: center;
        justify-content: space-between;

        div {
            display: flex;

            button {
                margin-right: 0.5rem;
            }
        }

        h1 {
            font-size: 1.8rem;
            margin: 0;
        }
    }
`;
