import Styled, { css } from "styled-components";
import { Button } from "react-bootstrap";

const DefaultStyle = css`
    background: ${(props) => props.background || "var(--color-primary)"};
    color: ${(props) => props.color || "var(--gray-5)"};
    border: 2px solid ${(props) => props.background || "var(--color-primary)"};

    &:hover {
        background: ${(props) => props.background || "var(--color-primary)"};
        color: ${(props) => props.color || "var(--gray-5)"};
        border: 2px solid
            ${(props) => props.background || "var(--color-primary)"};
    }
`;

const SecundaryStyle = css`
    background-color: ${(props) => props.background || "var(--gray-5)"};
    color: ${(props) => props.color || "var(--color-primary)"};
    border: 2px solid ${(props) => props.color || "var(--color-primary)"};

    &:hover {
        background-color: ${(props) => props.color || "var(--color-primary)"};
        color: ${(props) => props.background || "var(--gray-5)"};
        border: 2px solid ${(props) => props.color || "var(--color-primary)"};
    }
`;

const styles = {
    default: DefaultStyle,
    secundary: SecundaryStyle,
};

const Index = Styled(Button)`
    display: flex;
    justify-content: center;
    align-items: center;

    font-family: var(--font-title);
    font-size: 1.5rem;
    
    padding: 0.8rem 2.5rem;
    margin: 1rem 0.9rem;
    
    border: 0;
    border-radius: 3px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

    transition: 300ms;

    cursor: pointer;

    ${(props) => styles[props.variant || "default"]}

    & svg {
        margin-right: 0.2rem;
    }

    &:hover {
        ${(props) => styles[props.variant || "default"]}
        filter: brightness(110%);
    }

    &:disabled {
        ${(props) => styles[props.variant || "default"]}
        filter: brightness(50%);
    }

    &:active {
        border: 0;
        ${(props) => styles[props.variant || "default"]}
        filter: brightness(110%);
    }

    @media (max-width: 375px) {
        width: 100%;
        margin: 0.5rem 0;
    }
`;

export default Index;
