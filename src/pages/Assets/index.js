import React, { useCallback, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";

import Container from "../../components/Container";
import Categories from "../../components/Categories";
import CategoriesContext from "../../components/Categories/context";
import UnitOfMeasurement from "../../components/UnitOfMeasurement";
import UnitOfMeasurementContext from "../../components/UnitOfMeasurement/context";
import Assets from "../../components/Assets";

import api from "../../services/api";

function Index() {
    const [categories, setCategories] = useState([]);

    const [unitOfMeasurements, setUnitOfMeasurements] = useState([]);

    const categoriesIndex = useCallback(() => {
        async function index() {
            try {
                const response = await api.get(
                    "/categories?_limit=-1&deleted=false"
                );

                setCategories(response.data);
            } catch (error) {
                Error(error);
            }
        }

        index();
    }, []);

    const unitOfMeasurementsIndex = useCallback(() => {
        async function index() {
            try {
                const response = await api.get(
                    "/unit-of-measurements?_limit=-1&deleted=false"
                );

                setUnitOfMeasurements(response.data);
            } catch (error) {
                Error(error);
            }
        }

        index();
    }, []);

    useEffect(() => {
        categoriesIndex();
        unitOfMeasurementsIndex();
    }, [categoriesIndex, unitOfMeasurementsIndex]);

    return (
        <CategoriesContext.Provider
            value={{ data: categories, index: categoriesIndex }}
        >
            <UnitOfMeasurementContext.Provider
                value={{
                    data: unitOfMeasurements,
                    index: unitOfMeasurementsIndex,
                }}
            >
                <Container>
                    <Row>
                        <Col md="8" className="p-0">
                            <Assets />
                        </Col>
                        <Col md="4">
                            <Categories />
                            <UnitOfMeasurement />
                        </Col>
                    </Row>
                </Container>
            </UnitOfMeasurementContext.Provider>
        </CategoriesContext.Provider>
    );
}

export default Index;
