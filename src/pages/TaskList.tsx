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
    const [tasks, setTasks] = useState<Task[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [perPage] = useState<number>(5); // عدد المهام لكل صفحة
    const [totalPages, setTotalPages] = useState<number>(1);

    const token = localStorage.getItem("token");

    // جلب المهام مع Pagination و Filtering
    const loadTasks = async () => {
        try {
            const res = await api.get("/tasks", {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page: currentPage,
                    status: statusFilter !== "all" ? statusFilter : undefined,
                },
            });

            setTasks(res.data.data); // البيانات حسب API
            setTotalPages(res.data.last_page || 1); // اجعل API يعيد last_page
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTask = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

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
    }, [currentPage, statusFilter]);

    // تغيير الصفحة
    const changePage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="task-container">
            <h2>Your Tasks</h2>

            {/* Filter by Status */}
            <div className="filter">
                <label>Filter by status: </label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

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

            {/* Pagination */}
            <div className="pagination">
                <button onClick={() => changePage(currentPage - 1)}>Prev</button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={() => changePage(currentPage + 1)}>Next</button>
            </div>
        </div>
    );
}
