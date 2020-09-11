import Styled from "styled-components";

const Index = Styled.form`
    display: flex;
    flex-direction: column;
    min-width: ${(props) => props["min-width"] || "auto"};
    max-width: ${(props) => props["max-width"] || "auto"};

    @media (max-width: 750px) {
        min-width: ${(props) => props["sm-min-width"] || "auto"};
        max-width: ${(props) => props["sm-max-width"] || "auto"};
    }
`;

export const GridButtons = Styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap
    
    width: 100%;
    margin-top: 0.4rem;
`;

export default Index;
