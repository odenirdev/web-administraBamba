import React, { useState, useEffect } from "react";
import Routes from "./routes";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "datatables/media/css/jquery.dataTables.css";

import AuthContext from "./components/AuthContext";
import ConversationsContext from "./components/Conversations/context";

import Api from "./services/api";
import Firebase from "./services/firebase";

import "../node_modules/bootstrap/dist/css/bootstrap.css";

import "./assets/styles/global.css";

const App = () => {
    const [auth, setAuth] = useState({ isAuthenticated: true, me: {} });
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        async function authentication() {
            try {
                if (!localStorage.getItem("token")) {
                    return setAuth({ isAuthenticated: false });
                }

                const response = await Api.get("/users/me");

                setAuth({ isAuthenticated: true, me: response.data });
            } catch (error) {
                return setAuth({ isAuthenticated: false });
            }
        }

        authentication();
    }, []);

    useEffect(() => {
        function showConversations() {
            Firebase.child("conversations").on("value", (snapshot) => {
                if (!auth.me || Object.keys(auth.me).length === 0) return;

                const values = snapshot.val();

                if (values === null) return;

                const conversations = Object.keys(values).map((id) => ({
                    ...values[id],
                    id,
                }));

                const meConversations = conversations.filter((conversation) =>
                    conversation.users.includes(auth.me.id)
                );

                setConversations(meConversations);
            });
        }

        showConversations();
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            <ConversationsContext.Provider value={conversations}>
                <DndProvider backend={HTML5Backend}>
                    <Routes />
                </DndProvider>
            </ConversationsContext.Provider>
        </AuthContext.Provider>
    );
};

export default App;
