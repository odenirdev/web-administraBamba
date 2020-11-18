import React, { useState, useEffect, useContext } from "react";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Boards from "./pages/Boards";
import Board from "./pages/Board";
import School from "./pages/School";
import RegisterSchool from "./pages/RegisterSchool";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Api from "./services/api";

import AuthContext from "./components/AuthContext";

const Authenticated = ({ component: Component, ...rest }) => {
    const authContext = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={(props) =>
                authContext.isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/auth",
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    );
};

const Index = () => {
    const [me, setMe] = useState({ isAuthenticated: true, me: {} });

    useEffect(() => {
        const showMe = async () => {
            try {
                const response = await Api.get("/users/me");

                setMe({ isAuthenticated: true, me: response.data });
            } catch (error) {
                setMe({ ...me, isAuthenticated: false });
            }
        };

        showMe();
    }, [me]);

    return (
        <BrowserRouter>
            <Switch>
                <AuthContext.Provider value={me}>
                    <Route exact path="/register" component={Register} />
                    <Route
                        exact
                        path="/forgot-password"
                        component={ForgotPassword}
                    />
                    <Route
                        exact
                        path="/reset-password"
                        component={ResetPassword}
                    />
                    <Authenticated exact path="/" component={Home} />
                    <Route exact path="/auth" component={Login} />
                    <Authenticated exact path="/boards" component={Boards} />
                    <Authenticated exact path="/board/:id" component={Board} />
                    <Authenticated exact path="/school" component={School} />
                    <Authenticated
                        exact
                        path="/register-school"
                        component={RegisterSchool}
                    />
                </AuthContext.Provider>
            </Switch>
        </BrowserRouter>
    );
};

export default Index;
