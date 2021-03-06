import React, { useState, useEffect, useCallback } from "react";
import Styled from "styled-components";
import { FaUser } from "react-icons/fa";

import Container from "../../components/Container";
import SchoolInfo from "../../components/SchoolInfo";
import { Input } from "../../components/Form";
import AddButton from "../../components/AddButton";
import User from "../../components/User";
import Modal from "../../components/Modal";
import SpinnerLoader from "../../components/SpinnerLoader";

import SchoolModal from "../../modals/School";
import UserModal from "../../modals/User";

import Api from "../../services/api";
import { Error } from "../../modules/notifications";
import System from "../../modules/system";

const UsersContainer = Styled.div`
    padding: 1rem;
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

    const [school, setSchool] = useState({ image: {} });

    const [selectedUser, setSelectedUser] = useState({});

    const [showSchool, setShowSchool] = useState(false);

    const [showUser, setShowUser] = useState(false);

    const [users, setUsers] = useState([]);

    const [filteredUsers, setFilteredUsers] = useState([]);

    const [administrators, setAdministrators] = useState([]);

    const [managers, setManagers] = useState([]);

    const [components, setComponents] = useState([]);

    const indexUsers = useCallback(() => {
        async function index() {
            try {
                const response = await Api.get(
                    "/users?_limit=-1&_sort=username:ASC"
                );

                const filteredUsers = response.data.filter(
                    (user) => user.blocked !== true
                );

                setUsers(filteredUsers);
            } catch (error) {
                Error(error);
            }
        }

        index();
    }, []);

    const indexSchool = useCallback(() => {
        async function indexSchool() {
            try {
                const response = await Api.get("/schools");

                setSchool(response.data[0]);
            } catch (error) {
                Error(error);
            }
        }

        indexSchool();
    }, []);

    useEffect(() => {
        indexSchool();
    }, [indexSchool]);

    useEffect(() => {
        indexUsers();
    }, [indexUsers]);

    useEffect(() => {
        const array = search ? filteredUsers : users;

        const components = array.filter((item) => {
            return item.role.id === 1;
        });

        const managers = array.filter((item) => {
            return item.role.id === 3;
        });

        const administrators = array.filter((item) => {
            return item.role.id === 4;
        });

        setComponents(components);

        setManagers(managers);

        setAdministrators(administrators);
    }, [filteredUsers, search, users]);

    useEffect(() => {
        if (search) {
            const filteredUsers = users.filter(
                (user) =>
                    user.username.includes(search) ||
                    user.email.includes(search)
            );

            setFilteredUsers(filteredUsers);
        }
    }, [search, users]);

    const handleAddUser = () => {
        setSelectedUser({});
        setShowUser(true);
    };

    const handleShowUser = (user) => {
        setSelectedUser(user);
        setShowUser(true);
    };

    if (JSON.stringify(school) === JSON.stringify({ image: {} })) {
        return <SpinnerLoader />;
    }

    return (
        <>
            <Modal
                show={showSchool}
                title="Minha Escola"
                onClose={() => setShowSchool(false)}
            >
                <SchoolModal school={school} indexSchool={indexSchool} />
            </Modal>
            <Modal
                show={showUser}
                title={
                    Object.keys(selectedUser).length === 0
                        ? "Novo Usuário"
                        : `Usuário ${selectedUser.username}`
                }
                onClose={() => {
                    setSelectedUser({});
                    setShowUser(false);
                }}
            >
                <UserModal
                    user={selectedUser}
                    updateUsers={indexUsers}
                    onClose={() => {
                        setSelectedUser({});
                        setShowUser(false);
                    }}
                />
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
                        {System.isAdmin() && (
                            <AddButton onClick={handleAddUser} Icon={FaUser} />
                        )}
                    </Header>

                    {administrators.length !== 0 && (
                        <Section>
                            <h2>Administradores</h2>
                            {administrators.map((user) => (
                                <User
                                    meRole={true}
                                    key={user.id}
                                    user={user}
                                    onClick={() => {
                                        handleShowUser(user);
                                    }}
                                />
                            ))}
                        </Section>
                    )}
                    {managers.length !== 0 && (
                        <Section>
                            <h2>Diretoria</h2>
                            {managers.map((user) => (
                                <User
                                    meRole={true}
                                    key={user.id}
                                    user={user}
                                    onClick={() => {
                                        handleShowUser(user);
                                    }}
                                />
                            ))}
                        </Section>
                    )}

                    {components.length !== 0 && (
                        <Section>
                            <h2>Componentes</h2>
                            {components.map((user) => (
                                <User
                                    meRole={true}
                                    key={user.id}
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
