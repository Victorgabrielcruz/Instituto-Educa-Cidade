import Task from "../Task";

export default function TaskList({ tasks, onViewTask, onEditTask, onRemoveTask }) {
  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <Task
          key={task.id || index} 
          name={task.title}
          status={task.priority}
          onViewTask={() => onViewTask(task)}
          onEdit={() => onEditTask(task)}
          onDelete={() => onRemoveTask(index)}
        />
      ))}
    </div>
  );
}