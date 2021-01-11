import styled from "styled-components";

import Label from "../Label";

export const Container = styled(Label)`
    width: 100%;

    .controllers {
        display: ${(props) => (props.show ? "flex" : "none")};

        input {
            width: 100%;
        }

        button {
            border: 0;
            border-radius: 2px;

            outline: 0;

            width: 54px;
            height: 54px;

            background-color: #fafafa;
            color: var(--blue);

            box-shadow: 1px 1px 3px -1px #000;
        }
    }
`;

export const Options = styled.ul.attrs({
    className: "options",
})`
    list-style: none;

    display: ${(props) => (props.show ? "block" : "none")};
`;

export const Selected = styled.ul`
    list-style: none;
`;
