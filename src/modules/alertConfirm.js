import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Confirm = (title, message, confirm = () => {}) => {
    confirmAlert({
        title,
        message,
        buttons: [
            {
                label: "Sim",
                onClick: () => {
                    confirm();
                },
            },
            {
                label: "Não",
                onClick: () => {
                    return;
                },
            },
        ],
    });
};

export default Confirm;
