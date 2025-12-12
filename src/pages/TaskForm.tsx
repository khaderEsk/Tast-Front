import { useState } from "react";
import api from "../api/api";
import "../styles/form.css";

export default function CreateTask() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");

    const token = localStorage.getItem("token");

    const saveTask = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title) {
            alert("Title is required");
            return;
        }

        try {
            await api.post(
                "/create-task",
                { title, description, status },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("Task created successfully");
            window.location.href = "/tasks";
        } catch (err) {
            console.error(err);
            alert("Failed to create task");
        }
    };

    return (
        <div className="form-container">
            <form className="task-form" onSubmit={saveTask}>
                <h2>Create Task</h2>

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

                <button type="submit">Create Task</button>
            </form>
        </div>
    );
}
