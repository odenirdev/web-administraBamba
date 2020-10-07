import React from "react";
import Styled from "styled-components";

import Passista from "../../assets/images/Passista.png";
import LogoImg from "../../assets/images/Logo.png";

const Background = Styled.div`
    min-width: 100vw;
    min-height: 100vh;
    background-image: url(${Passista});
    background-repeat: no-repeat;
    background-size: cover;
`;

const Container = Styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 400px;
    height: 100vh;
    background-color: var(--gray-3);

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    padding: 0 1rem;

    @media (max-width: 750px) {
        width: 100%;
    }
`;

const Header = Styled.header`
    width: 100%;

    & h1 {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--gray-5);
    }

    & img {
        margin-right: 14px;
    }
`;

const Logo = Styled.img`
    width: 64px;
    height: 64px;
`;

const Section = Styled.section`

`;

const Index = () => {
    return (
        <Background>
            <Container>
                <Header>
                    <h1>
                        <Logo src={LogoImg} />
                        <span>AdministraBamba</span>
                    </h1>
                </Header>
                <Section>
                    <p>
                        Escola de samba não cadastra!
                        <br /> Peça para algum administrador cadastra-la
                    </p>
                </Section>
            </Container>
        </Background>
    );
};

export default Index;
