import axios from "axios";

const api = axios.create({
    baseURL: "https://server.adsamba.tk",
    headers: {
        Authorization: localStorage.getItem("token"),
    },
});

export const requestPublic = {
    headers: { Authorization: "" },
};

export default api;
