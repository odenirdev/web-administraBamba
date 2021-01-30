import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Player } from "video-react";

import WalletVideo from "../../assets/videos/wallet.mp4";
import AssetsVideo from "../../assets/videos/asset.mp4";

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

            default:
                setVideo("");
        }

        console.log(location.pathname);
    }, [location.pathname]);

    return (
        <Container>
            <Player playsInline src={video} />
        </Container>
    );
}

export default Index;
