import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const CalenderCell: React.FC<{ draggableIndex: number; name: string }> = ({ draggableIndex, name }) => {
  return (
    <Draggable
      disableInteractiveElementBlocking={false}
      draggableId={`draggable-${draggableIndex}`}
      index={Math.floor(draggableIndex * 1000)}
    >
      {(provided) => (
        <div
          className={'week-calender-cell'}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="calender-schedule-cell-inner">
            <div className="companyName">
              <span>{name}</span>
            </div>
            <div className="sceneName">テスト現場</div>
            <div className="timeRange">
              <div className="start">午後6:00</div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
const Calender: React.FC<{ schedules: Array<{ id: number; name: string; day: number }> }> = ({ schedules }) => {
  return (
    <div className={'week-calender'}>
      <div className="week-calender-header">
        <div className="week-calender-header-cell today">
          <div className="date-text">
            <div>21(火)</div>
          </div>
        </div>
        <div className="week-calender-header-cell">
          <div className="date-text">
            <div>22(水)</div>
          </div>
        </div>
        <div className="week-calender-header-cell">
          <div className="date-text">
            <div>23(木)</div>
          </div>
        </div>
        <div className="week-calender-header-cell">
          <div className="date-text">
            <div>24(金)</div>
          </div>
        </div>
        <div className="week-calender-header-cell   saturday">
          <div className="date-text">
            <div>25(土)</div>
          </div>
        </div>
        <div className="week-calender-header-cell    sunday">
          <div className="date-text">
            <div>26(日)</div>
          </div>
        </div>
        <div className="week-calender-header-cell">
          <div className="date-text">
            <div>27(月)</div>
          </div>
        </div>
      </div>
      <div className="week-calender-body">
        {[0, 1, 2, 3, 4, 5, 6].map((d) => (
          <Droppable key={d} droppableId={`droppable-${d}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
                {...provided.droppableProps}
              >
                {provided.placeholder}
                {schedules
                  .filter((s) => s.day === d)
                  .map((s) => (
                    <CalenderCell key={s.id} draggableIndex={s.id} name={s.name} />
                  ))}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [schedules, setSchedules] = useState([
    { name: 'テスト予定1', id: Math.random(), day: 1 },
    { name: 'テスト予定2', id: Math.random(), day: 1 },
    { name: 'テスト予定3', id: Math.random(), day: 2 },
  ]);
  return (
    <React.StrictMode>
      <DragDropContext
        onDragEnd={(result) => {
          const { destination: destinationDroppable, draggableId } = result;
          const copySrc = schedules.find((s) => `draggable-${s.id}` === draggableId);
          if (!copySrc) {
            // 想定外処理が起きた時のガード
            return;
          }
          if (copySrc.day === Number(destinationDroppable?.droppableId?.replace('droppable-', ''))) {
            // 純粋重複はダメ
            return;
          }

          setSchedules((old) => [
            ...old,
            {
              name: copySrc?.name ?? '',
              id: Math.random(),
              day: Number(destinationDroppable?.droppableId?.replace('droppable-', '')),
            },
          ]);
        }}
      >
        <Calender schedules={schedules} />
      </DragDropContext>
    </React.StrictMode>
  );
};
ReactDOM.render(<App />, document.getElementById('app'));
