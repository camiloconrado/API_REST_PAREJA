const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

// Si no hay token → redirigir al login
if (!token) {
  alert("Debes iniciar sesión");
  window.location.href = "index.html";
}

// -------------------- CERRAR SESIÓN --------------------
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

// -------------------- OBTENER TAREAS --------------------
async function loadTasks() {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
  <strong class="task-title">${task.title}</strong> – ${task.description || ""}

  <button onclick="editTask('${task.id}', '${task.title.replace(/'/g, "\\'")}')">Editar</button>
  <button onclick="deleteTask('${task.id}')">Eliminar</button>
`;
    list.appendChild(li);
  });
}

loadTasks();

// -------------------- CREAR TAREA --------------------
document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;

  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title, description })
  });

  if (res.ok) {
    document.getElementById("taskForm").reset();
    loadTasks();
  } else {
    alert("Error creando tarea");
  }
});

// -------------------- ELIMINAR TAREA --------------------
async function deleteTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (res.ok) {
    loadTasks();
  } else {
    alert("Error eliminando tarea");
  }
}


// -------------------- EDITAR TAREA --------------------
async function editTask(id, oldTitle) {
  const newTitle = prompt("Editar tarea:", oldTitle);

  if (!newTitle || newTitle.trim() === "") return;

  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title: newTitle })
  });

  if (res.ok) {
    loadTasks();
  } else {
    alert("Error editando tarea");
  }
}

