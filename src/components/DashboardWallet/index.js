import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaCashRegister } from "react-icons/fa";
import { useHistory } from "react-router-dom";

import { Container } from "./styles";

import { Error } from "../../modules/notifications";
import { Mask } from "../../modules/formatter";

import CircleButton from "../CircleButton";

import api from "../../services/api";

import Table from "../Table";

function Index() {
    const [data, setData] = useState([]);

    const history = useHistory();

    useEffect(() => {
        async function index() {
            try {
                const { data } = await api.get(
                    "/wallets?_limit=5&_sort=createdAt:DESC&deleted=false"
                );

                setData(data);
            } catch (error) {
                Error(error);
            }
        }

        index();
    }, []);

    if (!data.length) return <></>;

    return (
        <Container>
            <header>
                <h2>Últimas Movimentações de Caixa</h2>
                <CircleButton
                    Icon={FaCashRegister}
                    title="Movimentações de Caixa"
                    onClick={() => {
                        history.push("/wallet");
                    }}
                />
            </header>
            <Table>
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Valor</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((wallet) => (
                        <tr key={wallet.id}>
                            <td>
                                {wallet.type === 1 ? (
                                    <FaPlus color="var(--green)" />
                                ) : (
                                    <FaMinus color="var(--red)" />
                                )}
                            </td>
                            <td>
                                R${" "}
                                {Mask(
                                    parseFloat(wallet.price).toFixed(2),
                                    "#.##0,00",
                                    {
                                        reverse: true,
                                    }
                                )}
                            </td>
                            <td>
                                {new Date(wallet.createdAt)
                                    .toLocaleString()
                                    .slice(0, 16)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default Index;
