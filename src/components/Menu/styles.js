import Styled, { css } from "styled-components";

const ContainerDisplay = css`
    background-color: var(--color-primary);

    width: 100%;
    height: 100%;

    bottom: 0;
    left: 0;
    animation-name: animation;
    animation-duration: 270ms;

    display: flex;
    justify-content: center;
    align-items: center;

    @keyframes animation {
        0% {
            width: 0%;
            height: 0%;
        }
        25% {
            width: 25%;
            height: 25%;
            border-radius: 50% 50% 50% 0;
        }
        50% {
            width: 50%;
            height: 50%;
            border-radius: 150% 50% 50% 0;
        }
        75% {
            width: 75%;
            height: 75%;
            border-radius: 50% 50% 50% 0;
        }
        100% {
            width: 100%;
            height: 100%;
            border-radius: 50% 50% 50% 0;
        }
    }
`;

const ButtonDisplay = css`
    background-color: var(--gray-5);
    color: var(--color-primary);
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
`;

export const Container = Styled.div`
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    z-index: 1!important;


    ${(props) => props.display && ContainerDisplay}
`;

export const Button = Styled.button`
    border: 0;
    border-radius: 60px;
    
    padding: 1rem;
    
    font-size: 2rem;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: var(--color-primary);
    color: var(--gray-5);
    
    cursor: pointer;

    ${(props) => props.display && ButtonDisplay}

    &:hover {
        filter: brightness(120%);
    }
`;

export const MenuContainer = Styled.div`
    display: ${(props) => (props.display ? "flex" : "none")};
    flex-direction: column;
    text-align: center;
    
    & a {
        text-decoration: none;
        font-size: 3rem;
        font-family: var(--font-title);
        color: var(--gray-4);
        transition: 200ms;
    }

    & a:hover {
        filter: brightness(150%);
    }
`;
