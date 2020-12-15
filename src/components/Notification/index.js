import React from "react";
import { useHistory } from "react-router-dom";

import { Container } from "./styles";

import { Error } from "../../modules/notifications";

import Firebase from "../../services/firebase";

function Index(props) {
    const history = useHistory();

    function handleClick() {
        try {
            Firebase.child(`notifications/${props.id}`).set(
                { saw: true },
                (error) => {
                    if (error) {
                        throw error;
                    }
                }
            );

            if (props.to_url) history.push(props.to_url);
        } catch (error) {
            Error(error);
        }
    }

    return (
        <Container onClick={handleClick}>
            <strong>{props.title}</strong>
            <p>{props.description}</p>
        </Container>
    );
}

export default Index;
