import styled from "styled-components";

export const Container = styled.div`
    label {
        display: flex;
        flex-direction: column;
    }

    span {
        font-weight: 700;
        color: var(--gray-2);
    }

    input {
        width: 100%;
    }

    .select-users-dropdown-icon {
        background-color: #fafafa;
        color: var(--blue);

        width: 54px;
        height: 54px;

        border-radius: 2px;
        box-shadow: 1px 1px 3px -1px #121212;

        display: flex;
        justify-content: center;
        align-items: center;

        margin-bottom: 1rem;

        cursor: pointer;
    }

    .select-users-dropdown-icon:hover {
        background-color: var(--blue);
        color: #fafafa;
    }
`;

export const Grid = styled.div.attrs({
    className: "row",
})`
    width: 100%;

    .select-user-container {
        padding: 0 1rem 1rem 0;
    }

    @media (max-width: 750px) {
        .select-user-container {
            padding: 0 0 1rem 0;
        }

        .select-user-container:last-child {
            padding: 0;
        }
    }
`;
