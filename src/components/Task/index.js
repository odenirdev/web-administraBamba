import React, { useRef, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FaCalendarAlt, FaCalendarTimes, FaTasks } from "react-icons/fa";

import BoardContext from "../Board/context";

import { Container } from "./styles";

const Index = ({ data, index, indexList, onClick }) => {
    const ref = useRef();

    const { move } = useContext(BoardContext);

    const [{ isDragging }, dragRef] = useDrag({
        item: {
            id: data.id,
            type: "TASK",
            index,
            indexList,
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, dropRef] = useDrop({
        accept: "TASK",
        hover(item, monitor) {
            const draggedListIndex = item.indexList;
            const targetListIndex = indexList;

            const draggedIndex = item.index;
            const targetIndex = index;

            if (
                draggedIndex === targetIndex &&
                draggedListIndex === targetListIndex
            ) {
                return;
            }

            const targetSize = ref.current.getBoundingClientRect();
            const targetCenter = (targetSize.bottom - targetSize.top) / 2;

            const draggedOffset = monitor.getClientOffset();
            const draggedTop = draggedOffset.y - targetSize.top;

            if (draggedIndex < targetIndex && draggedTop < targetCenter) {
                return;
            }

            if (draggedIndex > targetIndex && draggedTop > targetCenter) {
                return;
            }

            move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);

            item.index = targetIndex;
            item.indexList = targetListIndex;
        },
    });

    function renderClick() {
        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            return { onClick: onClick };
        }

        return { onDoubleClick: onClick };
    }

    dragRef(dropRef(ref));

    return (
        <Container ref={ref} isDragging={isDragging} {...renderClick()}>
            <header>
                <h2>
                    <FaTasks />
                    {data.title}
                </h2>
            </header>
            <div>
                <span>
                    <FaCalendarAlt />
                    {new Date(
                        `${data.createdAt}T23:59:59`
                    ).toLocaleDateString()}
                </span>
                {data.dueDate && (
                    <span>
                        <FaCalendarTimes />
                        {new Date(
                            `${data.dueDate}T23:59:59`
                        ).toLocaleDateString()}
                    </span>
                )}
            </div>
        </Container>
    );
};

export default Index;
