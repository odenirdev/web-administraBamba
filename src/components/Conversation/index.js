import React, { useContext, useEffect, useState } from "react";

import { Container } from "./styles";

import EmptyImage from "../../assets/images/empty.jpg";

import { Error } from "../../modules/notifications";
import api from "../../services/api";

import AuthContext from "../AuthContext";

import SpinnerLoader from "../SpinnerLoader";

function Index({ users, selected, onClick }) {
    const {
        auth: { me },
    } = useContext(AuthContext);

    const [data, setData] = useState({});

    useEffect(() => {
        async function show() {
            try {
                const user = users.filter((user) => user !== me.id)[0];

                const response = await api.get(`/users/${user}`);

                const {
                    username,
                    email,
                    image: { url },
                } = response.data;

                setData({ username, email, image: url });
            } catch (error) {
                Error(error);
            }
        }

        show();
    }, [me.id, users]);

    if (!Object.keys(data).length) {
        return <SpinnerLoader />;
    }

    return (
        <Container className={selected && "selected"} {...{ onClick }}>
            <img
                src={
                    data.image
                        ? `${api.defaults.baseURL}${data.image}`
                        : EmptyImage
                }
                alt="Conversa"
            />
            <div>
                <strong>{data.username}</strong>
                <span>{data.email}</span>
            </div>
        </Container>
    );
}

export default Index;
