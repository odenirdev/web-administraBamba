import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Player } from "video-react";

import WalletVideo from "../../assets/videos/wallet.mp4";
import AssetsVideo from "../../assets/videos/asset.mp4";
import ConversationsVideo from "../../assets/videos/conversations.mp4";
import InventoryMovementVideo from "../../assets/videos/inventory-movement.mp4";
import ScheduleVideo from "../../assets/videos/schedule.mp4";
import BoardsComponents from "../../assets/videos/boards_components.mp4";
import Boards from "../../assets/videos/boards.mp4";
import Tasks from "../../assets/videos/tasks.mp4";
import SchoolAdmin from "../../assets/videos/school-admin.mp4";
import School from "../../assets/videos/school.mp4";

import AuthContext from "../AuthContext";

import { Container } from "./styles";

function Index() {
    const location = useLocation();

    const {
        auth: { me },
    } = useContext(AuthContext);

    const [video, setVideo] = useState("");

    useEffect(() => {
        switch (location.pathname) {
            case "/wallet":
                return setVideo(WalletVideo);

            case "/assets":
                return setVideo(AssetsVideo);

            case "/conversations":
                return setVideo(ConversationsVideo);

            case "/inventory-movements":
                return setVideo(InventoryMovementVideo);

            case "/schedule":
                return setVideo(ScheduleVideo);

            case "/boards":
                if (me.role && me.role.id === 1) {
                    return setVideo(BoardsComponents);
                }
                return setVideo(Boards);

            case "/school":
                if (me.role && me.role.id === 4) {
                    return setVideo(SchoolAdmin);
                }
                return setVideo(School);

            default:
                if (String(location.pathname).includes("/conversations")) {
                    return setVideo(ConversationsVideo);
                }

                if (String(location.pathname).includes("/board")) {
                    return setVideo(Tasks);
                }

                return setVideo("");
        }
    }, [location.pathname, me]);

    return (
        <Container>
            <Player playsInline src={video} />
        </Container>
    );
}

export default Index;
