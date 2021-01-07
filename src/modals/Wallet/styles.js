import styled from "styled-components";

export const Container = styled.div`
    display: flex;

    form {
        width: 100%;
        max-width: 480px;

        margin: 0 auto;
    }

    .row {
        .col:first-child {
            margin-right: 1rem;
        }
    }

    .movement-history {
        footer,
        section {
            background-color: var(--white);
            padding: 1rem;
            border-left: 2px solid rgba(0, 0, 0, 0.5);
            border-bottom: 1px solid rgba(0, 0, 0, 0.3);

            p {
                margin: 0;
            }

            img {
                width: 42px;
                height: 42px;
                border-radius: 21px;
            }
        }
    }
`;
