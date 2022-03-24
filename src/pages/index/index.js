import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import "./index.css";

const DisksModel = [
  { id: '0', content: "Disco 1" },
  { id: '1', content: "Disco 2" },
  { id: '2', content: "Disco 3" },
];

const PolesModel = {
  0: {
    id: '0',
    name: "Torre 1",
    disks: DisksModel
  },
  1: {
    id: '1',
    name: "Torre 2",
    disks: []
  },
  2: {
    id: '2',
    name: "Torre 3",
    disks: []
  },
};

const onDragEnd = async (Result, Poles, setPoles) => {
  if (!Result.destination) return;
  const { source, destination } = Result;
  if (destination.index !== 0 || source.droppableId === destination.droppableId || source.index !== 0) return;

  if (source.droppableId !== destination.droppableId) {
    const SourcePole = Poles[source.droppableId];
    const DestinationPole = Poles[destination.droppableId];
    const SourceDisks = [...SourcePole.disks];
    const DestinationDisks = [...DestinationPole.disks];
    const [removed] = SourceDisks.splice(source.index, 1);
    DestinationDisks.splice(destination.index, 0, removed);

    if (DestinationDisks.length > 1 && DestinationDisks[1].id < DestinationDisks[0].id) return;

    await setPoles({
      ...Poles,
      [source.droppableId]: {
        ...SourcePole,
        disks: SourceDisks
      },
      [destination.droppableId]: {
        ...DestinationPole,
        disks: DestinationDisks
      }
    });
  } else {
    const Pole = Poles[source.droppableId];
    const CopiedDisks = [...Pole.disks];
    const [removed] = CopiedDisks.splice(source.index, 1);
    CopiedDisks.splice(destination.index, 0, removed);
    setPoles({
      ...Poles,
      [source.droppableId]: {
        ...Pole,
        disks: CopiedDisks
      }
    });
  }
};

function App() {
  const [Poles, setPoles] = useState(PolesModel);
  const [StartPoleID, setStartPoleID] = useState('0');

  useEffect(() => {
    async function CheckVictory(PolePosition) {
      if (Poles[PolePosition].id !== StartPoleID && Poles[PolePosition].disks.length === 3) {
        setStartPoleID(PolePosition.toString());
        alert("Victory!");
      } else {
        if (PolePosition < (Object.keys(Poles).length - 1)) {
          CheckVictory(PolePosition + 1);
        } else {
          return;
        }
      }
    }

    CheckVictory(0);
  }, [Poles]);

  return (
    <div className="Index">
      <DragDropContext onDragEnd={Result => onDragEnd(Result, Poles, setPoles)}>
        {Object.entries(Poles).map(([PoleID, Pole], index) => {
          return (
            <div key={PoleID} className="poles">
              <p className="title">{Pole.name}</p>
              <div className="header">
                <Droppable droppableId={PoleID} key={PoleID}>
                  {(provided, snapshot) => {
                    return (
                      <div className="body" {...provided.droppableProps} ref={provided.innerRef}>
                        <p className="pole_color" />
                        {Pole.disks.map((item, index) => {
                          return (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => {
                                return (
                                  <div className={(item.id == 0) ? "draggable zero" : (item.id == 1) ? "draggable one" : "draggable two"} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                    style={{
                                      ...provided.draggableProps.style,
                                      opacity: snapshot.isDragging
                                        ? "0.5" : "1",
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        <p className="pole_base_color"/>
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;