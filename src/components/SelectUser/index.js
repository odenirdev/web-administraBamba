import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import api from "../../services/api";

import { Container, Grid } from "./styles";

import EmptyImage from "../../assets/images/empty.jpg";

function Index({ image, username, email, onClick, show, selected }) {
    return (
        <Container className="col-12 select-user-container" {...{ show }}>
            <Grid>
                <div className="select-user-image col-2 ">
                    <img
                        src={
                            image
                                ? `${api.defaults.baseURL}${image}`
                                : EmptyImage
                        }
                        alt="Seleção de usuário"
                    />
                </div>
                <div className="select-user-info col-9">
                    <strong>{username}</strong>
                    <span>{email}</span>
                </div>
                {selected ? (
                    <div className="select-user-minus col-1" {...{ onClick }}>
                        <FaMinus size={12} />
                    </div>
                ) : (
                    <div className="select-user-plus col-1" {...{ onClick }}>
                        <FaPlus size={12} />
                    </div>
                )}
            </Grid>
        </Container>
    );
}

export default Index;
