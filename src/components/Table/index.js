import Styled from "styled-components";

const Index = Styled.table`
    width: 100%;

    .folder {
        color: #795548;
        cursor: pointer;
        transition: 200ms;

        &:hover {
            filter: brightness(120%);
        }
    }

    thead {
        background-color: var(--white);
        color: var(--black);

        th {
            padding: 10px 5px;
        }
    }

    tbody {
        background-color: #fff;
        border-top: 1px solid #000;
        border-bottom: 1px solid #000;

        td {
            padding: 10px 5px;
        }
    }
`;

export const ResponsiveTable = Styled.div`
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
`;

export default Index;
