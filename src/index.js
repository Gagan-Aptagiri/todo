const app = document.getElementById('app');

app.innerHTML = `
  <div class="todos">
    <div class="todos-header">
      <h3 class="todos-title">Todo List</h3>
      <div>
        <p>You have <span class="todos-count"> </span> items</p>
        <button class="todos-clear" style="display:none;">
          Clear Completed
        </button>
      </div>
    </div>
    <form class="todos-form" name="todos">
      <input type="text" placeholder="What's next?" name="todo"/>
    </form>
    <ul class="todos-list"></ul>
  </div>
`;

//state
let todos = JSON.parse(localStorage.getItem('todos')) || [];

//selectors
const root = document.querySelector('.todos');
const list = root.querySelector('.todos-list');
const count = root.querySelector('.todos-count');
const clear = root.querySelector('.todos-clear');
const form = document.forms.todos;
const input = form.elements.todo;

//functions
function setLocalStorage(todos) {
	localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos(todos) {
	let toDoString = '';
	todos.forEach((todo, index) => {
		toDoString += `
      <li data-id="${index}"${todo.complete ? ' class="todos-complete"' : ''}>
        <input type="checkbox"${todo.complete ? ' checked' : ''}>
        <span> ${todo.label} </span>
        <button type="button"></button>
      </li>
    `;
	});
	list.innerHTML = toDoString;
	count.innerText = todos.filter((todo) => !todo.complete).length;
	clear.style.display = todos.filter((todo) => todo.complete).length
		? 'block'
		: 'none';
}

function addToDo(event) {
	event.preventDefault();
	const label = input.value.trim();
	const complete = false;
	todos = [...todos, { label, complete }];
	renderTodos(todos);
	setLocalStorage(todos);
	input.value = '';
}

function updateToDo(event) {
	const id = parseInt(event.target.parentNode.getAttribute('data-id'), 10);
	const complete = event.target.checked;
	todos = todos.map((todo, index) => {
		if (index === id) {
			return {
				...todo,
				complete,
			};
		}
		return todo;
	});
	renderTodos(todos);
	setLocalStorage(todos);
}

function editToDo(event) {
	if (event.target.nodeName.toLowerCase() !== 'span') {
		return;
	}
	const id = parseInt(event.target.parentNode.getAttribute('data-id'), 10);
	const todoLabel = todos[id].label;

	const input = document.createElement('input');
	input.type = 'text';
	input.value = todoLabel;

	function handleEdit() {
		event.stopPropagation();
		const label = this.value;
		if (label !== todoLabel) {
			todos = todos.map((todo, index) => {
				if (index === id) {
					return {
						...todo,
						label,
					};
				}
				return todo;
			});
			renderTodos(todos);
			setLocalStorage(todos);
		}
		//clean up
		event.target.style.display = '';
		this.removeEventListener('change', handleEdit);
		this.remove();
	}

	event.target.style.display = 'none';
	event.target.parentNode.append(input);
	input.addEventListener('change', handleEdit);
	input.focus();
}

function deleteToDo(event) {
	if (event.target.nodeName.toLowerCase() !== 'button') {
		return;
	}
	const id = parseInt(event.target.parentNode.getAttribute('data-id'), 10);
	const label = event.target.previousElementSibling.innerText;
	if (window.confirm(`Delete ${label}?`)) {
		todos = todos.filter((todo, index) => index !== id);
		renderTodos(todos);
		setLocalStorage(todos);
	}
}

function clearCompleteTodos() {
	const count = todos.filter((todo) => todo.complete).length;
	if (count === 0) {
		return;
	}
	if (window.confirm(`Delete ${count} todos?`)) {
		todos = todos.filter((todo) => !todo.complete);
		renderTodos(todos);
		setLocalStorage(todos);
	}
}

//init
function init() {
	renderTodos(todos);
	//Add todo
	form.addEventListener('submit', addToDo);
	//Update todo
	list.addEventListener('change', updateToDo);
	//Edit todo
	list.addEventListener('dblclick', editToDo);
	//Delete todo
	list.addEventListener('click', deleteToDo);
	//Clear complete todos
	clear.addEventListener('click', clearCompleteTodos);
}

init();
