const addTodoForm = document.querySelector('#add-todo-list-form');
const showAddTodoForm = document.querySelector('#show-add-todo-list-form');
const addNewTodoList = document.querySelector('#add-new-todo-list');


init();


// To show new todo list form
showAddTodoForm.addEventListener('click', () => {
    addTodoForm.classList.remove('hidden')
})

// To add a new todo list by clicking button
addNewTodoList.addEventListener('click', (e) => {
    addTodoList();
    updateLS();
});
// and by pressing enter
window.addEventListener('keydown', (e) => {
    // Check to see that enter was pressed and that the add todo form is on screen
    if (e.key === 'Enter' && (!(addTodoForm.classList.contains('hidden')))) {
        addTodoList();
        updateLS();
    }
})

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

    // To expand or minimize the todo adding form
    if (e.target.className.includes('expand-form')) {
        e.target.closest('i').classList.toggle('form-expanded');
        e.target.offsetParent.children[1].classList.toggle('form-expanded');
        updateLS();
    }

    // To expand and minimize todos
    if (e.target.className.includes('expand-todos')) {
        e.target.closest('i').classList.toggle('todos-expanded');
        e.target.offsetParent.children[3].classList.toggle('todos-expanded');
        updateLS();
    }

    // To add a todo item to a specific list by pressing button
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