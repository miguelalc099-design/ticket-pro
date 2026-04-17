import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";

const estados = ["Abierto", "En proceso", "Cerrado"];

function KanbanBoard({ tickets, reload }) {
  const API = "http://localhost:3001";

  const cambiarEstado = async (id, estado) => {
    await axios.put(`${API}/tickets/${id}/estado`, { estado });
    reload();
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const id = result.draggableId;
    const nuevoEstado = result.destination.droppableId;

    cambiarEstado(id, nuevoEstado);
  };

  return (
    <div className="kanban-container">
      <DragDropContext onDragEnd={onDragEnd}>
        {estados.map((estado) => (
          <Droppable droppableId={estado} key={estado}>
            {(provided) => (
              <div
                className="kanban-column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h3>{estado}</h3>

                {tickets
                  .filter((t) => t.estado === estado)
                  .map((t, index) => (
                    <Draggable
                      key={t.id}
                      draggableId={String(t.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="kanban-card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <h4>{t.titulo}</h4>
                          <p>{t.descripcion}</p>
                          <small>👤 {t.usuario}</small>
                        </div>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}

export default KanbanBoard;