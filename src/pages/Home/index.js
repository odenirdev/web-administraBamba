import React, { useEffect, useState } from "react";
import Styled from "styled-components";

import Container from "../../components/Container";
import Img from "../../components/Img";
import Schedule from "../../components/Schedule";
import Spinner, {
    Container as ContainerSpinner,
} from "../../components/SpinnerLoader";

import Api from "../../services/api";

import SchoolFail from "../../pages/SchoolFail";
import RegisterSchool from "../../pages/RegisterSchool";

import ADSAMBAIcon from "../../assets/images/adsamba-logo.png";

const Main = Styled.main`

`;

const Index = () => {
    const [statusSchool, setStatusSchool] = useState(0);

    const [me, setMe] = useState(0);

    useEffect(() => {}, []);

    useEffect(() => {
        async function authSchool() {
            const response = await Api.get("/schools/count");
            if (response.data === 0) {
                if (me.role === 4) {
                    setStatusSchool(1);
                } else {
                    setStatusSchool(2);
                }
            }
        }

        authSchool();
    }, [me.role]);

    useEffect(() => {
        async function showMe() {
            try {
                const response = await Api.get("/users/me");

                try {
                    setMe({ ...response.data, role: response.data.role.id });
                } catch (err) {}
            } catch (error) {
                Error(error);
            }
        }

        showMe();
    }, []);

    if (!me && statusSchool === 0) {
        return (
            <ContainerSpinner>
                <Img src={ADSAMBAIcon} width="250px" />
                <Spinner />
            </ContainerSpinner>
        );
    }

    if (statusSchool === 2) {
        return <SchoolFail />;
    }

    if (statusSchool === 1) {
        return <RegisterSchool />;
    }

    return (
        <Container>
            <Schedule />
        </Container>
    );
};

export default Index;
