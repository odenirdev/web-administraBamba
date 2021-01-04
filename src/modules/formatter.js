import $ from "jquery";
import "jquery-mask-plugin";

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
