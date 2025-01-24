"use client";

import { useAuth } from "../../contexts/AuthContext";
import ClockSection from "../../components/ClockSection";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

import { Task } from "../../types/task";
import { TaskService } from "@/services/taskService";

type TopBarProps = {
  time: string;
};

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onAddTask: (title: string) => void;
}

type ProfileSectionProps = {
  userName: string;
  profileImage: string;
};

type TaskItemProps = {
  task: Task;
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
};

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

const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => (
  <li className="flex items-center justify-between mb-2">
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
);

const TaskList = ({
  tasks = [],
  onToggle,
  onDelete,
  onAddTask,
}: TaskListProps) => {
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (!newTask.trim()) return;
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
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
          />
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
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [time, setTime] = useState("00:00");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const greeting =
    new Date().getHours() < 12 ? "Good Morning" : "Good Afternoon";

  const fetchTasks = useCallback(async () => {
    try {
      const tasksData = await TaskService.getTasks();
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]); // Garante que tasks sempre será um array
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signIn");
      return;
    }
    fetchTasks();
  }, [isAuthenticated, fetchTasks, router]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await TaskService.toggleTask(taskId, completed);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed } : task
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await TaskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Erro ao excluir task:", error);
    }
  };

  const handleAddTask = async (title: string) => {
    try {
      if (!user || !user.id) {
        console.error("Usuário não autenticado.");
        return;
      }
      const newTask = await TaskService.createTask(title, user.id);
      setTasks((prev) => [...prev, newTask]);
    } catch (error) {
      console.error("Erro ao adicionar task:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#F0F4F3] min-h-screen flex flex-col items-center p-4 md:px-6 w-full max-w-screen-md mx-auto border border-[#50C2C9]">
      <div className=" flex h-auto items-center w-full md:max-w-lg">
        <ProfileSection
          userName={user?.name || "Guest"}
          profileImage="/default-profile.png"
        />
        <ClockSection greeting={greeting} />
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
