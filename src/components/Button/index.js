import Styled from "styled-components";
import { Button } from "react-bootstrap";

const Index = Styled(Button)`
    display: flex;
    justify-content: center;
    align-items: center;

    font-family: var(--font-title);
    font-size: 0.7rem;
    
    padding: 0.3rem 0.8rem;
    
    border: 0;
    border-radius: 3px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

    cursor: pointer;

    background:${(props) => props.background || "var(--color-primary)"};
    color: ${(props) => props.color || "var(--gray-5)"};

    & svg {
        margin-right: 0.2rem;
    }

    &:hover {
        filter: brightness(110%);
    }
`;

export default Index;
