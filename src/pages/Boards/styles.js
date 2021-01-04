import Styled from "styled-components";
import { Row } from "react-bootstrap";

export const Header = Styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const Section = Styled.section`
    padding: 0 0.2rem;
`;

export const Boards = Styled(Row)`
    & h1 {
        width: 100%;
    }
`;
