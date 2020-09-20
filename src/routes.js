import React from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Boards from "./pages/Boards";
import Board from "./pages/Board";
import School from "./pages/School";
import RegisterSchool from "./pages/RegisterSchool";

const Index = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/boards" component={Boards} />
            <Route exact path="/board" component={Board} />
            <Route exact path="/school" component={School} />
            <Route exact path="/register-school" component={RegisterSchool} />
        </Switch>
    </BrowserRouter>
);

export default Index;
