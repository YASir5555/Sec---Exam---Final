// Define the columns
const columns = [
  { title: 'Not Started', id: 'col1', tasks: [] },
  { title: 'In Progress', id: 'col2', tasks: [] },
  { title: 'Completed', id: 'col3', tasks: [] },
];

// Add the columns to the page
function addColumns() {
  const board = document.getElementById('board');
  columns.forEach((column) => {
    const col = createColumn(column);
    board.appendChild(col);
  });
}

// Create a column element
function createColumn(column) {
  const col = document.createElement('div');
  col.className = 'column';
  col.id = column.id;

  const colHeader = createColumnHeader(column);
  col.appendChild(colHeader);

  const taskList = createTaskList(column);
  col.appendChild(taskList);

  return col;
}

// Create a column header element
function createColumnHeader(column) {
  const colHeader = document.createElement('div');
  colHeader.className = 'column-header';
  colHeader.textContent = column.title;

  return colHeader;
}

// Create a task list element
function createTaskList(column) {
  const taskList = document.createElement('ul');
  taskList.className = 'task-list';
  taskList.id = `tasks${column.id.slice(-1)}`;

  const addTaskBtn = createAddTaskButton(column);
  taskList.appendChild(addTaskBtn);

  return taskList;
}

// Create an add task button element for a column
function createAddTaskButton(column) {
  const addTaskBtn = document.createElement('button');
  addTaskBtn.className = 'btn btn-add';
  addTaskBtn.textContent = 'Add Task';

  addTaskBtn.addEventListener('click', () => {
    const taskTitle = prompt('Enter task title:');
    if (taskTitle) {
      const newTask = { id: uuidv4(), title: taskTitle };
      addTask(column, newTask);
    }
  });

  return addTaskBtn;
}

// Add a task to the column
function addTask(column, task) {
  const list = document.getElementById(`tasks${column.id.slice(-1)}`);
  const taskLi = createTaskLi(column, task);
  list.appendChild(taskLi);
}

// Create a task list item element
function createTaskLi(column, task) {
  const taskLi = document.createElement('li');
  taskLi.className = 'task-area';
  taskLi.id = task.id;
  taskLi.draggable = true;
  taskLi.appendChild(createTaskInput(task));

  const iconArea = createIconArea(taskLi);
  taskLi.appendChild(iconArea);

  return taskLi;
}

// Create a task input element
function createTaskInput(task) {
  const taskInput = document.createElement('input');
  taskInput.className = 'task-text';
  taskInput.type = 'text';
  taskInput.value = task.title;

  let timeoutId;
  taskInput.addEventListener('keyup', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      taskInput.disabled = true;
    }, 2000);
  });

  taskInput.addEventListener('dblclick', () => {
    taskInput.disabled = false;
    taskInput.focus();
  });

  return taskInput;
}

function createIconArea(taskLi) {
  const iconArea = document.createElement('div');
  iconArea.className = 'icon-area';

  const editBtn = createEditButton(taskLi);
  const deleteBtn = createDeleteButton(taskLi);

  iconArea.appendChild(editBtn);
  iconArea.appendChild(deleteBtn);

  return iconArea;
}

// Create an edit button element for a task list item
function createEditButton(taskLi) {
  const editBtn = document.createElement('button');
  editBtn.className = 'btn btn-edit';

  const editIcon = document.createElement('i');
  editIcon.className = 'fa-regular fa-pen-to-square icon icon-edit';
  editBtn.appendChild(editIcon);

  editBtn.addEventListener('click', () => {
    const taskInput = taskLi.querySelector('.task-text');
    taskInput.disabled = false;
    taskInput.focus();
  });

  return editBtn;
}

// Create a delete button element for a task list item
function createDeleteButton(taskLi) {
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-delete';

  const deleteIcon = document.createElement('i');
  deleteIcon.className = 'fa-solid fa-trash icon icon-delete';
  deleteBtn.appendChild(deleteIcon);

  deleteBtn.addEventListener('click', () => {
    taskLi.remove();
  });

  return deleteBtn;
}

// Set up drag and drop for columns and tasks
function setupDragAndDrop() {
  const cols = document.querySelectorAll('.column');
  let task;

  cols.forEach((col) => {
    col.addEventListener('dragover', (event) => {
      event.preventDefault();
      col.classList.add('drag-over');
    });

    col.addEventListener('dragenter', (event) => {
      event.preventDefault();
    });

    col.addEventListener('dragleave', () => {
      col.classList.remove('drag-over');
    });

    col.addEventListener('drop', (event) => {
      event.preventDefault();
      const id = event.dataTransfer.getData('text/plain');
      task = document.getElementById(id);
      col.appendChild(task);
      col.classList.remove('drag-over');
      updateTaskStatus(task.id, col.id);
    });
  });

  const tasks = document.querySelectorAll('.task-area');

  tasks.forEach((task) => {
    task.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', event.target.id);
    });
  });
}

// Update the status of a task
function updateTaskStatus(taskId, columnId) {
  const task = findTask(taskId);
  const column = findColumn(columnId);

  // Remove the task from its current column
  const currentColumn = findColumnForTask(task);
  currentColumn.tasks = currentColumn.tasks.filter((t) => t.id !== taskId);

  // Add the task to the new column
  column.tasks.push(task);

  // Update the task's status in the tasks array
  task.status = column.title;

  // Update the task's status in local storage
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Find a task by ID
function findTask(taskId) {
  return tasks.find((task) => task.id === taskId);
}

// Find a column by ID
function findColumn(columnId) {
  return columns.find((col) => col.id === columnId);
}

// Find the column that a task belongs to
function findColumnForTask(task) {
  return columns.find((col) => col.tasks.includes(task));
}

// Load the tasks from local storage
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    tasks.forEach((task) => {
      const column = findColumn(task.status);
      column.tasks.push(task);
      addTask(column, task);
    });
  }
}

// Initialize the app
function init() {
  loadTasks();
  setupDragAndDrop();
  document
    .getElementById('add-task-form')
    .addEventListener('submit', (event) => {
      event.preventDefault();
      const input = event.target.elements['task-input'];
      const task = {
        title: input.value,
        id: generateId(),
        status: 'Not Started',
      };
      tasks.push(task);
      const column = findColumn('col1');
      column.tasks.push(task);
      addTask(column, task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      input.value = '';
    });
}

init();
