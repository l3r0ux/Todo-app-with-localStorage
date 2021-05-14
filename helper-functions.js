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