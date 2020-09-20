import React, { useState } from "react";
import Styled from "styled-components";

import Container from "../../components/Container";
import SchoolInfo from "../../components/SchoolInfo";
import { Input } from "../../components/Form";
import AddButton from "../../components/AddButton";
import User from "../../components/User";
import Modal from "../../components/Modal";

import SchoolModal from "../../modals/School";
import UserModal from "../../modals/User";

const UsersContainer = Styled.div`
    margin-top: 0.5rem;
`;

const Header = Styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.2rem;
`;

const Section = Styled.section`
    display: flex;
    flex-wrap: wrap;

    & h2 {
        width: 100%;
    }
`;

const Index = () => {
    const [search, setSearch] = useState("");

    const [school, setSchool] = useState({
        image:
            "http://amantesdocarnavalsp.com.br//wp-content/uploads/2015/07/carnavalsp_logo-prova-de-fogo-13-995x1024.jpg",
        name: "Prova de Fogo",
        foundationDate: "16/06/1974",
        description:
            "O Grêmio Recreativo Cultural e Social Escola de Samba Prova de Fogo foi fundado em 16 de junho de 1974, em Pirituba, bairro de São Paulo, Capital.",
        state: "SP",
        city: "São Paulo",
        neighborhood: "Vila Leopoldina",
        address: "Rua Julião Machado",
        number: 257,
    });

    const [selectedUser, setSelectedUser] = useState({});

    const [showSchool, setShowSchool] = useState(false);

    const [showUser, setShowUser] = useState(false);

    const [administrators, setAdministrators] = useState([
        {
            name: "Odenir Gomes",
            email: "odenirdev@gmail.com",
            access_level: 3,
        },
        {
            name: "Odenir Gomes",
            email: "odenirdev@gmail.com",
            access_level: 3,
        },
        {
            name: "Odenir Gomes",
            email: "odenirdev@gmail.com",
            access_level: 3,
        },
    ]);

    const [managers, setManagers] = useState([
        {
            name: "Odenir Gomes",
            email: "odenirdev@gmail.com",
            access_level: 2,
        },
    ]);

    const [users, setUsers] = useState([
        {
            name: "Odenir Gomes",
            email: "odenirdev@gmail.com",
            access_level: 1,
        },
        {
            name: "Odenir Gomes",
            email: "odenirdev@gmail.com",
            access_level: 1,
        },
        {
            name: "Odenir Gomes",
            email: "odenirdev@gmail.com",
            access_level: 1,
        },
    ]);

    const handleAddUser = () => {
        setSelectedUser({});
        setShowUser(true);
    };

    const handleShowUser = (user) => {
        setSelectedUser(user);
        setShowUser(true);
    };

    return (
        <>
            <Modal
                show={showSchool}
                title="Minha Escola"
                onClose={() => setShowSchool(false)}
            >
                <SchoolModal school={school} />
            </Modal>
            <Modal
                show={showUser}
                title={
                    Object.keys(selectedUser).length === 0
                        ? "Novo Usuário"
                        : `Usuário ${selectedUser.name}`
                }
                onClose={() => {
                    setSelectedUser({});
                    setShowUser(false);
                }}
            >
                <UserModal user={selectedUser} />
            </Modal>
            <Container>
                <SchoolInfo
                    school={school}
                    onClick={() => setShowSchool(true)}
                />
                <UsersContainer>
                    <Header>
                        <Input
                            value={search}
                            label="Pesquisar"
                            max-width="250px"
                            onChange={(event) => setSearch(event.target.value)}
                        />
                        <AddButton onClick={handleAddUser} />
                    </Header>
                    <Section>
                        <h2>Diretoria</h2>
                        {administrators.length !== 0 &&
                            administrators.map((user) => (
                                <User
                                    user={user}
                                    onClick={() => {
                                        handleShowUser(user);
                                    }}
                                />
                            ))}
                    </Section>
                    {managers.length !== 0 && (
                        <Section>
                            <h2>Harmonia</h2>
                            {managers.map((user) => (
                                <User
                                    user={user}
                                    onClick={() => {
                                        handleShowUser(user);
                                    }}
                                />
                            ))}
                        </Section>
                    )}

                    {users.length !== 0 && (
                        <Section>
                            <h2>Componentes</h2>
                            {users.map((user) => (
                                <User
                                    user={user}
                                    onClick={() => {
                                        handleShowUser(user);
                                    }}
                                />
                            ))}
                        </Section>
                    )}
                </UsersContainer>
            </Container>
        </>
    );
};

export default Index;
