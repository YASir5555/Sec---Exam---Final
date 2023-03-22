// // ////////////////////////// Drag & Drop //////////////////////////
// const lists = document.querySelectorAll('.list');
// let allTasks = document.querySelectorAll('.task');
// let draggableTodo = null;

// allTasks.forEach((task) => {
//   task.addEventListener('dragstart', dragStart);
//   task.addEventListener('dragend', dragEnd);
// });

// lists.forEach((list) => {
//   list.addEventListener('dragover', dragOver);
//   list.addEventListener('dragenter', dragEnter);
//   list.addEventListener('dragleave', dragLeave);
//   list.addEventListener('drop', dragDrop);
// });

// console.log(allTasks);
// function dragStart(e) {
//   draggableTodo = e.target;
// }
// function dragEnd(e) {
//   e.preventDefault();
// }
// function dragOver(e) {
//   e.preventDefault();
// }
// function dragEnter(e) {
//   e.preventDefault();
// }
// function dragLeave(e) {
//   e.preventDefault();
// }
// function dragDrop() {
//   lists.appendChild(draggableTodo);
// }

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

// ////// Columns Ul /////////////
const columns = [
  { title: 'Not Started', id: 'col1' },
  { title: 'In Progress', id: 'col2' },
  { title: 'Completed', id: 'col3' },
];

// ///// Link columns with buttons //////////

const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');

btn1.dataset.columnId = columns[0].id;
btn2.dataset.columnId = columns[1].id;
btn3.dataset.columnId = columns[2].id;

// Click
btn1.addEventListener('click', handleButtonClick);
btn2.addEventListener('click', handleButtonClick);
btn3.addEventListener('click', handleButtonClick);

// Event
function handleButtonClick(event) {
  const columnId = event.target.dataset.columnId;
  const column = columns.find((col) => col.id === columnId);
  const list = document.getElementById(`tasks${column.id.slice(-1)}`);

  // ///// Create the input

  const taskInput = document.createElement('input');
  taskInput.classList.add('task-input');
  taskInput.type = 'text';

  // ////// Lock edit input after finish typing
  let timeoutId;
  taskInput.addEventListener('keyup', () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      taskInput.disabled = true;
    }, 1750);
  });

  const taskLi = document.createElement('li');
  taskLi.classList.add('task');
  taskLi.id = column.id;
  taskLi.draggable = true;
  taskLi.appendChild(taskInput);

  const iconArea = document.createElement('div');
  iconArea.className = 'icon-area';

  const editBtn = document.createElement('button');
  editBtn.className = 'btn btn-edit';
  editBtn.id = 'edit';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-delete';
  deleteBtn.id = 'delete';

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

  // ////////////////////////////////////////////////////////

  editBtn.addEventListener('click', () => {
    taskInput.disabled = false;
    taskInput.focus();
  });

  deleteBtn.addEventListener('click', () => {
    taskLi.remove();
  });

  console.log(column);
}

// //////////////////////
