import React from "react";
import { FiPlus } from "react-icons/fi";

import { Container } from "./styles";

import EmptyImage from "../../assets/images/empty.jpg";
import api from "../../services/api";

import { Mask } from "../../modules/formatter";

function Index({
    id,
    image,
    name,
    category,
    quantity,
    unitOfMeasurement,
    onChange,
    value,
}) {
    function setImage() {
        return image ? `${api.defaults.baseURL}${image.url}` : EmptyImage;
    }

    function handleOnClick(e) {
        e.preventDefault();

        const asset = {
            id,
            image,
            name,
            category,
            unitOfMeasurement,
        };

        onChange([
            ...value,
            {
                asset,
                quantity: Mask(parseFloat(0).toFixed(2), "##0,00", {
                    reverse: true,
                }),
            },
        ]);
    }

    return (
        <Container>
            <section>
                <img src={setImage()} alt="" />
                <label>
                    Nome <strong>{name}</strong>
                </label>
                <label>
                    Categoria <span>{category}</span>
                </label>

                <label>
                    Quantidade{" "}
                    <span>
                        {Mask(parseFloat(quantity).toFixed(2), "##0,00", {
                            reverse: true,
                        })}
                    </span>
                </label>

                <label>
                    Un. de Medida <span>{unitOfMeasurement}</span>
                </label>
            </section>
            <button onClick={handleOnClick}>
                <FiPlus />
            </button>
        </Container>
    );
}

export default Index;
