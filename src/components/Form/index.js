import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Styled from "styled-components";
import StyledReactSelect from "react-select";

import StyledInput from "../Input";
import StyledTextArea from "../TextArea";
import StyledSelect from "../Select";
import Label from "../Label";

const Index = Styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: ${(props) => props["max-width"] || "auto"};
    margin: 1rem 0;

    @media (max-width: 750px) {
        max-width: ${(props) => props["sm-max-width"] || "auto"};
    }
`;

export const FormItem = Styled(Col)`
    padding: 0 0.25rem;
`;

const StyledLabel = Styled(Label)`
    width: 100%;
    max-width: ${(props) => props["max-width"] || "auto"};
    display: flex;
    flex-wrap: wrap;

    & span {
        width: 100%;
    }
`;

const CaractersGrid = Styled.div`
    display: flex;
    justify-content: flex-end;

    font-weight: 400;
    font-size: 1rem;
`;

export const Input = (props) => {
    const [length, setLength] = useState(props.value.length || 0);

    const onChange = props.onChange || (() => {});

    useEffect(() => {
        if (length !== props.value.length) {
            setLength(props.value.length);
        }
    }, [length, props.value.length]);

    return (
        <StyledLabel>
            <span>{props.label}</span>
            <StyledInput
                {...props}
                onChange={(event) => {
                    setLength(event.target.value.length);

                    onChange(event);
                }}
            />
            {props.maxLength && (
                <CaractersGrid>
                    {length}/{props.maxLength} caracteres
                </CaractersGrid>
            )}
        </StyledLabel>
    );
};

export const Select = (props) => {
    const onChange = props.onChange || (() => {});

    return (
        <StyledLabel>
            <span>{props.label}</span>
            <StyledSelect
                {...props}
                onChange={(event) => {
                    onChange(event);
                }}
            >
                {props.children}
            </StyledSelect>
        </StyledLabel>
    );
};

export const ReactSelect = (props) => {
    return (
        <StyledLabel>
            <span>{props.label}</span>
            <StyledReactSelect {...props} />
        </StyledLabel>
    );
};

export const TextArea = (props) => {
    const [length, setLength] = useState(props.value.length || 0);

    const onChange = props.onChange;

    useEffect(() => {
        if (length !== props.value.length) {
            setLength(props.value.length);
        }
    }, [length, props.value.length]);

    return (
        <StyledLabel>
            <span>{props.label}</span>
            <StyledTextArea
                {...props}
                onChange={(event) => {
                    setLength(event.target.value.length);

                    onChange(event);
                }}
            />
            {props.maxLength && (
                <CaractersGrid>
                    {length}/{props.maxLength} caracteres
                </CaractersGrid>
            )}
        </StyledLabel>
    );
};

export const GridButtons = Styled(Row)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    
    width: 100%;
    margin-top: 0.4rem;
`;

export default Index;
