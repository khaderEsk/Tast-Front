import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/tasks.css";

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export default function TaskList() {
    const [tasks, setTasks] = useState < Task[] > ([]);

    const loadTasks = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await api.get("/tasks", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTask = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        const token = localStorage.getItem("token");
        try {
            await api.delete(`/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            loadTasks();
        } catch (err) {
            console.error(err);
            alert("Failed to delete task");
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    return (
        <div className="task-container">
            <h2>Your Tasks</h2>

            <a href="/tasks/create" className="add-btn">
                + Add Task
            </a>

            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task.id} className="task-item">
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p className="status">{task.status}</p>
                        <p>
                            <strong>Added by:</strong> {task.user.name}
                        </p>
                        <div className="task-actions">
                            <a href={`/tasks/edit/${task.id}`} className="edit">
                                Edit
                            </a>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="delete"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
