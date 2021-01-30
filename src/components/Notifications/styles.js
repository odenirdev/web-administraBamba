import Styled from "styled-components";

export const Container = Styled.div`
height: 100%;

display: flex;
align-items: center;

position: relative;

& svg {
    font-size: 32px;
    cursor: pointer;
}


color: var(--gray-5);
`;

export const Notifications = Styled.div`
width: 24px;
height: 24px;

border-radius: 12px;

position: absolute;

margin: 0 0 1em 1rem;

background-color: var(--red-1);

filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));

display: flex;
justify-content: center;
align-items: center;

cursor: pointer;
`;
