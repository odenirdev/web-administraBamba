import React, { useEffect, useState, useContext } from "react";
import { FiMinus } from "react-icons/fi";
import $ from "jquery";
import "jquery-mask-plugin";
import produce from "immer";

import { Container } from "./styles";

import AuthContext from "../AuthContext";

import EmptyImage from "../../assets/images/empty.jpg";
import api from "../../services/api";

import { Error } from "../../modules/notifications";
import confirm from "../../modules/alertConfirm";
import System from "../../modules/system";
import { Mask } from "../../modules/formatter";

function Index({
    asset,
    quantity,
    value,
    onChange,
    index,
    id: assetsContributionsID,
    inventory_movement,
}) {
    const [data, setData] = useState({});

    const {
        auth: { me },
    } = useContext(AuthContext);

    useEffect(() => {
        $(".input-quantity").mask("##0,00", {
            reverse: true,
        });
    }, []);

    useEffect(() => {
        async function show() {
            try {
                const response = await api.get(
                    `/assets-contributions/${assetsContributionsID}`
                );

                const { data: dataTask } = await api.get(
                    `/assets/${response.data.asset.id}`
                );

                const {
                    id,
                    name,
                    category: { name: category },
                    unit_of_measurement: { name: unitName, abbr: unitAbbr },
                } = dataTask;

                let data = {
                    id,
                    name,
                    category,
                    unitOfMeasurement: unitAbbr ? unitAbbr : unitName,
                    image: dataTask.images[0],
                };

                setData(data);
            } catch (error) {
                Error(error);
            }
        }

        if (assetsContributionsID) {
            show();
        } else {
            setData(asset);
        }
    }, [asset, assetsContributionsID]);

    function setImage() {
        return data.image
            ? `${api.defaults.baseURL}${data.image.url}`
            : EmptyImage;
    }

    function handleOnClick(e) {
        e.preventDefault();

        if (assetsContributionsID) {
            confirm(
                "Remover átivo",
                "Tem certeza que deseja remover ?",
                async () => {
                    try {
                        await api.delete(
                            `/assets-contributions/${assetsContributionsID}`
                        );

                        await api.put(
                            `/inventory-movements/${inventory_movement}`,
                            { deleted: true }
                        );

                        const filteredValue = value.filter(
                            (item) => item.asset.id !== asset.id
                        );

                        onChange(filteredValue);
                    } catch (error) {
                        Error(error);
                    }
                }
            );
        } else {
            const filteredValue = value.filter(
                (item) => item.asset.id !== asset.id
            );

            onChange(filteredValue);
        }
    }

    async function handleOnChange() {
        let newQuantity = $(`#input-quantity-${index}`).html();

        if (assetsContributionsID && newQuantity) {
            if (parseFloat(newQuantity) === 0) return;

            await api.put(`/assets-contributions/${assetsContributionsID}`, {
                quantity: parseFloat(newQuantity).toFixed(2),
            });

            await api.put(`/inventory-movements/${inventory_movement}`, {
                quantity: parseFloat(newQuantity).toFixed(2),
            });

            await api.post(`/inventory-movements-logs`, {
                inventory_movement,
                text: `alterou a quantidate de ${Mask(
                    parseFloat(quantity).toFixed(2),
                    "##0,00",
                    {
                        reverse: true,
                    }
                )} para ${Mask(parseFloat(newQuantity).toFixed(2), "##0,00", {
                    reverse: true,
                })}`,
                createdAt: new Date(),
                createdBy: me.id,
            });
        }

        onChange(
            produce(value, (draftState) => {
                draftState[index].quantity = newQuantity;
            })
        );
    }

    return (
        <Container>
            <section>
                <img src={setImage()} alt="" />
                <label>
                    Nome <strong>{data.name}</strong>
                </label>
                <label>
                    Categoria <span>{data.category}</span>
                </label>

                <label>
                    Quantidade{" "}
                    <span
                        onInput={handleOnChange}
                        className="input-quantity"
                        id={`input-quantity-${index}`}
                        contentEditable={System.isAdmin()}
                    >
                        {quantity}
                    </span>
                </label>

                <label>
                    Un. de Medida <span>{data.unitOfMeasurement}</span>
                </label>
            </section>
            {System.isAdmin() && (
                <div onClick={handleOnClick}>
                    <FiMinus />
                </div>
            )}
        </Container>
    );
}

export default Index;
