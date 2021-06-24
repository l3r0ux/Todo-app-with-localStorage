const addTodoForm = document.querySelector('#add-todo-list-form');
const showAddTodoForm = document.querySelector('#show-add-todo-list-form');


init();


// To show new todo list form
showAddTodoForm.addEventListener('click', () => {
    addTodoForm.classList.remove('hidden')
})

// To add a todo list to page or todo item to a specific list by pressing button or enter
window.addEventListener('submit', (e) => {
    e.preventDefault();

    if (e.target.id === 'add-list-form') {
        addTodoList();
        updateLS();
        e.target.reset();
    } else {
        addTodo(e);
        updateLS();
        e.target.reset();
    }
})

// Get clicked elements for todo item updating
let todo, todoText, controlContainer, completeTodo, deleteTodo, updateTodoText, updateTodoDate;
const updateDueDateContainer = document.querySelector('.update-due-date-container');
// All event listeners for todo list functionality must be delegated
window.addEventListener('click', (e) => {
    // on document click, if todoText is defined(user clicked on a todo previously), and the click wasnt on update due date button
    //  adjust that previous todo classes accordingly and save what was in the todo text
    if (todoText && !(e.target.className.includes('update-due-date'))) {
        completeTodo.classList.remove('hidden');
        deleteTodo.classList.remove('hidden');
        // And also make its update button hidden again
        updateTodoText.classList.add('hidden');
        updateTodoDate.classList.add('hidden');
        updateLS();
    }
    // If the click was on todo item text, set and save variables outside event listener to preserve them
    if (e.target.parentElement.classList.contains('due-date-passed') || e.target.parentElement.classList.contains('completed')) {
        return;
    } else {
        if ((e.target.classList.contains('text'))) {
            todoText = e.target.closest('span');
            controlContainer = e.target.closest('span').nextElementSibling;
            completeTodo = controlContainer.children[0];
            deleteTodo = controlContainer.children[1];
            updateTodoText = controlContainer.children[2];
            updateTodoDate = controlContainer.children[3];

            // If span is focussed, show update button
            if (todoText && todoText === document.activeElement) {
                completeTodo.classList.add('hidden');
                deleteTodo.classList.add('hidden');
                updateTodoText.classList.remove('hidden');
                updateTodoDate.classList.remove('hidden');
            } else {
                completeTodo.classList.remove('hidden');
                deleteTodo.classList.remove('hidden');
                updateTodoText.classList.add('hidden');
                updateTodoDate.classList.add('hidden');
            }
        }
    }

    let oldDueDate;
    let oldDueTime;
    let updatedDate;
    let updatedTime;
    // When click on update-date button
    if (e.target.className.includes('update-date')) {
        // Get associated todo
        todo = e.target.closest('.todo-item');
        // Get its previous input values if any to pre-populate update date inputs
        oldDueDate = todo.children[0].value;
        oldDueTime = todo.children[1].value;
        // Set update due date forms inputs to the old due date
        updatedDate = document.querySelector('.updated-date');
        updatedTime = document.querySelector('.updated-time');
        updatedDate.value = oldDueDate;
        updatedTime.value = oldDueTime;
        updateDueDateContainer.classList.add('visible');
    }
    if (e.target.classList.contains('submit-due-date-update')) {
        let updatedDate = document.querySelector('.updated-date');
        let updatedTime = document.querySelector('.updated-time');
        // Call function here to update todos remaining time
        setTimeLeftAndColor(todo, updatedDate.value, updatedTime.value);
        // Reset inputs
        updatedDate.value = '';
        updatedTime.value = '';
        // make form invisible again
        updateDueDateContainer.classList.remove('visible');
        // update localstorage with new due date
        updateLS();
    }
    if (e.target.classList.contains('update-due-date-container')) {
        updateDueDateContainer.classList.remove('visible');
    }
    if (e.target.classList.contains('clear-due-date')) {
        setTimeLeftAndColor(todo, null, null);
        todo.children[0].value = '';
        todo.children[1].value = '';
        updateDueDateContainer.classList.remove('visible');
        updateLS();
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