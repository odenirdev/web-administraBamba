import Api, { requestPublic } from "./api";

const isAuthenticated = () => localStorage.getItem("token") !== null;

export default isAuthenticated;
