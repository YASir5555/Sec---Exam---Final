// ////// Columns Ul /////////////
const columns = [
  { title: 'Not Started', id: 'col1', tasks: [] },
  { title: 'In Progress', id: 'col2', tasks: [] },
  { title: 'Completed', id: 'col3', tasks: [] },
];

// ///// Link columns with buttons //////////

columns.forEach((column) => {
  const list = document.getElementById(`tasks${column.id.slice(-1)}`);
  const button = document.getElementById(`btn${column.id.slice(-1)}`);

  button.addEventListener('click', () => {
    // ///// Cretate the input
    const taskInput = document.createElement('input');
    taskInput.className = 'task-text';
    taskInput.type = 'text';

    // ////// Lock edit input after finish typing
    let timeoutId;
    taskInput.addEventListener('keyup', () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        taskInput.disabled = true;
      }, 2000);
    });

    // /////// Li in the Ul
    const taskLi = document.createElement('li');
    taskLi.className = 'task';
    taskLi.id = column.id;
    taskLi.draggable = true;
    taskLi.appendChild(taskInput);

    const iconArea = document.createElement('div');
    iconArea.className = 'icon-area';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-edit';
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-delete';

    iconArea.appendChild(editBtn);
    iconArea.appendChild(deleteBtn);

    const editIcon = document.createElement('i');
    editIcon.className = 'fa-regular fa-pen-to-square icon icon-edit';

    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fa-solid fa-trash icon icon-delete';

    editBtn.appendChild(editIcon);
    deleteBtn.appendChild(deleteIcon);

    taskLi.appendChild(iconArea);
    list.appendChild(taskLi);

    // ///////// Edit  And Remove Task   /////////

    // editBtn.addEventListener();

    editBtn.addEventListener('click', () => {
      taskInput.disabled = false;
      taskInput.focus();
    });

    deleteBtn.addEventListener('click', () => {
      taskLi.remove();
    });
  });
});

// ////////// Drag & Drop /////////////////

let columnsDrag = document.querySelectorAll('.list');
let drag = null;

const dragTask = () => {
  let tasks = document.querySelectorAll('.task');
  tasks.forEach((task) => {
    task.addEventListener('dragstart', () => {
      drag = task;
      task.style.opacity = '0.5';
    });
  });
  tasks.forEach((task) => {
    task.addEventListener('dragend', () => {
      drag = null;
      task.style.opacity = '1';
    });
    drag = task;
  });

  columnsDrag.forEach((col) => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    col.addEventListener('dragleave', () => {});
    col.addEventListener('drop', () => {
      const drag = document.querySelector('.task');

      col.append(drag);
    });
  });
};

dragTask();
