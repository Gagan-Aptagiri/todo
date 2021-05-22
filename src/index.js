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
let todos = [];

//selectors
const root = document.querySelector('.todos');
const list = root.querySelector('.todos-list');
const form = document.forms.todos;
const input = form.elements.todo;

//functions
function renderTodos(todos) {
	let toDoString = '';
	todos.forEach((todo, index) => {
		toDoString += `
      <li data-id="${index}">
        <input type="checkbox">
        <span> ${todo.label} </span>
        <button type="button"></button>
      </li>
    `;
	});
	list.innerHTML = toDoString;
}

function addToDo(event) {
	event.preventDefault();
	const label = input.value.trim();
	const complete = false;
	todos = [...todos, { label, complete }];
	renderTodos(todos);
	input.value = '';
}

//init
function init() {
	form.addEventListener('submit', addToDo);
}

init();
