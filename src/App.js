import React, { useState, useEffect } from "react";
import Routes from "./routes";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import AuthContext from "./components/AuthContext";

import { Error } from "./modules/notifications";
import Api from "./services/api";

const App = () => {
    const [auth, setAuth] = useState({ isAuthenticated: true, me: {} });

    useEffect(() => {
        async function authentication() {
            try {
                if (!localStorage.getItem("token")) {
                    return setAuth({ isAuthenticated: false });
                }

                const response = await Api.get("/users/me");

                setAuth({ isAuthenticated: true, me: response.data });
            } catch (error) {
                Error(error);
                return setAuth({ isAuthenticated: false });
            }
        }

        authentication();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            <DndProvider backend={HTML5Backend}>
                <Routes />
            </DndProvider>
        </AuthContext.Provider>
    );
};

export default App;
