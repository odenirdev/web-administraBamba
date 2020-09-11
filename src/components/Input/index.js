import Styled from "styled-components";

const Index = Styled.input`
    width: 100%;
    min-width: ${(props) => props["min-width"] || "auto"};
    max-width: ${(props) => props["max-width"] || "auto"};

    background-color: var(--gray-5);
    border: 0;
    border-radius: 5px;
    margin-bottom: 0.2rem;
    font-size: 0.5rem;
    padding: 0.5rem 0.4rem;

    box-shadow: var(--input-shadow);
`;

export default Index;
