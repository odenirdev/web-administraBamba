import React, { useState, useEffect, useContext } from "react";
import Styled from "styled-components";
import { Link } from "react-router-dom";
import { FaUserCog, FaSignOutAlt } from "react-icons/fa";
import { useHistory } from "react-router-dom";

import Notifications from "../../components/Notifications";
import User from "../NavBarUser";
import Modal from "../Modal";
import Button from "../Button";
import Img from "../Img";

import ScheduleContext from "../Schedule/context";
import AuthContext from "../AuthContext";

import Profile from "../../modals/Profile";

import Logo from "../../assets/images/Logo.png";

import NotificationsGrid from "../NotificationsGrid";

import Firebase from "../../services/firebase";
import Api from "../../services/api";

import { Error } from "../../modules/notifications";

const Container = Styled.div`
    width: 100%;
    height: 6rem;

    display: flex;
    justify-content: space-between;



    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.25));
`;

const Header = Styled.header`
    height: 100%;
    width: fit-content;
    margin: 0 1rem;

    display: flex;
    justify-content: center;
    align-items: center;

    & h1 {
        font-size: 2rem;
        margin-left: 1rem;
        color: var(--gray-5);
    }

    @media (max-width: 750px) {
        & h1 {
            display: none;
        }
    }
`;

const Section = Styled.section`
    display: flex;

    position: relative;
`;

const UserGrid = Styled.div`
    display: ${(props) => (props.show ? "block" : "none")};

    width: 30%;

    padding: 1rem;

    background-color: var(--gray-5);

    position: absolute;
    z-index: 99999;
    right: 0;
    top: 6rem;

    box-shadow: var(--shadow);

    border-radius: 3px;

    transition: 200ms;

    & button {
        width: 100%;
        margin: 1rem 0;
    }

    & a {
        display: flex;
        align-items: center;
        color:  var(--color-primary);
        text-decoration: none;

        &:hover {
            filter: brightness(120%);
        }

        & svg {
            margin-right: 5px;
        }
    }
`;

const Index = () => {
    const history = useHistory();

    const [show, setShow] = useState(false);

    const [drop, setDrop] = useState(false);

    const [image, setImage] = useState("");

    const [user, setUser] = useState({});

    const { index } = useContext(ScheduleContext);

    const [notifications, setNotifications] = useState([]);

    const [showNotifications, setShowNotifications] = useState(false);

    const {
        auth: { me },
    } = useContext(AuthContext);

    useEffect(() => {
        Firebase.child("notifications").on("value", (snapshot) => {
            const values = snapshot.val();

            const notifications = [];

            if (values === null) return;

            Object.keys(values).forEach((id) => {
                const notification = values[id];

                if (notification.saw) return;

                if (notification.to !== me.id) return;

                notifications.push({ ...notification, id });
            });

            setNotifications(notifications);
        });
    }, [me.id]);

    useEffect(() => {
        async function show() {
            try {
                const response = await Api.get("/users/me");

                if (response.data.image.url) {
                    setImage(Api.defaults.baseURL + response.data.image.url);
                }

                setUser(response.data);
            } catch (error) {
                Error(error);
            }
        }

        show();
    }, []);

    return (
        <>
            <Modal
                title="Meu Perfil"
                show={show}
                onClose={() => setShow(false)}
            >
                <Profile user={user} />
            </Modal>
            <UserGrid show={drop}>
                <Button
                    onClick={() => {
                        setShow(true);
                        setDrop(false);
                    }}
                >
                    <FaUserCog />
                    Gerenciar conta
                </Button>
                <Link to="/auth">
                    <FaSignOutAlt />
                    Sair
                </Link>
            </UserGrid>

            <NotificationsGrid
                {...{ show: showNotifications, notifications }}
            />

            <Container>
                <Header
                    onClick={() => {
                        history.push("/");
                        index();
                    }}
                    className="cursor-pointer"
                >
                    <Img src={Logo} width="5rem" />
                </Header>
                <Section>
                    <Notifications
                        number={notifications.length}
                        onClick={() => setShowNotifications(!showNotifications)}
                    />

                    <User src={image} onClick={() => setDrop(!drop)} />
                </Section>
            </Container>
        </>
    );
};

export default Index;
