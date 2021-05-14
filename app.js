const addTodoForm = document.querySelector('#add-todo-list-form');
const showAddTodoForm = document.querySelector('#show-add-todo-list-form');
const addNewTodoList = document.querySelector('#add-new-todo-list');

// On page load, render everything from localstorage
const todoLists = JSON.parse(localStorage.getItem('todolists'));
if (todoLists) {
    // for every todo list in local storage:
    todoLists.forEach((list) => {
        // make a todo list:
        addTodoList(list.id, list.zIndex, list.name, list.top, list.left, true);
        // and render all of that specific todo lists' todos into it
        list.todos.forEach((todoItem) => {
            addTodo(null, list.id, todoItem.completed, todoItem.innerText, todoItem.dueDate, todoItem.dueTime, true);
        })
    })
}


// To show new todo list form
showAddTodoForm.addEventListener('click', () => {
    addTodoForm.classList.remove('hidden')
})

// To add a new todo list
addNewTodoList.addEventListener('click', (e) => {
    addTodoList();
    updateLS();
});

// All event listeners for todo list functionality must be delegated
window.addEventListener('click', (e) => {
    // To close "add todo list" window
    if (e.target.id === 'add-todo-list-form') {
        addTodoForm.classList.add('hidden');
    }

    // To delete a todo list
    if (e.target.className.includes('delete-todolist')) {
        e.target.closest('section').classList.add('hidden');
        // Wait how the animnations duration before removing from DOM
        setTimeout(() => {
            e.target.closest('section').remove();
            updateLS();
        }, 800)

    }

    // To add a todo item to a specific list
    if (e.target.className === 'submit') {
        addTodo(e);
        updateLS();
    }

    // To check a todo item complete
    if (e.target.className.includes('check')) {
        e.target.closest('div').classList.toggle('completed');
        updateLS();
    }

    // To delete a todo item
    if (e.target.className.includes('remove')) {
        e.target.closest('div').classList.add('hidden');

        let timerId = setTimeout(() => {
            // remove and clear timeout
            e.target.closest('div').remove();
            updateLS();
            clearInterval(timerId);
        }, 200)
    }
})