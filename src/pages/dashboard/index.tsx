"use client";

import { useAuth } from "../../contexts/AuthContext";
import ClockSection from "../../components/ClockSection";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { Task } from "../../types/task";
import { TaskService } from "@/services/taskService";
import { toast } from "react-toastify";

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onAddTask: (title: string) => void;
}

interface ProfileSectionProps {
  userName: string;
  profileImage: string;
}

const ProfileSection = ({ userName, profileImage }: ProfileSectionProps) => (
  <div className="bg-[#50C2C9] w-full h-auto flex flex-col items-center py-14 px-4 rounded-md md:rounded-lg md:py-16 md:px-6">
    <div className="w-18 h-18 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-lime-400">
      <Image
        src={profileImage || "/Default-profile.png"}
        alt="Profile Picture"
        width={128}
        height={128}
      />
    </div>
    <h1 className="text-white text-md md:text-xl font-semibold mt-4 text-center">
      Welcome <br /> {userName || "Guest"}
    </h1>
  </div>
);

const TaskList = ({ tasks, onToggle, onDelete, onAddTask }: TaskListProps) => {
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (!newTask.trim()) {
      toast.error("O título da tarefa não pode estar vazio.");
      return;
    }
    onAddTask(newTask);
    setNewTask("");
  };

  return (
    <div className="bg-white mt-4 rounded-lg shadow p-4 md:p-6 w-full md:max-w-lg">
      <h2 className="text-lg md:text-xl font-semibold mb-2 text-black">
        Task List
      </h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div
                className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center border-2 rounded cursor-pointer ${
                  task.completed ? "border-black" : "border-gray-400"
                }`}
                onClick={() => onToggle(task.id, !task.completed)}
              >
                {task.completed && (
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-teal-400"></div>
                )}
              </div>
              <span
                className={`font-medium text-gray-800 md:text-base ${
                  task.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {task.title}
              </span>
            </div>
            <button
              title="Delete Task"
              onClick={() => onDelete(task.id)}
              className="text-red-500 hover:text-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6"
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
        ))}
      </ul>
      <div className="flex items-center mt-4">
        <input
          type="text"
          placeholder="Add new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-black"
        />
        <button
          onClick={handleAddTask}
          className="ml-2 bg-teal-400 text-white px-4 py-2 rounded-lg hover:bg-teal-500"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);

  const fetchTasks = useCallback(async () => {
    setIsFetchingTasks(true);
    try {
      const tasksData = await TaskService.getTasks();
      setTasks(tasksData || []);
    } catch (error: any) {
      toast.error("Erro ao carregar tarefas.");
    } finally {
      setIsFetchingTasks(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signIn");
    } else {
      fetchTasks();
    }
  }, [isAuthenticated, isLoading, fetchTasks, router]);

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await TaskService.toggleTask(taskId, completed);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, completed } : task))
      );
    } catch {
      toast.error("Erro ao atualizar a tarefa.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await TaskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch {
      toast.error("Erro ao excluir a tarefa.");
    }
  };

  const handleAddTask = async (title: string) => {
    try {
      const newTask = await TaskService.createTask(title);
      setTasks((prev) => [...prev, newTask]);
    } catch {
      toast.error("Erro ao adicionar tarefa.");
    }
  };

  if (isFetchingTasks) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#F0F4F3] min-h-screen flex flex-col items-center p-4 md:px-6 w-full max-w-screen-md mx-auto">
      <div className="flex h-auto items-center w-full md:max-w-lg">
        <ProfileSection
          userName={user?.name || "Guest"}
          profileImage="/default-profile.png"
        />
        <ClockSection
          greeting={
            new Date().getHours() < 12 ? "Good Morning" : "Good Afternoon"
          }
        />
      </div>
      <TaskList
        tasks={tasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
