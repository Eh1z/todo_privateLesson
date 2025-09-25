<!-- src/components/TodoApp.vue -->
<template>
	<div
		class="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-colors"
	>
		<!-- Header -->
		<div
			class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4"
		>
			<div class="flex items-center gap-4">
				<h1 class="text-2xl font-bold">✨ My Tasks</h1>
				<div
					class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
				>
					<span class="text-sm text-gray-600 dark:text-gray-200"
						>{{ todos.length }} total</span
					>
					<span
						class="mx-2 h-4 border-l border-gray-300 dark:border-gray-600"
					/>
					<span class="text-sm text-gray-500 dark:text-gray-300"
						>{{ activeCount }} active</span
					>
					<span class="text-sm text-gray-400 ml-3 hidden sm:inline"
						>• {{ completedCount }} done</span
					>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<input
					placeholder="Search tasks..."
					v-model="search"
					class="px-3 py-2 w-56 bg-white dark:bg-gray-700 border rounded-lg focus:outline-none"
				/>
				<select
					v-model="sortBy"
					class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
				>
					<option value="created">Newest</option>
					<option value="priority">Priority</option>
				</select>
				<button
					@click="toggleDark"
					class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:scale-105 transition-transform"
				>
					<span v-if="darkMode">☀️</span>
					<span v-else>🌙</span>
				</button>
			</div>
		</div>

		<!-- Add -->
		<form @submit.prevent="addTodo" class="flex gap-2 mb-4">
			<input
				type="text"
				placeholder="Add a new task and press Enter..."
				v-model="task"
				class="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
			/>
			<button
				type="submit"
				class="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-4 py-2 flex items-center gap-2 transition-transform hover:scale-105"
			>
				➕ Add
			</button>
		</form>

		<!-- Filters -->
		<div class="flex items-center justify-between mb-4 gap-3">
			<div class="flex gap-2">
				<button
					v-for="f in ['all', 'active', 'completed']"
					:key="f"
					@click="filter = f"
					:class="[
						'px-3 py-1 rounded-lg border transition-colors',
						filter === f
							? 'bg-blue-500 text-white border-blue-500'
							: 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300',
					]"
				>
					{{ f[0].toUpperCase() + f.slice(1) }}
				</button>
			</div>

			<button
				@click="clearCompleted"
				class="text-red-500 hover:text-red-600 flex items-center gap-1"
			>
				❌ Clear Completed
			</button>
		</div>

		<!-- List -->
		<ul class="space-y-3">
			<li
				v-for="todo in visible"
				:key="todo.id"
				class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-xl"
			>
				<div class="flex items-center gap-3 w-full">
					<input
						type="checkbox"
						v-model="todo.completed"
						class="w-5 h-5 accent-blue-500"
					/>
					<div
						class="flex-1 min-w-0 flex items-center justify-between gap-2"
					>
						<span
							:class="
								todo.completed
									? 'line-through text-gray-400'
									: ''
							"
							>{{ todo.text }}</span
						>
						<span
							class="text-xs px-2 py-0.5 rounded-full"
							:class="priorityClasses[todo.priority]"
						>
							{{ todo.priority }}
						</span>
					</div>
				</div>
				<button
					@click="deleteTodo(todo.id)"
					class="text-red-500 hover:text-red-600"
				>
					🗑️
				</button>
			</li>
		</ul>

		<!-- Footer -->
		<div
			class="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-300"
		>
			<div>{{ activeCount }} active • {{ completedCount }} completed</div>
			<button
				@click="toggleAll"
				class="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700"
			>
				Toggle All
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

const uid = () => Date.now() + "-" + Math.floor(Math.random() * 10000);

const task = ref("");
const todos = ref([]);
const darkMode = ref(false);
const filter = ref("all");
const search = ref("");
const sortBy = ref("created");

const priorityClasses = {
	low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
	medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
	high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

onMounted(() => {
	const saved = JSON.parse(localStorage.getItem("todos") || "[]");
	todos.value = saved;
	darkMode.value = localStorage.getItem("darkMode") === "true";
	document.documentElement.classList.toggle("dark", darkMode.value);
});

watch(todos, (v) => localStorage.setItem("todos", JSON.stringify(v)), {
	deep: true,
});
watch(darkMode, (v) => {
	localStorage.setItem("darkMode", v);
	document.documentElement.classList.toggle("dark", v);
});

function addTodo() {
	if (!task.value.trim()) return;
	todos.value.unshift({
		id: uid(),
		text: task.value.trim(),
		completed: false,
		createdAt: new Date().toISOString(),
		priority: "medium",
	});
	task.value = "";
}
function deleteTodo(id) {
	todos.value = todos.value.filter((t) => t.id !== id);
}
function clearCompleted() {
	todos.value = todos.value.filter((t) => !t.completed);
}
function toggleDark() {
	darkMode.value = !darkMode.value;
}
function toggleAll() {
	const allCompleted = todos.value.every((t) => t.completed);
	todos.value = todos.value.map((t) => ({ ...t, completed: !allCompleted }));
}

const filtered = computed(() => {
	return todos.value.filter((t) => {
		if (filter.value === "active" && t.completed) return false;
		if (filter.value === "completed" && !t.completed) return false;
		if (
			search.value &&
			!t.text.toLowerCase().includes(search.value.toLowerCase())
		)
			return false;
		return true;
	});
});
const visible = computed(() => {
	let arr = [...filtered.value];
	if (sortBy.value === "priority") {
		const order = { high: 0, medium: 1, low: 2 };
		arr.sort((a, b) => order[a.priority] - order[b.priority]);
	} else {
		arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	}
	return arr;
});
const activeCount = computed(
	() => todos.value.filter((t) => !t.completed).length
);
const completedCount = computed(
	() => todos.value.filter((t) => t.completed).length
);
</script>
