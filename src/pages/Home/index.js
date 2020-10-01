import React, { useEffect, useState } from "react";
import Container from "../../components/Container";

import Api from "../../services/api";

import SchoolFail from "../../pages/SchoolFail";
import RegisterSchool from "../../pages/RegisterSchool";

const Index = () => {
    const [statusSchool, setStatusSchool] = useState(0);

    const [me, setMe] = useState(0);

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

    if (statusSchool === 1) {
        return <RegisterSchool />;
    }

    if (statusSchool === 2) {
        return <SchoolFail />;
    }

    return <Container></Container>;
};

export default Index;
