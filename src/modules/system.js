import { useContext } from "react";

import AuthContext from "../components/AuthContext";

class System {
    static isAdmin() {
        const {
            auth: { me },
        } = useContext(AuthContext);

        return me.role && me.role.id === 4;
    }

    static sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return x < y ? -1 : x > y ? 1 : 0;
        });
    }

    static isOverDue(date) {
        if (!date) {
            return false;
        }

        let formmatDate = new Date(date).toISOString();
        formmatDate = formmatDate.slice(0, formmatDate.indexOf("T"));
        formmatDate = `${formmatDate}T23:59:59`;

        let formmatToday = new Date().toISOString();
        formmatToday = formmatToday.slice(0, formmatToday.indexOf("T"));
        formmatToday = `${formmatToday}T23:59:59`;

        const dueDate = new Date(formmatDate).getTime();
        const today = new Date(formmatToday).getTime();
        return dueDate < today;
    }

    static isMobile() {
        var width = window.innerWidth;

        return width <= 750;
    }
}

export default System;
