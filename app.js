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

// Get clicked elements for todo item updating
let todoText, controlContainer, completeTodo, deleteTodo, updateTodo;
// All event listeners for todo list functionality must be delegated
window.addEventListener('click', (e) => {
    // on document click, if todoText is defined(user clicked on a todo previously), adjust that previous todo classes accordingly
    // and save what was in the todo text
    if (todoText) {
        completeTodo.classList.remove('hidden');
        deleteTodo.classList.remove('hidden');
        // And also make its update button hidden again
        updateTodo.classList.add('hidden');
        updateLS();
    }
    // If the click was on todo item text, set and save variables outside event listener to preserve them
    if ((e.target.classList.contains('text'))) {
        todoText = e.target.closest('span');
        controlContainer = e.target.closest('span').nextElementSibling;
        completeTodo = controlContainer.children[0];
        deleteTodo = controlContainer.children[1];
        updateTodo = controlContainer.children[2];

        console.log(completeTodo, deleteTodo, updateTodo)

        // If span is focussed, show update button
    if (todoText && todoText === document.activeElement) {
        completeTodo.classList.add('hidden');
        deleteTodo.classList.add('hidden');
        updateTodo.classList.remove('hidden');
    } else {
        completeTodo.classList.remove('hidden');
        deleteTodo.classList.remove('hidden');
        updateTodo.classList.add('hidden');
    }
    }
    


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
        // hoverForDueDate();
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