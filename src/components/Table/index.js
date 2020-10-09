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
        background-color: var(--color-primary);
        color: var(--gray-5);

        th {
            padding: 10px 5px;
        }
    }

    tbody {
        background-color: var(--gray-5);
        border: 1px solid var(--gray-3);
        border-top: 0;

        tr {    
            border-bottom: 1px solid var(--gray-3);
            
        }

        td{
            padding: 10px 5px;
        }
    }
`;

export const ResponsiveTable = Styled.div`
    width: 100%;
    overflow-x: auto;
`;

export default Index;
