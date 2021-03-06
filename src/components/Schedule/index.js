import React, { useContext, useEffect } from "react";
import { L10n, loadCldr } from "@syncfusion/ej2-base";
import gregorian from "cldr-data/main/pt/ca-gregorian.json";
import numbers from "cldr-data/main/pt/numbers.json";
import timeZoneNames from "cldr-data/main/pt/timeZoneNames.json";
import numberingSystems from "cldr-data/supplemental/numberingSystems.json";
import weekData from "cldr-data/supplemental/weekData.json";

import config from "../../config/schedule.json";

import Api from "../../services/api";

import Notification, { Error } from "../../modules/notifications";

import AuthContext from "../AuthContext";
import ScheduleContext from "./context";

import {
    ScheduleComponent,
    Inject,
    Day,
    Week,
    WorkWeek,
    Month,
    Agenda,
} from "@syncfusion/ej2-react-schedule";

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);

L10n.load(config);

function Index() {
    const {
        auth: { me },
    } = useContext(AuthContext);

    const { index, events } = useContext(ScheduleContext);

    useEffect(() => {
        index();
    }, [index]);

    function serializeData(data) {
        return data.map((event) => {
            const {
                Subject: subject,
                IsAllDay: isAllDay,
                StartTime: startTime,
                EndTime: endTime,
                Description: description,
                Location: location,
                RecurrenceRule: recurrenceRule,
            } = event;

            return {
                subject,
                description,
                location,
                isAllDay,
                startTime,
                endTime,
                recurrenceRule,
            };
        });
    }

    function handleValidate(data) {
        const { subject, startTime, endTime } = data;

        if (!subject) {
            return { status: false, message: "Título é obrigatório" };
        }

        if (!startTime) {
            return { status: false, message: "Data de início é obrigatório" };
        }

        if (!endTime) {
            return { status: false, message: "Data de fim é obrigatório" };
        }

        return { status: true };
    }

    function create(data) {
        try {
            const serializedData = serializeData(data);
            serializedData.forEach(async (event) => {
                const validate = handleValidate(event);
                if (!validate.status) {
                    return Notification("warning", validate.message);
                }

                await Api.post("/events", { ...event, users: [me.id] });

                index();
                Notification("success", "Evento cadastrado");
            });
        } catch (error) {
            return Error(error);
        }
    }

    function update(data) {
        try {
            const serializedData = serializeData(data);
            serializedData.forEach(async (event, i) => {
                const validate = handleValidate(event);
                if (!validate.status) {
                    return Notification("warning", validate.message);
                }

                await Api.put(`/events/${data[i].Id}`, event);
            });
        } catch (error) {
            return Error(error);
        }
    }

    function destroy(data) {
        try {
            data.forEach(async (event) => {
                await Api.put(`/events/${event.Id}`, { deleted: true });

                index();
            });
        } catch (error) {
            return Error(error);
        }
    }

    function handleActionComplete(data) {
        const {
            requestType,
            addedRecords,
            changedRecords,
            deletedRecords,
        } = data;

        switch (requestType) {
            case "eventCreated":
                return create(addedRecords);

            case "eventChanged":
                return update(changedRecords);

            case "eventRemoved":
                return destroy(deletedRecords);

            default:
                break;
        }
    }

    return (
        <ScheduleComponent
            currentView="Month"
            locale="pt"
            eventSettings={{
                dataSource: events,
            }}
            actionComplete={handleActionComplete}
            allowMultiCellSelection={true}
            allowMultiRowSelection={true}
            allowResizing={true}
            allowDragAndDrop={true}
        >
            <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
        </ScheduleComponent>
    );
}

export default Index;
