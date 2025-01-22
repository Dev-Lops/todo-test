import { Task } from '../../../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <div
          className={`w-5 h-5 flex items-center justify-center border-2 rounded cursor-pointer ${task.completed ? "border-black" : "border-gray-400"
            }`}
          onClick={() => onToggle(task.id)}
        >
          {task.completed && <div className="w-3 h-3 bg-teal-400"></div>}
        </div>
        <span
          className={`font-medium text-gray-800 ${task.completed ? "line-through text-gray-500" : ""
            }`}
        >
          {task.title}
        </span>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </li>
  );
} 