import React, { useEffect, useState, useContext } from "react";

import AuthContainer from "../../components/Container";
import Img from "../../components/Img";
import DashboardComponent from "../../components/DashboardComponent";
import DashboardManagers from "../../components/DashboardManagers";
import DashboardAdministrators from "../../components/DashboardAdministrators";
import Spinner, {
    Container as ContainerSpinner,
} from "../../components/SpinnerLoader";

import Api from "../../services/api";

import SchoolFail from "../../pages/SchoolFail";
import RegisterSchool from "../../pages/RegisterSchool";

import ADSAMBAIcon from "../../assets/images/adsamba-logo.png";

import AuthContext from "../../components/AuthContext";

import { Container } from "./styles";

const Index = () => {
    const [statusSchool, setStatusSchool] = useState(0);

    const {
        auth: { me },
    } = useContext(AuthContext);

    useEffect(() => {
        async function authSchool() {
            const response = await Api.get("/schools/count");

            if (response.data === 0) {
                if (me.role.id === 4) {
                    setStatusSchool(1);
                } else {
                    setStatusSchool(2);
                }
            }
        }

        authSchool();
    }, [me]);

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
        <AuthContainer>
            <Container>
                {me.role &&
                    !!Object.keys(me.role).length &&
                    me.role.id === 1 && <DashboardComponent />}

                {me.role &&
                    !!Object.keys(me.role).length &&
                    me.role.id === 3 && <DashboardManagers />}

                {me.role &&
                    !!Object.keys(me.role).length &&
                    me.role.id === 4 && <DashboardAdministrators />}
            </Container>
        </AuthContainer>
    );
};

export default Index;
