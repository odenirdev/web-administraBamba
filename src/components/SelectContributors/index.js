import React, { useState, useEffect } from "react";
import { Input } from "react-og-forms";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import produce from "immer";

import SelectUser from "../SelectUser";

import { Container, Grid } from "./styles";

function Index({ users, value, onChange }) {
    const [search, setSearch] = useState("");

    const [selectionUsers, setSelectionUsers] = useState([]);

    const [show, setShow] = useState(false);

    useEffect(() => {
        setSelectionUsers(users);
    }, [users]);

    useEffect(() => {
        const selectedUsers = value.map((item) => item.value);

        const filteredUsers = selectionUsers.filter(
            (user) => !selectedUsers.includes(user.value)
        );

        if (JSON.stringify(selectionUsers) !== JSON.stringify(filteredUsers)) {
            setSelectionUsers(filteredUsers);
        }
    }, [selectionUsers, value]);

    function handleClick() {
        setShow(!show);
    }

    function handleSelectUser(user) {
        onChange(
            produce(value, (draftState) => {
                draftState.push(user);
            })
        );

        setSelectionUsers(
            produce(selectionUsers, (draftState) => {
                draftState.splice(user.index, 1);
            })
        );
    }

    function handleMarkOff(user) {
        setSelectionUsers(
            produce(selectionUsers, (draftState) => {
                draftState.push(user);
            })
        );

        onChange(
            produce(value, (draftState) => {
                draftState.splice(user.index, 1);
            })
        );
    }

    return (
        <Container className="row">
            <span className="col-12 p-0">Contribuidores</span>
            {value.length !== 0 && (
                <Grid>
                    {value.map((user, index) => (
                        <SelectUser
                            key={index}
                            {...user}
                            onClick={() => handleMarkOff({ ...user, index })}
                            show={true}
                            selected={true}
                        />
                    ))}
                </Grid>
            )}
            <div className="col-12 p-0 row">
                <div className="col-11 p-0">
                    <Input
                        className="d-flex"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => {
                            if (!show) handleClick();
                        }}
                    />
                </div>
                <div className="col-1 p-0 d-flex justify-content-end align-items-end ">
                    <div
                        className="select-users-dropdown-icon"
                        onClick={() => {
                            handleClick();
                        }}
                    >
                        {show ? <FaAngleUp /> : <FaAngleDown />}
                    </div>
                </div>
            </div>

            <Grid className="select-users-grid">
                {selectionUsers.map((user, index) => (
                    <SelectUser
                        key={index}
                        {...user}
                        onClick={() => handleSelectUser({ ...user, index })}
                        show={
                            !search
                                ? show
                                : user.username.includes(search) ||
                                  user.email.includes(search)
                        }
                    />
                ))}
            </Grid>
        </Container>
    );
}

export default Index;
