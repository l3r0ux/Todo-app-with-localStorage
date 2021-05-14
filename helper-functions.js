// Function to add a new todo list
function addTodoList(id = null, zIndex = null, name = null, top = null, left = null, init = false) {
    let todoListName;
    if (!(init)) {
        console.log('not init')
        // To add a new todo list
        todoListName = document.querySelector('#new-todo-list-input');
        if (!(todoListName.value)) {
            return todoListName.focus();
        }
    }

    let todoListContainer = document.createElement('section');
    // if is initial load, use the id that came from localStorage
    if (init) {
        todoListContainer.id = id;
    } else {
        // else make random string to use as id's
        // convert random number into hexadecimals and use everything after the dot
        todoListContainer.id = Math.random().toString(16).substring(2);
    }
    todoListContainer.classList.add('todo-list');
    todoListContainer.classList.add('hidden');
    // add in correct z-index if init is true
    todoListContainer.style.zIndex = zIndex;
    todoListContainer.innerHTML = `
        <div class="todo-list-title">
            <div class="delete-todolist-button delete-todolist"><i class="fas fa-trash delete-todolist"></i></div>
            <span>${init ? name : todoListName.value}</span>
        </div>

        <div class="add-todo">
            <div class="todo-text">
                <input class="input" type="text" placeholder="Enter your todo">
            </div>
            <div class="due-date">
                <label class="due-label">Due(optional):</label>
                <input class="date" type="date">
                <input class="time" type="time">
            </div>
            <button class="submit" type="submit">Add</button>
        </div>
        
        <div class="todo-items"></div>
    `;

    addTodoForm.classList.add('hidden');
    // if not init, reset input of todo list add form
    if (!(init)) {
        todoListName.value = '';
    }
    document.body.append(todoListContainer);

    // if is init, use left and top position from local storage
    // else generate new random position
    if (init) {
        todoListContainer.style.left = left;
        todoListContainer.style.top = top;
    } else {
        // Place it randomly within constraints of screen
        let randomY = Math.random() * (window.innerHeight - todoListContainer.offsetHeight);
        let randomX = Math.random() * (window.innerWidth - todoListContainer.offsetWidth);
        todoListContainer.style.left = `${randomX}px`;
        todoListContainer.style.top = `${randomY}px`;
    }

    // only ensure its on top if add a new todo list/init is false/its not the inital page load
    if (!(init)) {
        // Ensure it is always on top
        todoListContainer.style.zIndex = 1;
    }

    // wait until compute transitions
    requestAnimationFrame(() => {
        todoListContainer.classList.remove('hidden');
    })
    // Timeout so that function draggable uses the final coordinates after animation
    setTimeout(() => {
        // Make specific todo draggable
        draggable(todoListContainer);
    }, 800)
}


// To add a todo item
function addTodo(e = null, listId = null, completed = null, text = null, dueDate = null, dueTime = null, init = false) {
    let specificTodoList;
    let todoItemText;
    let todoItemDueDate;
    let todoItemDueTime;

    // Assign Different variables depending on if init is true or false
    // If true, assign the variables with the values from localStorage
    // If false, assign variables with values of inputs
    if (!(init)) {
        // Gives the todo items of specific clicked todo list 
        // let specificTodoList = document.getElementById(`${e.target.parentElement.parentElement.id}`);
        specificTodoList = e.target.closest('section');
        // Get specific todo lists' inputs
        todoItemText = specificTodoList.children[1].children[0].children[0].value;
        todoItemDueDate = specificTodoList.children[1].children[1].children[1].value;
        todoItemDueTime = specificTodoList.children[1].children[1].children[2].value;
    } else {
        specificTodoList = document.getElementById(listId);
        todoItemText = text;
        todoItemDueDate = dueDate;
        todoItemDueTime = dueTime;
    }

    if (!(init)) {
        // Prevent adding if not todo was present, but allow if dates weren't added
        // If no date was added, give todo standard white transparent color
        // If date and time was added, compare that date and time to current, and assign background color accordingly
        if (!(todoItemText)) {
            return specificTodoList.children[1].children[0].children[0].focus()
        }
    }

    // Append a todo item
    let todoItemContainer = document.createElement('div');
    todoItemContainer.classList.add('todo-item');
    todoItemContainer.classList.add('hidden');
    completed ? todoItemContainer.classList.add('completed') : '';
    todoItemContainer.innerHTML = `
        <input id="date" type="hidden" value="${todoItemDueDate}">
        <input id="time" type="hidden" value="${todoItemDueTime}">
        <span class="text">${todoItemText}</span>
        <span class="control-container">
            <span class="complete check"><i class="fas fa-check check"></i></span>
            <span class="delete remove"><i class="fas fa-trash remove"></i></span>
        </span>
    `;

    if (todoItemDueDate && todoItemDueTime) {
        // Extract hours and minutes from time input here outside calcTimeLeftAndColor -
        // Because the due date will stay the same
        // calculate the currentDate inside calcTimeLeftAndColor becuase it will change on each calculation
        let dueHours = parseFloat(todoItemDueTime.slice(0, 2))
        let dueMinutes = parseFloat(todoItemDueTime.slice(3, 5))

        // Get entered date in same format
        let dueDate = new Date(todoItemDueDate);
        dueDate.setHours(dueHours);
        dueDate.setMinutes(dueMinutes);

        calcTimeLeftAndColor(todoItemContainer, dueDate);

        // Calculate on an interval so that colors can change live
        let intervalId = setInterval(() => {
            calcTimeLeftAndColor(todoItemContainer, dueDate, intervalId);
        }, 1000)
    }

    specificTodoList.children[2].append(todoItemContainer);

    // wait until compute transitions
    requestAnimationFrame(() => {
        todoItemContainer.classList.remove('hidden');
    })

    if (!(init)) {
        specificTodoList.children[1].children[0].children[0].value = '';
        specificTodoList.children[1].children[1].children[1].value = '';
        specificTodoList.children[1].children[1].children[2].value = '';
    }
}


// Function to make any element draggable from the top left corner of the screen
function draggable(el) {
    let isMouseDown = false;

    let mouseX;
    let mouseY;

    let elementX = el.getBoundingClientRect().left;
    let elementY = el.getBoundingClientRect().top;

    el.addEventListener('mousedown', onMouseDown);

    function onMouseDown(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseDown = true;

        // set all z-indeces to 0
        document.querySelectorAll('.todo-list').forEach((list) => {
            list.style.zIndex = 0;
        })
        // and put the clicked on to 1 to make it stand out above others
        this.style.zIndex++
    }

    el.addEventListener('mouseup', onMouseUp);

    function onMouseUp() {
        isMouseDown = false;
        elementX = parseInt(el.style.left) || 0;
        elementY = parseInt(el.style.top) || 0;
        // Run updateLS here so that it goes through all todo lists again -
        // and adds them with their new top and left positionings
        updateLS();
    }

    document.addEventListener('mousemove', onMouseMove);

    function onMouseMove(e) {
        if (!isMouseDown) return;
        let deltaX = e.clientX - mouseX;
        let deltaY = e.clientY - mouseY;
        el.style.left = elementX + deltaX + 'px';
        el.style.top = elementY + deltaY + 'px';
    }
}

// Function to calculate time left until due date and assign correct colors accordingly
function calcTimeLeftAndColor(todo, dueDate, intervalId) {
    // Do time comparison and assign background colors if a date was specified

    // Get current date
    let currentDate = new Date();

    // difference between due date and current date in seconds
    let difference = ((dueDate - currentDate) / 1000).toFixed(2);

    // If 5 days or more left
    if (difference >= 432000) {
        todo.style.backgroundColor = 'rgba(0, 202, 252, 0.5)';
    }
    // If between 3 and 5 days left
    else if (difference >= 259200) {
        todo.style.backgroundColor = 'rgba(100, 150, 200, 0.5)';
    }
    // If between 2 and 3 days left
    else if (difference >= 172800) {
        todo.style.backgroundColor = 'rgba(150, 100, 100, 0.5)';
    }
    // If between 1 and 2 days left
    else if (difference >= 86400) {
        todo.style.backgroundColor = 'rgba(200, 50, 0, 0.5)';
    }
    // Less than 1 day left
    else if (difference >= 0) {
        todo.style.backgroundColor = 'rgba(255, 20, 0, 0.5)';
    }
    // If time is up
    else {
        // Prevent adding due-date-passed class if completed class is present
        if (!(todo.classList.contains('completed'))) {
            todo.classList.add('due-date-passed');
            clearInterval(intervalId);
        }
    }
}