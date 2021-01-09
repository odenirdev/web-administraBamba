import Styled from "styled-components";
import { Col } from "react-bootstrap";
import Button from "../../components/Button";

export const Container = Styled.div`
    display: flex;
    justify-content: center;
    padding: 1rem;

    form {
        span.created-by {
            padding : 0.5rem 0 0 0.5rem;
        }

    
    }
`;

export const MoneyIn = Styled(Col)`
    padding: 0;

    display: ${(props) => (props.show ? "block" : "none")};
`;

export const StatusButton = Styled(Button)`
    padding: 15px;
    border-radius: 30px;

    & svg {
        margin: 0;
    }
`;
