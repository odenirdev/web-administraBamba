import React, { useState, useEffect } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import { Error } from "../../modules/notifications";
import System from "../../modules/system";
import { Mask } from "../../modules/formatter";

import AssetOption from "../AssetOption";
import AssetSelected from "../AssetSelected";

import api from "../../services/api";

import { Input } from "react-og-forms";

import { Container, Options, Selected } from "./styles";

function Index({ value, onChange }) {
    const [search, setSearch] = useState("");

    const [show, setShow] = useState("");

    const [options, setOptions] = useState([]);

    useEffect(() => {
        async function indexAssets() {
            try {
                const response = await api.get(
                    "/assets?_limit=-1&deleted=false"
                );

                const serializedAssets = response.data.map((asset) => {
                    const {
                        id,
                        name,
                        category: { name: category },
                        unit_of_measurement: { name: unitName, abbr: unitAbbr },
                        inventory_movements,
                    } = asset;

                    let totalQuantity = 0;

                    inventory_movements.forEach((movement) => {
                        if (movement.type) {
                            totalQuantity += movement.quantity;
                        } else {
                            totalQuantity -= movement.quantity;
                        }
                    });

                    const quantity = `${
                        Math.sign(totalQuantity) < 0 ? "- " : ""
                    }${Mask(parseFloat(totalQuantity).toFixed(2), "##0,00", {
                        reverse: true,
                    })}`;

                    return {
                        id,
                        name,
                        category,
                        quantity,
                        unitOfMeasurement: unitAbbr ? unitAbbr : unitName,
                        image: asset.images[0],
                    };
                });

                const filteredSearchAssets = serializedAssets.filter(
                    (asset) => {
                        return (
                            asset.name.includes(search) ||
                            asset.category.includes(search) ||
                            asset.unitOfMeasurement.includes(search) ||
                            String(asset.quantity).includes(search)
                        );
                    }
                );

                const options = search
                    ? filteredSearchAssets
                    : serializedAssets;

                const serializedValue = value.map((item) => item.asset.id);

                const filteredOptions = options.filter(
                    (option) => !serializedValue.includes(option.id)
                );

                setOptions(filteredOptions);
            } catch (error) {
                Error(error);
            }
        }

        indexAssets();
    }, [search, value]);

    return (
        <Container show={System.isAdmin()}>
            {(System.isAdmin() || value.length !== 0) && <span>Átivos</span>}
            <Selected>
                {value.map((item, index) => (
                    <li key={item.id}>
                        <AssetSelected
                            {...{
                                ...item,
                                onChange,
                                value,
                                index,
                            }}
                            inventory_movement={item.inventory_movement}
                        />
                    </li>
                ))}
            </Selected>
            <div className="controllers">
                <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => {
                        setShow(true);
                    }}
                />
                <button
                    onClick={(e) => {
                        e.preventDefault();

                        setShow(!show);
                    }}
                >
                    {show ? <FaAngleUp /> : <FaAngleDown />}
                </button>
            </div>
            <Options {...{ show }}>
                {options.map((asset) => (
                    <li key={asset.id}>
                        <AssetOption {...{ ...asset, onChange, value }} />
                    </li>
                ))}
            </Options>
        </Container>
    );
}

export default Index;
