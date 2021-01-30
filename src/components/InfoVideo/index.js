import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Player } from "video-react";

import WalletVideo from "../../assets/videos/wallet.mp4";
import AssetsVideo from "../../assets/videos/asset.mp4";
import ConversationsVideo from "../../assets/videos/conversations.mp4";
import InventoryMovementVideo from "../../assets/videos/inventory-movement.mp4";
import ScheduleVideo from "../../assets/videos/schedule.mp4";

import { Container } from "./styles";

function Index() {
    const location = useLocation();

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

            default:
                if (String(location.pathname).includes("/conversations")) {
                    return setVideo(ConversationsVideo);
                }
                return setVideo("");
        }
    }, [location.pathname]);

    return (
        <Container>
            <Player playsInline src={video} />
        </Container>
    );
}

export default Index;
