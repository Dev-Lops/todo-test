import { useAuth } from "../../contexts/AuthContext";
import ClockSection from "../../components/ClockSection";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { TaskService } from '../../services/taskService';
import { Task } from '../../types/task';

type TopBarProps = {
  time: string;
};

type ProfileSectionProps = {
  userName: string;
  profileImage: string;
};

type TaskItemProps = {
  task: Task;
  checked: boolean;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
};

type TaskListProps = {
  initialTasks: Task[];
};

const TopBar = ({ time }: TopBarProps) => {
  return (
    <div className="w-full bg-[#50C2C9] py-4 flex items-center justify-between px-6">
      <p className="text-white text-sm">{time}</p>
      <div className="flex items-center space-x-2">
        <button className="w-4 h-4 bg-white rounded-full text-[#50C2C9] justify-center items-center flex">
          <span className="text-[#50C2C9]">-</span>
        </button>
        <button className="w-4 h-4 bg-white rounded-full text-[#50C2C9] justify-center items-center flex">
          <span className="text-[#50C2C9]">x</span>
        </button>
      </div>
    </div>
  );
};

const ProfileSection = ({ userName, profileImage }: ProfileSectionProps) => {
  return (
    <div className="bg-[#50C2C9] w-full flex flex-col items-center p-6">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
        <Image
          src={profileImage || "/Ellipse.png"}
          alt="Profile Picture"
          width={96}
          height={96}
        />
      </div>
      <h1 className="text-white text-xl font-semibold mt-4 text-center">
        Welcome <br />{userName || "Guest"}
      </h1>
    </div>
  );
};

const TaskItem = ({ task, checked, onToggle, onDelete }: TaskItemProps) => {
  return (
    <li className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <div
          className={`w-5 h-5 flex items-center justify-center border-2 rounded cursor-pointer ${checked ? "border-black" : "border-gray-400"}`}
          onClick={() => onToggle(task.id)}
        >
          {checked && <div className="w-3 h-3 bg-teal-400"></div>}
        </div>
        <span className={`font-medium text-gray-800 ${checked ? "line-through text-gray-500" : ""}`}>
          {task.title}
        </span>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </li>
  );
};

const TaskList = ({ initialTasks }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks || []);
  const [newTask, setNewTask] = useState("");
  const taskService = TaskService.getInstance();

  const toggleTask = async (taskId: string) => {
    try {
      await taskService.toggleTask(taskId);
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const task = await taskService.createTask({
        title: newTask,
      });
      setTasks((prev) => [...prev, task]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="bg-white mt-4 rounded-lg shadow p-4 w-11/12">
      <h2 className="text-lg font-semibold mb-2 text-black">Task List</h2>
      <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
        <h3 className="font-medium mb-4 text-black">Daily Tasks</h3>
        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              checked={task.completed}
              onToggle={toggleTask}
              onDelete={deleteTask}
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
            onClick={addTask}
            className="ml-2 bg-teal-400 text-white px-4 py-2 rounded-lg hover:bg-teal-500"
          >
            Add
          </button>
        </div>
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
  const greeting = new Date().getHours() < 12 ? "Good Morning" : "Good Afternoon";

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    const fetchTasks = async () => {
      try {
        if (isAuthenticated && user) {
          const taskService = TaskService.getInstance();
          const tasksData = await taskService.getTasks();
          setTasks(tasksData);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="bg-[#F0F4F3] h-screen flex flex-col items-center py-4 w-[430px] mx-auto border border-[#50C2C9]">
      <TopBar time={time} />
      <ProfileSection
        userName={user.name}
        profileImage="/Ellipse.png"
      />
      <ClockSection greeting={greeting} />
      <TaskList initialTasks={tasks} />
    </div>
  );
}
