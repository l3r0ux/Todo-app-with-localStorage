const addTodoForm = document.querySelector('#add-todo-list-form');
const showAddTodoForm = document.querySelector('#show-add-todo-list-form');
const addNewTodoList = document.querySelector('#add-new-todo-list');

// To show new todo list form
showAddTodoForm.addEventListener('click', () => {
    addTodoForm.classList.remove('hidden')
})

// To add a new todo list
addNewTodoList.addEventListener('click', (e) => {
    // To add a new todo list
    let todoListName = document.querySelector('#new-todo-list-input');
    if (!(todoListName.value)) {
        return todoListName.focus();
    }

    let todoList = document.createElement('section');
    // Random string to use as id's
    // convert random number into hexadecimals and use everything after the dot
    todoList.id = Math.random().toString(16).substring(2);
    todoList.classList.add('todo-list');
    todoList.classList.add('hidden');
    todoList.innerHTML = `
        <div class="todo-list-title">
            <span>${todoListName.value}</span>
        </div>

        <div class="add-todo">
            <div class="todo-text">
                <input class="input" type="text">
            </div>
            <div class="due-date">
                <label class="due-label">Due:</label>
                <input class="date" type="date">
                <input class="time" type="time">
            </div>
            <button class="submit" type="submit">Add</button>
        </div>
        
        <div class="todo-items"></div>
    `;

    addTodoForm.classList.add('hidden');
    todoListName.value = '';
    document.body.append(todoList);

    // Place it randomly within constraints of screen
    let randomX = Math.random() * (window.innerHeight - todoList.offsetHeight);
    let randomY = Math.random() * (window.innerWidth - todoList.offsetWidth);
    todoList.style.top = `${randomX}px`;
    todoList.style.left = `${randomY}px`;
    // Ensure it is always on top
    todoList.style.zIndex = 1;

    // wait until compute transitions
    requestAnimationFrame(() => {
        todoList.classList.remove('hidden');
    })
    // Make todo list draggable on creation
    draggable(todoList);
});

// All event listeners for todo list functionality must be delegated
window.addEventListener('click', (e) => {
    // To close "add todo list" window
    if (e.target.id === 'add-todo-list-form') {
        addTodoForm.classList.add('hidden');
    }

    // To add a todo item to a specific list
    if (e.target.className === 'submit') {
        console.dir(e.target)

        // Gives the todo items of specific clicked todo list 
        // let specificTodoList = document.getElementById(`${e.target.parentElement.parentElement.id}`);
        let specificTodoList = e.target.closest('section');
        // Get specific todo lists' inputs
        let todoItemText = specificTodoList.children[1].children[0].children[0];
        let todoItemDueDate = specificTodoList.children[1].children[1].children[1];
        let todoItemDueTime = specificTodoList.children[1].children[1].children[2];

        // Prevent adding if not todo was present, but allow if dates weren't added
        // If no date was added, give todo standard white transparent color
        // If date and time was added, compare that date and time to current, and assign background color accordingly
        if (!(todoItemText.value)) {
            return todoItemText.focus()
        }

        // Append a todo item
        let todoItemContainer = document.createElement('div');
        todoItemContainer.classList.add('todo-item');
        todoItemContainer.classList.add('hidden');
        todoItemContainer.innerHTML = `
            <input id="date" type="hidden" value="${todoItemDueDate.value}">
            <input id="time" type="hidden" value="${todoItemDueTime.value}">
            <span class="text">${todoItemText.value}</span>
            <span class="control-container">
                <span class="complete check"><i class="fas fa-check check"></i></span>
                <span class="delete remove"><i class="fas fa-trash remove"></i></span>
            </span>
        `;

        // Do time comparison and assign background colors
        if (todoItemDueDate.value && todoItemDueTime.value) {
            // Get current date
            let currentDate = new Date();
            console.log(currentDate.getTime())

            // Extract hours and minutes from time input
            let dueHours = parseFloat(todoItemDueTime.value.slice(0, 2))
            let dueMinutes = parseFloat(todoItemDueTime.value.slice(3, 5))

            // Get entered date in same format
            let tempDate = new Date(todoItemDueDate.value);
            tempDate.setHours(dueHours);
            tempDate.setMinutes(dueMinutes);
            console.log(tempDate.getTime())

            // difference between due date and current date in seconds
            let difference = (tempDate - currentDate) / 1000;
            console.log(difference);

            
        }

        specificTodoList.children[2].append(todoItemContainer);

        // wait until compute transitions
        requestAnimationFrame(() => {
            todoItemContainer.classList.remove('hidden');
        })

        // Reset inputs
        todoItemText.value = '';
        todoItemDueDate.value = '';
        todoItemDueTime.value = '';
    }

    // To check a todo item complete
    if (e.target.className.includes('check')) {
        e.target.closest('div').classList.toggle('completed');
    }

    // To delete a todo item
    if (e.target.className.includes('remove')) {
        e.target.closest('div').classList.add('hidden');

        let timerId = setTimeout(() => {
            // remove and clear timeout
            e.target.closest('div').remove();
            clearInterval(timerId);
        }, 200)
    }
})


// Make all existing Todo-Lists draggable when init page with localstorage data
document.querySelectorAll('.todo-list').forEach((list) => {
    draggable(list);
})