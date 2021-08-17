// Function to add a new todo list
function addTodoList(id = null, zIndex = null, name = null, top = null, left = null, init = false, formExpanded = true, todosExpanded = true) {
    let todoListName;

    // if is not initial page load, set the name of new todo list from input, 
    // and check if no name was present then focus
    if (!(init)) {
        // To add a new todo list
        todoListName = document.querySelector('#new-todo-list-input').value;

        if (!(todoListName)) {
            return document.querySelector('#new-todo-list-input').focus();
        }
        // else set the todoListName to the one provided in argument from localStorage
    } else {
        todoListName = name;
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
    // add in correct z-index depending on what was got from localstorage if init true
    if (init) {
        todoListContainer.style.zIndex = zIndex;
    }
    todoListContainer.innerHTML = `
        <div class="todo-list-title">
            <div class="delete-todolist-button delete-todolist"><i class="fas fa-trash delete-todolist"></i></div>
            <span>${todoListName}</span>
            <div><i class="fas fa-caret-down expand-form ${formExpanded ? 'form-expanded' : ''}"></i></div>
        </div>

        <div class="add-todo ${formExpanded ? 'form-expanded' : ''}">
            <form class="add-todo-form">
                <div class="todo-text">
                    <input class="input" type="text" placeholder="Enter your todo">
                </div>
                <div class="due-date">
                    <label class="due-label">Due(optional):</label>
                    <input class="date" type="date">
                    <input class="time" type="time">
                </div>
                <button class="submit" type="submit">Add</button>
            </form>
        </div>
        
        <div class="expand-todo-items-control"><i class="fas fa-caret-down expand-todos ${todosExpanded ? 'todos-expanded' : ''}"></i></div>
        <div class="todo-items ${todosExpanded ? 'todos-expanded' : ''}"></div>
    `;

    addTodoForm.classList.add('hidden');
    document.body.append(todoListContainer);

    // If is on mobile, dont make todo list positions random
    if (window.innerWidth < 1025) {
        todoListContainer.style.top = '';
        todoListContainer.style.left = '';
    } else {
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
    if (window.innerWidth > 1024) {
        // Timeout so that function draggable uses the final coordinates after animation
        setTimeout(() => {
            // Make specific todo draggable
            draggable(todoListContainer);
            (!(init)) ? todoListContainer.children[1].children[0].children[0].children[0].focus() : '';
        }, 800)
    }
}


// To add a todo item
// let intervalId;
function addTodo(e = null, listId = null, completed = null, text = null, dueDate = null, dueTime = null, init = false) {
    let specificTodoListForm;
    let todoItemText;
    let todoItemDueDate;
    let todoItemDueTime;

    // Assign Different variables depending on if init is true or false
    // If true, assign the variables with the values from localStorage
    // If false, assign variables with values of inputs
    if (!(init)) {
        // Gives the todo items of specific submitted todo list 
        specificTodoListForm = e.target;
        // Get specific todo lists' inputs
        todoItemText = specificTodoListForm.children[0].children[0].value;
        todoItemDueDate = specificTodoListForm.children[1].children[1].value;
        todoItemDueTime = specificTodoListForm.children[1].children[2].value;
    } else {
        specificTodoListForm = document.getElementById(listId);
        todoItemText = text;
        todoItemDueDate = dueDate;
        todoItemDueTime = dueTime;
    }

    if (!(init)) {
        // Prevent adding if not todo was present, but allow if dates weren't added
        // If no date was added, give todo standard white transparent color
        // If date and time was added, compare that date and time to current, and assign background color accordingly
        if (!(todoItemText)) {
            return specificTodoListForm.children[0].children[0].focus()
        }
    }

    // Append a todo item
    let todoItemContainer = document.createElement('div');
    todoItemContainer.classList.add('todo-item');
    todoItemContainer.classList.add('todo');
    todoItemContainer.classList.add('hidden');
    completed ? todoItemContainer.classList.add('completed') : '';
    todoItemContainer.innerHTML = `
        <input id="date" type="hidden" value="">
        <input id="time" type="hidden" value="">
        <span class="text todo" contenteditable>${todoItemText}</span>
        <span class="control-container">
            <span class="complete todo-button check"><i class="fas fa-check check"></i></span>
            <span class="delete todo-button remove"><i class="fas fa-trash remove"></i></span>
            <span class="update-text todo-button hidden"><i class="fas fa-edit"></i></span>
            <span class="update-date todo-button hidden update-due-date"><i class="fas fa-calendar update-date"></i></span>
        </span>
    `;


    setTimeLeftAndColor(todoItemContainer, todoItemDueDate, todoItemDueTime);


    // Add listeners to add time left bubble on hover on todo item creation
    // Only do this on desktop devices
    // Make this todo hoverable for showing due date
    if (window.innerWidth > 1024) {
        let timerId;
        let dueX;
        let dueY;
        // To keep track of mouse in todoItemContainer to place due bubble precisely
        todoItemContainer.addEventListener('mousemove', (e) => {
            dueX = e.clientX;
            dueY = e.clientY;
        })
        // to see if mouse is over todo item container and place it
        todoItemContainer.addEventListener('mouseover', (e) => {
            // only run this code if hovering over a todo item
            // timout so that duetime box only appears when hovering for a certain time
            timerId = setTimeout(() => {
                // make sure date is present
                if (todoItemContainer.children[0].value) {
                    let duetimeContainer = document.createElement('div');
                    duetimeContainer.classList.add('duetime-peek');
                    duetimeContainer.classList.add('hidden');
                    // placing where the cursor is
                    duetimeContainer.style.top = `${dueY}px`;
                    duetimeContainer.style.left = `${dueX}px`;
                    duetimeContainer.innerHTML = `Due: ${todoItemContainer.children[0].value} ${todoItemContainer.children[1].value}`;

                    document.body.prepend(duetimeContainer);

                    requestAnimationFrame(() => {
                        duetimeContainer.classList.remove('hidden');
                    })
                }
            }, 500)
        })
        // Clearing timout id if leave certain todo before the timeout
        todoItemContainer.addEventListener('mouseout', () => {
            clearTimeout(timerId);
            // only remove if the todo that was hovered over before had a duedate and there is a duetime-peek to remove
            if (document.querySelector('.duetime-peek') && todoItemContainer.children[0].value) {
                document.querySelector('.duetime-peek').classList.add('hidden');
                setTimeout(() => {
                    document.querySelector('.duetime-peek').remove()
                }, 200)
            }
        })
    }


    specificTodoListForm.closest('section').children[3].append(todoItemContainer);

    // wait until compute transitions
    requestAnimationFrame(() => {
        todoItemContainer.classList.remove('hidden');
    })
}

// Function to calculate time left on load an set colors
function setTimeLeftAndColor(todoItemContainer, todoItemDueDate, todoItemDueTime) {
    if (!(todoItemDueDate)) {
        return todoItemContainer.style.backgroundColor = '';
    }

    if (todoItemDueDate) {
        todoItemContainer.children[0].value = todoItemDueDate;
        todoItemContainer.children[1].value = todoItemDueTime;

        // Extract hours and minutes from time input here outside calcTimeLeftAndColor -
        // Because the due date will stay the same
        // calculate the currentDate inside calcTimeLeftAndColor becuase it will change on each calculation

        // Only get hours and minutes if the time input had a value
        let dueHours;
        let dueMinutes;
        todoItemDueTime ? dueHours = parseFloat(todoItemDueTime.slice(0, 2)) : null;
        todoItemDueTime ? dueMinutes = parseFloat(todoItemDueTime.slice(3, 5)) : null;

        // Get entered date in same format
        let dueDate = new Date(todoItemDueDate);
        // if time input was present, use that: otherwise use the default of 8am
        if (dueHours >= 0 && dueMinutes >= 0) {
            dueDate.setHours(dueHours);
            dueDate.setMinutes(dueMinutes);
        } else {
            dueDate.setHours(8);
            dueDate.setMinutes(0);
            // console.log(dueDate);
        }
        // Do time comparison and assign background colors if a date was specified
        // Get current date
        let currentDate = new Date();

        // difference between due date and current date in seconds
        let difference = ((dueDate - currentDate) / 1000);

        // If 5 days or more left
        if (difference >= 432000) {
            todoItemContainer.style.backgroundColor = 'rgba(0, 202, 252, 0.5)';
        }
        // If between 3 and 5 days left
        else if (difference >= 259200) {
            todoItemContainer.style.backgroundColor = 'rgba(100, 150, 200, 0.5)';
        }
        // If between 2 and 3 days left
        else if (difference >= 172800) {
            todoItemContainer.style.backgroundColor = 'rgba(150, 100, 100, 0.5)';
        }
        // If between 1 and 2 days left
        else if (difference >= 86400) {
            todoItemContainer.style.backgroundColor = 'rgba(200, 50, 0, 0.5)';
        }
        // Less than 1 day left
        else if (difference >= 0) {
            todoItemContainer.style.backgroundColor = 'rgba(255, 20, 0, 0.5)';
        }
        // If time is up
        else {
            // Prevent adding due-date-passed class if completed class is present
            if (!(todoItemContainer.classList.contains('completed'))) {
                todoItemContainer.classList.add('due-date-passed');
                // clearInterval(intervalId);
            }
        }

        // Calculate on an interval so that colors can change live
        // intervalId = setInterval(() => {
        //     calcTimeLeftAndColor(todoItemContainer, dueDate, intervalId);
        // }, 1000)
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

// On page load, render everything from localstorage
function init() {
    const todoLists = JSON.parse(localStorage.getItem('todolists'));
    if (todoLists) {
        // for every todo list in local storage:
        todoLists.forEach((list) => {
            // make a todo list:
            // All the arguments are what gets remembered
            addTodoList(list.id, list.zIndex, list.name, list.top, list.left, true, list.formExpanded, list.todosExpanded);
            // and render all of that specific todo lists' todos into it
            // All the arguments are what gets remembered
            list.todos.forEach((todoItem) => {
                addTodo(null, list.id, todoItem.completed, todoItem.innerText, todoItem.dueDate, todoItem.dueTime, true);
            })
        })
    }
}