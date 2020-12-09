import React, { useState, useCallback, useContext } from "react";
import Styled from "styled-components";

import Navbar from "../Navbar";
import Menu from "../Menu";
import Main from "../Main";

import ScheduleContext from "../Schedule/context";
import AuthContext from "../AuthContext";

import Api from "../../services/api";

const Container = Styled.div`
    width: 100%;
    min-height: 100vh;
`;

const Index = (props) => {
    const [events, setEvents] = useState([]);

    const {
        auth: { me },
    } = useContext(AuthContext);

    function serializeIndexData(data) {
        return data.map((event) => {
            const {
                id: Id,
                subject: Subject,
                isAllDay: IsAllDay,
                startTime: StartTime,
                endTime: EndTime,
                description: Description,
                location: Location,
                recurrenceRule: RecurrenceRule,
                isReadOnly: IsReadonly,
            } = event;

            return {
                Id,
                Subject,
                Description,
                Location,
                IsAllDay,
                StartTime,
                EndTime,
                RecurrenceRule,
                IsReadonly,
            };
        });
    }

    const index = useCallback(() => {
        async function index() {
            try {
                const response = await Api.get(
                    `/events?_limit=-1&deleted=false&users_contains=${me.id}`
                );

                const serializedData = serializeIndexData(response.data);

                setEvents(serializedData);
            } catch (error) {
                Error(error);
            }
        }

        index();
    }, [me.id]);

    return (
        <ScheduleContext.Provider value={{ events, index }}>
            <Container>
                <Navbar />
                <Main>{props.children}</Main>
                {props.outChild}
                <Menu />
            </Container>
        </ScheduleContext.Provider>
    );
};

export default Index;
