import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import Erros from "./erros";

const Index = (type, message) => {
    switch (type) {
        case "info":
            NotificationManager.info(message, "Informação", 3000);
            break;
        case "success":
            NotificationManager.success(message, "Sucesso", 3000);
            break;
        case "warning":
            NotificationManager.warning(message, "Atenção", 3000);
            break;
        case "error":
            NotificationManager.error(message, "Error", 3000);
            break;

        default:
            return "Invalid Type";
    }
};

export const Error = (error) => {
    try {
        console.error(error);
        const erros = JSON.parse(error.request.response).data[0].messages;

        for (const err of erros) {
            Index("error", Erros[err.id] || "Operação Falhou");
        }

        return;
    } catch (error) {
        Index("error", "Operação Falhou");
    }
};

export default Index;
