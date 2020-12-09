export const fDate = (date, type) => {
    switch (type) {
        case "date":
            let newDate = new Date(date).toISOString();
            return newDate.slice(0, newDate.indexOf("T"));

        default:
            console.error("type date invalid");
            break;
    }
};
