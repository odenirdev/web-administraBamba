import styled from "styled-components";

export const Container = styled.div`
    .col {
        margin: 0 0.5rem;
    }

    .movement-history {
        max-width: 96%;
        margin: 1rem;

        footer,
        section {
            background-color: var(--white);
            padding: 1rem;
            border-left: 2px solid rgba(0, 0, 0, 0.5);
            border-bottom: 1px solid rgba(0, 0, 0, 0.3);

            div {
                display: flex;
            }

            p {
                color: #000;
                font-size: 1.5rem;
                margin: 0;
            }

            span {
                font-size: 1.2rem;
            }

            img {
                width: 42px;
                height: 42px;
                border-radius: 21px;
            }
        }
    }
`;
