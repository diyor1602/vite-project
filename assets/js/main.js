import { v4 as uuidv4 } from "uuid";

document.addEventListener("DOMContentLoaded", function () {
  let selectedTaskId;

  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  const alertSection = document.getElementById("alertSection");
  const editTaskModal = new bootstrap.Modal(
    document.getElementById("editTaskModal")
  );

  // Load tasks from local storage on page load
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  renderTasks();

  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskValue = taskInput.value.trim();

    if (taskValue !== "") {
      const newTask = {
        id: uuidv4(),
        text: taskValue,
      };

      tasks.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
      taskInput.value = "";
      showAlert("Task added successfully!", "success");
    } else {
      showAlert("Please enter a task.", "danger");
    }
  });

  document
    .getElementById("saveEditedTask")
    .addEventListener("click", saveEditedTask);

  // Additional event listener for "Enter" key press in the modal input
  document
    .getElementById("editedTaskInput")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        saveEditedTask();
      } else if (event.key === "Escape") {
        editTaskModal.hide();
      }
    });

  function saveEditedTask() {
    const editedTaskValue = document
      .getElementById("editedTaskInput")
      .value.trim();

    if (editedTaskValue !== "") {
      const editedTaskIndex = tasks.findIndex(
        (task) => task.id === selectedTaskId
      );

      if (editedTaskIndex !== -1) {
        tasks[editedTaskIndex].text = editedTaskValue;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
        editTaskModal.hide();
      }
    } else {
      showAlert("Please enter a task.", "danger");
    }
  }

  // Render tasks function
  function renderTasks() {
    taskList.innerHTML = ""; // Clear the existing task list

    tasks.forEach((task) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";

      const taskText = document.createElement("span");
      taskText.textContent = task.text;

      const editButton = document.createElement("button");
      editButton.className = "btn btn-secondary";
      editButton.textContent = "Edit";

      const deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-danger";
      deleteButton.textContent = "Delete";

      editButton.addEventListener("click", function () {
        // Open the edit task modal
        editTaskModal.show();

        // Set the current task text to the modal input
        document.getElementById("editedTaskInput").value = task.text;

        // Set the selected task ID for reference
        selectedTaskId = task.id;
      });

      deleteButton.addEventListener("click", function () {
        // Remove the task from the tasks array
        tasks = tasks.filter((t) => t.id !== task.id);

        // Save tasks to local storage
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // Render the tasks
        renderTasks();

        showAlert("Task deleted successfully!", "success");
      });

      const listBtns = document.createElement("div");
      listBtns.className = "list-btns";
      listBtns.appendChild(editButton);
      listBtns.appendChild(deleteButton);

      listItem.appendChild(taskText);
      listItem.appendChild(listBtns);

      taskList.appendChild(listItem);
    });
  }

  function showAlert(message, type) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.textContent = message;

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "btn-close";
    closeBtn.setAttribute("data-bs-dismiss", "alert");
    alertDiv.appendChild(closeBtn);

    alertSection.innerHTML = "";
    alertSection.appendChild(alertDiv);
  }
});
