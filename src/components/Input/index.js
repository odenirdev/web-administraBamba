import React from "react";
import Styled from "styled-components";

import Img from "../Img";
import EmptyImg from "../../assets/images/empty.jpg";

export const File = ({ src, width, height }) => {
    if (!src) {
        return (
            <Img
                src={EmptyImg}
                style={{
                    width: "100%",
                    maxWidth: width || "200px",
                    maxHeight: height,
                }}
            />
        );
    }

    return <Img src={src} style={{ maxWidth: width, maxHeight: height }} />;
};

const Index = Styled.input`
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
