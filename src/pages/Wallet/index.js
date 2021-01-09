import React, { useCallback, useEffect, useState } from "react";
import {
    FaMoneyBillWave,
    FaPlus,
    FaMinus,
    FaCalendarWeek,
    FaFolder,
} from "react-icons/fa";
import { Row, Col } from "react-bootstrap";

import NavbarContainer from "../../components/Container";
import Tooltip from "../../components/Tooltip";
import Modal from "../../components/Modal";
import { ResponsiveTable } from "../../components/Table";

import { Error } from "../../modules/notifications";
import { Mask } from "../../modules/formatter";

import api from "../../services/api";

import WalletModal from "../../modals/Wallet";

import { Container } from "./styles";

function Index() {
    const [show, setShow] = useState(false);

    const [title, setTitle] = useState("");

    const [type, setType] = useState(0);

    const [total, setTotal] = useState(0);

    const [moneyIn, setMoneyIn] = useState(0);

    const [moneyOut, setMoneyOut] = useState(0);

    const [data, setData] = useState([]);

    const [selectedWallet, setSelectedWallet] = useState({});

    const index = useCallback(() => {
        async function index() {
            try {
                const response = await api.get(
                    "/wallets?_limit=-1&deleted=false&_sort=id:desc"
                );

                setData(response.data);
            } catch (error) {
                Error(error);
            }
        }

        index();
    }, []);

    const calcWallet = useCallback(() => {
        function calcWalletTotal() {
            let total = 0.0;
            data.forEach((item) => {
                if (item.type === 1) {
                    total += item.price;
                } else {
                    total -= item.price;
                }
            });
            setTotal(total);
        }

        function calcWalletIn() {
            let total = 0.0;
            data.forEach((item) => {
                if (item.type === 1) total += item.price;
            });
            setMoneyIn(total);
        }

        function calcWalletOut() {
            let total = 0.0;
            data.forEach((item) => {
                if (!(item.type === 1)) total += item.price;
            });
            setMoneyOut(total);
        }

        calcWalletTotal();
        calcWalletIn();
        calcWalletOut();
    }, [data]);

    useEffect(() => {
        index();
    }, [index]);

    useEffect(() => {
        calcWallet();
    }, [calcWallet]);

    function handleMoneyIn() {
        setShow(true);
        setTitle("Entrada de dinheiro");
        setType(1);
        setSelectedWallet({});
    }

    function handleMoneyOut() {
        setShow(true);
        setTitle("Saída de dinheiro");
        setType(0);
        setSelectedWallet({});
    }

    function handleOpenModal(item) {
        setShow(true);
        setTitle("Movimentação");
        setType(item.type);
        setSelectedWallet(item);
    }

    const handleCloseModal = () => {
        setShow(false);
        setSelectedWallet({});
    };

    return (
        <>
            <Modal title={title} show={show} onClose={handleCloseModal}>
                <WalletModal
                    {...{
                        type,
                        onClose: handleCloseModal,
                        selectedWallet,
                        reload: index,
                    }}
                />
            </Modal>
            <NavbarContainer>
                <Container>
                    <header>
                        <h1>
                            Carteira
                            <button
                                className="money-in"
                                onClick={handleMoneyIn}
                            >
                                <FaPlus />
                                <FaMoneyBillWave />
                            </button>
                            <button
                                className="money-out"
                                onClick={handleMoneyOut}
                            >
                                <FaMinus />
                                <FaMoneyBillWave />
                            </button>
                        </h1>
                        <div>
                            <Tooltip
                                background={
                                    Math.sign(total) >= 0
                                        ? "var(--blue)"
                                        : "var(--red)"
                                }
                                color="#FFF"
                            >
                                <strong
                                    className={
                                        Math.sign(total) >= 0
                                            ? "money-all"
                                            : "money-out"
                                    }
                                >
                                    R$ {Math.sign(total) < 0 && "- "}
                                    {Mask(
                                        parseFloat(total).toFixed(2),
                                        "#.##0,00",
                                        { reverse: true }
                                    )}
                                </strong>
                                <span className="tooltiptext">Total R$</span>
                            </Tooltip>
                            <Tooltip background="var(--green)" color="#FFF">
                                <strong className="money-in">
                                    R$ +{" "}
                                    {Mask(
                                        parseFloat(moneyIn).toFixed(2),
                                        "#.##0,00",
                                        { reverse: true }
                                    )}
                                </strong>
                                <span className="tooltiptext">Entrada R$</span>
                            </Tooltip>
                            <Tooltip background="var(--red)" color="#FFF">
                                <span className="money-out">
                                    R$ -{" "}
                                    {Mask(
                                        parseFloat(moneyOut).toFixed(2),
                                        "#.##0,00",
                                        { reverse: true }
                                    )}
                                </span>
                                <span className="tooltiptext">Saída R$</span>
                            </Tooltip>
                        </div>
                    </header>
                    <section>
                        <Row>
                            {data.length !== 0 && (
                                <Col md={6}>
                                    <ResponsiveTable>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th colSpan={4}>
                                                        Movimentações
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((item) => (
                                                    <tr key={item.id}>
                                                        <td
                                                            className={
                                                                item.type === 1
                                                                    ? "money-in"
                                                                    : "money-out"
                                                            }
                                                        >
                                                            {item.type === 1 ? (
                                                                <FaPlus />
                                                            ) : (
                                                                <FaMinus />
                                                            )}
                                                        </td>
                                                        <td>
                                                            R$
                                                            {Mask(
                                                                parseFloat(
                                                                    item.price
                                                                ).toFixed(2),
                                                                "#.##0,00",
                                                                {
                                                                    reverse: true,
                                                                }
                                                            )}
                                                        </td>
                                                        <td>
                                                            <FaCalendarWeek className="mr-1" />
                                                            {String(
                                                                new Date(
                                                                    item.createdAt
                                                                ).toLocaleString()
                                                            ).slice(0, 16)}
                                                        </td>
                                                        <td className="d-flex justify-content-center">
                                                            <FaFolder
                                                                className="open-icon"
                                                                onClick={() => {
                                                                    handleOpenModal(
                                                                        item
                                                                    );
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </ResponsiveTable>
                                </Col>
                            )}
                        </Row>
                    </section>
                </Container>
            </NavbarContainer>
        </>
    );
}

export default Index;
