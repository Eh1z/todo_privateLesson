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
					<span class="text-sm text-gray-600 dark:text-gray-200">
						{{ taskList.length }} total
					</span>
					<span
						class="mx-2 h-4 border-l border-gray-300 dark:border-gray-600"
					/>
					<span class="text-sm text-gray-500 dark:text-gray-300">
						{{ activeTasksCount }} active
					</span>
					<span class="text-sm text-gray-400 ml-3 hidden sm:inline">
						• {{ completedTasksCount }} done
					</span>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<input
					placeholder="Search tasks..."
					v-model="searchText"
					class="px-3 py-2 w-56 bg-white dark:bg-gray-700 border rounded-lg focus:outline-none"
				/>
				<select
					v-model="sortMode"
					class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
				>
					<option value="created">Newest</option>
					<option value="priority">Priority</option>
				</select>
				<button
					@click="toggleDarkMode"
					class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:scale-105 transition-transform"
				>
					<span v-if="darkModeOn">☀️</span>
					<span v-else>🌙</span>
				</button>
			</div>
		</div>

		<!-- Add -->
		<form @submit.prevent="addTask" class="flex gap-2 mb-4">
			<input
				type="text"
				placeholder="Add a new task and press Enter..."
				v-model="newTaskText"
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
					@click="filterStatus = f"
					:class="[
						'px-3 py-1 rounded-lg border transition-colors',
						filterStatus === f
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

		<!-- List with drag & drop -->
		<Draggable
			v-model="taskList"
			item-key="id"
			:animation="200"
			class="space-y-3"
		>
			<template #item="{ element: todo }">
				<li
					class="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-xl cursor-move"
					v-if="visibleTasks.find((t) => t.id === todo.id)"
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
							>
								{{ todo.text }}
							</span>
							<span
								class="text-xs px-2 py-0.5 rounded-full"
								:class="priorityColors[todo.priority]"
							>
								{{ todo.priority }}
							</span>
						</div>
					</div>
					<button
						@click="deleteTask(todo.id)"
						class="text-red-500 hover:text-red-600"
					>
						🗑️
					</button>
				</li>
			</template>
		</Draggable>

		<!-- Footer -->
		<div
			class="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-300"
		>
			<div>
				{{ activeTasksCount }} active •
				{{ completedTasksCount }} completed
			</div>
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
import Draggable from "vuedraggable";

const newTaskText = ref("");
const taskList = ref([]);
const darkModeOn = ref(false);
const filterStatus = ref("all");
const searchText = ref("");
const sortMode = ref("created");

const priorityColors = {
	low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
	medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
	high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const uid = () => Date.now() + "-" + Math.floor(Math.random() * 10000);

onMounted(() => {
	const saved = JSON.parse(localStorage.getItem("taskList") || "[]");
	taskList.value = saved;
	darkModeOn.value = localStorage.getItem("darkModeOn") === "true";
	document.documentElement.classList.toggle("dark", darkModeOn.value);
});

watch(taskList, (v) => localStorage.setItem("taskList", JSON.stringify(v)), {
	deep: true,
});
watch(darkModeOn, (v) => {
	localStorage.setItem("darkModeOn", v);
	document.documentElement.classList.toggle("dark", v);
});

function addTask() {
	if (!newTaskText.value.trim()) return;
	taskList.value.unshift({
		id: uid(),
		text: newTaskText.value.trim(),
		completed: false,
		createdAt: new Date().toISOString(),
		priority: "medium",
	});
	newTaskText.value = "";
}
function deleteTask(id) {
	taskList.value = taskList.value.filter((t) => t.id !== id);
}
function clearCompleted() {
	taskList.value = taskList.value.filter((t) => !t.completed);
}
function toggleDarkMode() {
	darkModeOn.value = !darkModeOn.value;
}
function toggleAll() {
	const allDone = taskList.value.every((t) => t.completed);
	taskList.value = taskList.value.map((t) => ({ ...t, completed: !allDone }));
}

const filteredTasks = computed(() => {
	return taskList.value.filter((t) => {
		if (filterStatus.value === "active" && t.completed) return false;
		if (filterStatus.value === "completed" && !t.completed) return false;
		if (
			searchText.value &&
			!t.text.toLowerCase().includes(searchText.value.toLowerCase())
		)
			return false;
		return true;
	});
});
const visibleTasks = computed(() => {
	let arr = [...filteredTasks.value];
	if (sortMode.value === "priority") {
		const order = { high: 0, medium: 1, low: 2 };
		arr.sort((a, b) => order[a.priority] - order[b.priority]);
	} else {
		arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	}
	return arr;
});
const activeTasksCount = computed(
	() => taskList.value.filter((t) => !t.completed).length
);
const completedTasksCount = computed(
	() => taskList.value.filter((t) => t.completed).length
);
</script>
