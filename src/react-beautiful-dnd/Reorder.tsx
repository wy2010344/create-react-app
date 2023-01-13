import React, { useMemo } from 'react'
import { DragDropContext, Droppable, Draggable, DroppableProvided, DroppableStateSnapshot } from "@hello-pangea/dnd";

let uid = 0;
// a little function to help us with reordering the result
function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function Reorder<T>({
  list,
  setList,
  children
}: {
  list: T[]
  setList(v: T[]): void
  children(provided: DroppableProvided, snapshot: DroppableStateSnapshot): React.ReactElement<HTMLElement>;
}) {
  const droppableId = useMemo(() => "dropable" + (uid++), [])
  return (<DragDropContext onDragEnd={result => {
    if (!result.destination) {
      return;
    }
    const newitems = reorder(
      list,
      result.source.index,
      result.destination.index
    );
    setList(newitems.slice())
  }}>
    <Droppable droppableId={droppableId} children={children} />
  </DragDropContext>
  )
}
