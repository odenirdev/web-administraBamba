import Styled from "styled-components";

const Index = Styled.div`
    border: 8px solid rgba(0, 0, 0, .1);
    border-left: 8px solid var(--color-primary);
    height: 42px;
    width: 42px;
    border-radius: 50px;
    animation: spin 1s linear infinite;


    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;

export const Container = Styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: var(--purple-6);
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default Index;
