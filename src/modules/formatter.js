import $ from "jquery";
import "jquery-mask-plugin";

export const fDate = (date, type) => {
    switch (type) {
        case "date":
            let newDate = new Date(date).toISOString();
            return newDate.slice(0, newDate.indexOf("T"));

        case "local-datetime":
            let t = new Date(date);
            let z = t.getTimezoneOffset() * 60 * 1000;
            let tLocal = t - z;
            tLocal = new Date(tLocal);
            let iso = tLocal.toISOString();
            iso = iso.slice(0, 16);

            return iso;

        case "local-date":
            let y = new Date(date);
            let w = y.getTimezoneOffset() * 60 * 1000;
            let dateLocal = y - w;
            dateLocal = new Date(dateLocal);
            let isoDateLocal = dateLocal.toISOString();
            isoDateLocal = isoDateLocal.slice(0, 16);

            return isoDateLocal;

        case "datetime":
            let newDatetime = new Date(date).toISOString();
            return newDatetime.slice(0, newDatetime.indexOf("Z") - 7);

        default:
            console.error("type date invalid");
            break;
    }
};

const getStaff = () => $("#staff");

const setStaff = () => {
    const inputStaff = document.createElement("input");
    inputStaff.setAttribute("id", "staff");
    inputStaff.setAttribute("type", "hidden");
    document.querySelector("body").appendChild(inputStaff);
};

const removeStaff = () => {
    $("#staff").remove();
};

export const Mask = (value, mask, options = {}) => {
    setStaff();
    const staff = getStaff();

    staff.mask(mask, options);
    const response = staff.masked(value);

    removeStaff();

    return response;
};
