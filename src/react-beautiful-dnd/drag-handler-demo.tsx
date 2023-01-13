import React, { useState } from "react";

/**
 * react-beautiful-dnc已经被抛弃,
 * https://www.reddit.com/r/reactjs/comments/t6evog/replacing_react_beautifuldnd/
 * 
 * 但不支持嵌套滚动
 * 与motion配合不好
 * 
 */
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Reorder from "./Reorder";
import MDiv from "../motion/MDiv";
import { AnimatePresence } from "framer-motion";

// fake data generator
const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));
const grid = 8;
function getItemStyle(isDragging: boolean, draggableStyle?: React.CSSProperties): React.CSSProperties {
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
  }
}

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

export default function DragHandlerDemo() {
  const [items, setItems] = useState(() => getItems(20))
  return (
    <div>
      <Reorder list={items} setList={setItems} children={(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
        >
          <AnimatePresence>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <div {...provided.dragHandleProps}>MOVE</div>
                    {item.content}
                    <button onClick={() => {
                      setItems(v => {
                        return v.filter(x => x.id != item.id)
                      })
                    }}>减少</button>
                  </div>
                )}
              </Draggable>
            ))}
          </AnimatePresence>
          {provided.placeholder}
        </div>
      )} />
      <button onClick={() => {
        setItems(items => {
          return items.concat({
            id: "cc" + Date.now(),
            content: "vds"
          })
        })
      }}>添加</button>
    </div>
  )
}