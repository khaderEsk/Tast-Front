import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import "../styles/form.css"; 

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
}

export default function EditTask() {
    const { id } = useParams < { id: string } > ();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const loadTask = async () => {
            if (!id) return;

            try {
                const res = await api.get(`/tasks/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTitle(res.data.data.title);
                setDescription(res.data.data.description);
                setStatus(res.data.data.status);
            } catch (err) {
                console.error(err);
                alert("Failed to load task");
            }
        };

        loadTask();
    }, [id, token]);

    // إرسال التحديثات
    const updateTask = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title) {
            alert("Title is required");
            return;
        }

        try {
            await api.post(
                `/tasks/${id}`,
                { title, description, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Task updated successfully");
            window.location.href = "/tasks";
        } catch (err) {
            console.error(err);
            alert("Failed to update task");
        }
    };

    return (
        <div className="form-container">
            <form className="task-form" onSubmit={updateTask}>
                <h2>Edit Task</h2>

                <input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Task Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <label>Status:</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>

                <button type="submit">Update Task</button>
            </form>
        </div>
    );
}
