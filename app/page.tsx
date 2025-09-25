"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	PlusCircle,
	Trash2,
	Moon,
	Sun,
	CheckSquare,
	Filter,
	XCircle,
} from "lucide-react";

export default function Home() {
	const [task, setTask] = useState("");
	const [todos, setTodos] = useState([]);
	const [darkMode, setDarkMode] = useState(false);
	const [filter, setFilter] = useState("all"); // all | active | completed

	// Load from localStorage on first render
	useEffect(() => {
		const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
		setTodos(savedTodos);
		const savedDark = localStorage.getItem("darkMode") === "true";
		setDarkMode(savedDark);
		document.documentElement.classList.toggle("dark", savedDark);
	}, []);

	// Save todos to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("todos", JSON.stringify(todos));
	}, [todos]);

	// Save dark mode preference
	useEffect(() => {
		localStorage.setItem("darkMode", darkMode);
		document.documentElement.classList.toggle("dark", darkMode);
	}, [darkMode]);

	const addTodo = (e) => {
		e.preventDefault();
		if (!task.trim()) return;
		setTodos([
			...todos,
			{ id: Date.now(), text: task.trim(), completed: false },
		]);
		setTask("");
	};

	const deleteTodo = (id) => {
		setTodos(todos.filter((t) => t.id !== id));
	};

	const toggleComplete = (id) => {
		setTodos(
			todos.map((t) =>
				t.id === id ? { ...t, completed: !t.completed } : t
			)
		);
	};

	const clearCompleted = () => {
		setTodos(todos.filter((t) => !t.completed));
	};

	const filteredTodos = todos.filter((t) => {
		if (filter === "active") return !t.completed;
		if (filter === "completed") return t.completed;
		return true;
	});

	const activeCount = todos.filter((t) => !t.completed).length;

	return (
		<div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-colors">
			{/* Header */}
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">✨ My Tasks</h1>
				<button
					onClick={() => setDarkMode(!darkMode)}
					className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:scale-105 transition-transform"
					title="Toggle Dark Mode"
				>
					{darkMode ? <Sun size={20} /> : <Moon size={20} />}
				</button>
			</div>

			{/* Add Task */}
			<form onSubmit={addTodo} className="flex gap-2 mb-6">
				<input
					type="text"
					placeholder="Add a new task..."
					className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
					value={task}
					onChange={(e) => setTask(e.target.value)}
				/>
				<button
					type="submit"
					className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 flex items-center gap-1 transition-transform hover:scale-105"
				>
					<PlusCircle size={20} /> Add
				</button>
			</form>

			{/* Filters & Clear Completed */}
			<div className="flex items-center justify-between mb-4 text-sm">
				<span className="text-gray-500 dark:text-gray-400">
					{activeCount} task{activeCount !== 1 ? "s" : ""} left
				</span>
				<div className="flex gap-2">
					<button
						onClick={() => setFilter("all")}
						className={`px-3 py-1 rounded-lg border transition-colors ${
							filter === "all"
								? "bg-blue-500 text-white border-blue-500"
								: "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
						}`}
					>
						All
					</button>
					<button
						onClick={() => setFilter("active")}
						className={`px-3 py-1 rounded-lg border transition-colors ${
							filter === "active"
								? "bg-blue-500 text-white border-blue-500"
								: "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
						}`}
					>
						Active
					</button>
					<button
						onClick={() => setFilter("completed")}
						className={`px-3 py-1 rounded-lg border transition-colors ${
							filter === "completed"
								? "bg-blue-500 text-white border-blue-500"
								: "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
						}`}
					>
						Completed
					</button>
				</div>
				<button
					onClick={clearCompleted}
					className="text-red-500 hover:text-red-600 flex items-center gap-1"
					title="Clear Completed"
				>
					<XCircle size={18} />
					Clear Completed Tasks
				</button>
			</div>

			{/* Todo List */}
			<ul className="space-y-3">
				<AnimatePresence>
					{filteredTodos.map((todo) => (
						<motion.li
							key={todo.id}
							layout
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, x: 50 }}
							className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-xl"
						>
							<div className="flex items-center gap-3">
								<input
									type="checkbox"
									checked={todo.completed}
									onChange={() => toggleComplete(todo.id)}
									className="w-5 h-5 accent-blue-500"
								/>
								<span
									className={`transition-all ${
										todo.completed
											? "line-through text-gray-400 dark:text-gray-400"
											: ""
									}`}
								>
									{todo.text}
								</span>
							</div>

							<button
								onClick={() => deleteTodo(todo.id)}
								className="text-red-500 hover:text-red-600"
							>
								<Trash2 size={20} />
							</button>
						</motion.li>
					))}
				</AnimatePresence>
			</ul>
		</div>
	);
}
