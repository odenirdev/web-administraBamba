import React from "react";
import Styled from "styled-components";

import Img from "../../components/Img";

import EmptyImg from "../../assets/images/empty.jpg";

const Container = Styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    margin-right: 1rem;
`;

const User = Styled(Img)`
    width: 42px;
    height: 42px;
    background-color: var(--gray-3);
    
    border-radius: 21px;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

const Index = ({ onClick, src, title }) => {
    return (
        <>
            <Container {...{ title }}>
                <User onClick={onClick} src={src || EmptyImg} />
            </Container>
        </>
    );
};

export default Index;
