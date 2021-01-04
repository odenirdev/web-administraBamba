import React, { useState, useEffect } from "react";
import Styled, { css } from "styled-components";
import Dropzone from "react-dropzone";
import { FaImage, FaTrash, FaEye } from "react-icons/fa";

const FileGrid = Styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 24px;
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    margin-bottom: 1rem;

    & span {
        font-family: var(--font-title);
        font-weight: 600;
        height: auto;
    }
   
`;

const dragActive = css`
    border-color: var(--green);
`;

const dragReject = css`
    border-color: var(--red);
`;

export const DropContainer = Styled.div.attrs({
    className: "dropzone",
})`
    width: 100%;
    height: 75%;
    background-color: var(--color-staff);
    border-radius: 2px;
    margin: 0 auto;
    cursor: pointer;
    background-color: var(--gray-3);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    & img {
        width: 100%;
        height: 100%;
        border-radius: 2px;
        border: 2px solid #dddd;
        box-shadow: var(--shadow-default);
        ${(props) => props.isDragActive && dragActive};
        ${(props) => props.isDragReject && dragReject};
    }
    & .viewer-layout-container {
        width: 100%;
        height: 100%;
        border-radius: 2px;
        border: 2px solid #dddd;
        box-shadow: var(--shadow-default);
        ${(props) => props.isDragActive && dragActive};
        ${(props) => props.isDragReject && dragReject};
        grid-template-rows: none;
        zoom: 0.5;
    }
    & .viewer-layout-container .viewer-layout-toolbar {
        display: none;
    }
`;

const FileControl = Styled.div.attrs({
    className: "row",
})`
    height: 15%;
    width: 100%;
`;

const DeleteFile = Styled.div.attrs({
    className: "col cursor-pointer",
})`
    display: flex;
    justify-content: center;
    color: var(--red);
    border: 2px solid var(--red);
    background-color: var(--gray-4);
    transition: 200ms;

    &:hover {
        filter: brightness(130%);
    }
    
    &.file-disabled {
        filter: brightness(75%);
    }

    & svg {
        margin: 2px;
    } 
`;

const ViewFile = Styled.div.attrs({
    className: "col d-flex justify-center align-items-center cursor-pointer",
})`
    background-color: var(--blue);
    color: var(--gray-1);
    transition: 200ms;
    &:hover {
        filter: brightness(130%);
    }
    &.file-disabled {
        filter: brightness(75%);
    }
    & a {
        color: var(--gray-4);
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const EmptyFile = Styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    & span {
        width: 100%;
        font-size: 50%;
    }

    & svg {
        font-size: 200%;
    }
`;

export const File = (props) => {
    const [file, setFile] = useState(props.file || { preview: "" });

    useEffect(() => {
        if (props.file && file !== props.file) {
            setFile(props.file);
        }
    }, [file, props.file]);

    return (
        <FileGrid
            width={`${props.width || 200}px`}
            height={`${props.height || 250}px`}
        >
            <span style={props.labelStyle}>{props.label}</span>
            <Dropzone accept={props.accept} onDropAccepted={props.onUpload}>
                {({
                    getRootProps,
                    getInputProps,
                    isDragActive,
                    isDragReject,
                }) => (
                    <DropContainer
                        {...getRootProps()}
                        isDragActive={isDragActive}
                        isDragReject={isDragReject}
                    >
                        {file.preview ? (
                            <img src={file.preview} alt="Input" />
                        ) : (
                            <EmptyFile>
                                <FaImage className="empty-file" />
                                <span>
                                    Arraste e solte <br /> ou clique aqui
                                </span>
                            </EmptyFile>
                        )}
                        <input {...getInputProps()} />
                    </DropContainer>
                )}
            </Dropzone>
            <FileControl>
                <DeleteFile
                    className={!file.preview && "file-disabled"}
                    onClick={props.onDeleteFile}
                >
                    <FaTrash />
                </DeleteFile>
                <ViewFile className={!file.preview && "file-disabled"}>
                    <a
                        href={file.preview}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaEye />
                    </a>
                </ViewFile>
            </FileControl>
        </FileGrid>
    );
};

const Index = Styled.input`
    width: 100%;
    min-width: ${(props) => props["min-width"] || "auto"};
    max-width: ${(props) => props["max-width"] || "auto"};

    background-color: #FAFAFA;
    border: 0;
    border-radius: 5px;
    padding: 1.4rem 1.4rem;

    box-shadow: var(--input-shadow);

    margin-bottom: 0.5rem;

    outline: 0;
`;

export default Index;
