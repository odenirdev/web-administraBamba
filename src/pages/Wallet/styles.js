import styled from "styled-components";

export const Container = styled.div`
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h1 {
            font-size: 1.7rem;
            display: flex;
            align-items: center;
        }

        button {
            margin-left: 1rem;
        }

        .col:first-child {
            margin-right: 1rem;
        }

        strong,
        span {
            width: fit-content;
            white-space: nowrap;

            display: flex;
            align-items: center;
            font-size: 1.5rem;

            &.money-all {
                color: var(--blue);
            }

            &.money-in {
                color: var(--green);
            }

            &.money-out {
                color: var(--red);
            }
        }

        strong {
            margin-right: 1rem;
        }
    }
`;
