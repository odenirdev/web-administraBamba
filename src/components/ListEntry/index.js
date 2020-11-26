import React, { useRef, useContext } from "react";
import { useDrop } from "react-dnd";

import { Container } from "./styles";

import BoardContext from "../Board/context";

function ListEntry({ indexList: targetListIndex }) {
    const ref = useRef();

    const { data, move } = useContext(BoardContext);

    const [, dropRef] = useDrop({
        accept: "TASK",
        hover(item) {
            const targetIndex = data.lists[targetListIndex].tasks.length;

            const draggedListIndex = item.indexList;

            const draggedIndex = item.index;

            if (draggedListIndex === targetListIndex) {
                return;
            }

            move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);

            item.index = targetIndex;
            item.indexList = targetListIndex;
        },
    });

    dropRef(ref);

    return (
        <Container ref={ref}>
            <p>Arraste e solte tarefas...</p>
        </Container>
    );
}

export default ListEntry;
