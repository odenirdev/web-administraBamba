import styled from "styled-components";

export default styled.div`
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;
    width: fit-content;
    border: 0;

    .tooltiptext {
        visibility: hidden;
        background-color: ${(props) => props.background || "black"};
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 15px;
        margin-left: 5px;

        white-space: nowrap;

        position: absolute;
        z-index: 1;
    }

    &:hover .tooltiptext {
        visibility: visible;
    }
`;
