import styled from "styled-components";

export const Container = styled.div`
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h1 {
            display: flex;
            align-items: center;

            button {
                border: 0;
                border-radius: 32px;

                font-size: 1.5rem;
                width: 64px;
                height: 64px;
                outline: 0;
                margin-left: 1rem;

                box-shadow: var(--shadow);

                transition: 0.2s;

                svg:first-child {
                    margin-right: 0.2rem;
                }

                &:active {
                    box-shadow: none;
                }

                &.money-in {
                    background-color: var(--green);
                    color: #fff;
                }

                &.money-out {
                    color: var(--red);
                }
            }
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

    table {
        width: 100%;
        background-color: var(--white);

        thead,
        td {
            text-align: center;
        }

        thead {
            background: var(--color-primary);
            color: var(--white);
            font-size: 2rem;
        }

        tbody {
            display: flex;
            flex-direction: column;

            max-height: 420px;
            overflow-y: auto;

            tr {
                display: flex;
                justify-content: space-around;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            tr:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
        }

        td {
            display: flex;
            align-items: center;
            padding: 1rem 0.1rem;
        }

        td.money-in {
            color: var(--green);
        }

        td.money-out {
            color: var(--red);
        }
    }
`;
