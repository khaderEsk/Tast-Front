import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TaskList from "./pages/TaskList";
import AddTask from './pages/TaskForm'
import EditTask from './pages/EditTask'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/create" element={<AddTask />} />
        <Route path="tasks/edit/:id" element={<EditTask />} />
      </Routes>
    </BrowserRouter>
  );
}
