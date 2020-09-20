import Styled from "styled-components";

const Index = Styled.textarea`
    width: 100%;
    min-width: ${(props) => props["min-width"] || "auto"};
    max-width: ${(props) => props["max-width"] || "auto"};

    background-color: var(--gray-5);
    border: 0;
    border-radius: 5px;
    margin-bottom: 1rem;
    padding: 1.4rem 1.4rem;

    box-shadow: var(--input-shadow);
`;

export default Index;
