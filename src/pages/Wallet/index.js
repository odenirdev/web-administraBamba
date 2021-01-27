import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { FaMoneyBillWave, FaPlus, FaMinus, FaFolder } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";

import NavbarContainer from "../../components/Container";
import Tooltip from "../../components/Tooltip";
import Modal from "../../components/Modal";
import Table, { ResponsiveTable } from "../../components/Table";
import CicleButton from "../../components/AddButton";
import { Input } from "../../components/Form";

import { Error } from "../../modules/notifications";
import { Mask } from "../../modules/formatter";
import DataTables from "../../modules/datatables";

import api from "../../services/api";

import WalletModal from "../../modals/Wallet";

import { Container } from "./styles";

function Index() {
    const [show, setShow] = useState(false);

    const [title, setTitle] = useState("");

    const [total, setTotal] = useState(0);

    const [moneyIn, setMoneyIn] = useState(0);

    const [moneyOut, setMoneyOut] = useState(0);

    const [data, setData] = useState([]);

    const [filters, setFilters] = useState({
        begin: "",
        end: "",
    });

    const [selectedWallet, setSelectedWallet] = useState("");

    const index = useCallback(() => {
        async function index() {
            try {
                let endPoint =
                    "/wallets?_limit=-1&_sort=createdAt:DESC&deleted=false";

                if (filters.begin) {
                    endPoint += `&createdAt_gte=${filters.begin}`;
                }

                if (filters.end) {
                    endPoint += `&createdAt_lte=${filters.end}T23:59:59`;
                }

                const response = await api.get(endPoint);

                setData(response.data);
            } catch (error) {
                Error(error);
            }
        }

        index();
    }, [filters.begin, filters.end]);

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

    const setReactComponentinTable = useCallback(() => {
        const handleEdit = (id) => {
            setSelectedWallet(id);
            setTitle("Movimentação");
            setShow(true);
        };

        const setReactComponentinTable = () => {
            const editarEls = document.querySelectorAll(".editar");

            for (const editarEl of editarEls) {
                ReactDOM.render(
                    <FaFolder
                        className="open-icon"
                        onClick={() => {
                            handleEdit(editarEl.dataset.id);
                        }}
                    />,
                    document.getElementById(editarEl.id)
                );
            }

            const typeEls = document.querySelectorAll(".type");

            for (const typeEl of typeEls) {
                ReactDOM.render(
                    typeEl.dataset.value === "1" ? (
                        <FaPlus color="var(--green)" />
                    ) : (
                        <FaMinus color="var(--red)" />
                    ),
                    document.getElementById(typeEl.id)
                );
            }
        };

        setReactComponentinTable();
    }, []);

    useEffect(() => {
        const serializedData = data.map((item) => {
            const { id, type, price, createdAt } = item;

            const formatPrice = Mask(parseFloat(price).toFixed(2), "#.##0,00", {
                reverse: true,
            });

            const formatCreatedAt = new Date(createdAt)
                .toLocaleString()
                .slice(0, 16);

            return {
                id,
                type: `<div class="type" data-value="${type}" id="type-${id}"></div>`,
                price: formatPrice,
                createdAt: formatCreatedAt,
                open: `<div class="editar" data-id="${id}" id="editar-${id}"></div>`,
            };
        });

        DataTables(
            "#wallet-table",
            serializedData,
            [
                { title: "Tipo", data: "type", orderable: false },
                { title: "Valor", data: "price", orderable: false },
                { title: "Data", data: "createdAt", orderable: false },
                { title: "Abrir", data: "open", orderable: false },
            ],
            () => {
                setReactComponentinTable();
            }
        );
    }, [data, setReactComponentinTable]);

    function handleAddMovement() {
        setShow(true);
        setTitle("Nova Movimentação");
        setSelectedWallet("");
    }

    const handleCloseModal = () => {
        setShow(false);
        setSelectedWallet("");
    };

    return (
        <>
            <Modal title={title} show={show} onClose={handleCloseModal}>
                <WalletModal
                    {...{
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
                            Movimentações de Caixa
                            <CicleButton
                                Icon={FaMoneyBillWave}
                                title="Cadastrar Movimentação"
                                onClick={handleAddMovement}
                            />
                        </h1>
                        <Row className="filters-data">
                            <Col>
                                <Input
                                    type="date"
                                    name="begin"
                                    label="Início"
                                    value={filters.begin}
                                    onChange={(e) => {
                                        setFilters({
                                            ...filters,
                                            begin: e.target.value,
                                        });
                                    }}
                                />
                            </Col>
                            <Col>
                                <Input
                                    type="date"
                                    name="end"
                                    label="Fim"
                                    value={filters.end}
                                    onChange={(e) => {
                                        setFilters({
                                            ...filters,
                                            end: e.target.value,
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
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
                            <ResponsiveTable>
                                <Table id="wallet-table" />
                            </ResponsiveTable>
                        </Row>
                    </section>
                </Container>
            </NavbarContainer>
        </>
    );
}

export default Index;
