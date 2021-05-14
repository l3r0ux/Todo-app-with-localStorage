// Function to add all todo lists with their todo items to localStorage on every change
function updateLS() {
    const todoLists = document.querySelectorAll('.todo-list');

    const todolists = [];

    todoLists.forEach((list) => {
        // To build up array with all todo list items for this specific todo list
        let todolistItems = [];

        // Loop to build up the todolist items for specific todo list
        if (list.children[2].childNodes) {
            list.children[2].childNodes.forEach((todo) => {
                todolistItems.push(
                    {
                        completed: todo.classList.contains('completed'),
                        innerText: todo.children[2].innerText,
                        // Getting these due date and times from the hidden inputs on each todo list item
                        dueDate: todo.children[0].value,
                        dueTime: todo.children[1].value,
                    }
                );
            })
        }

        todolists.push({
            id: list.id,
            name: list.children[0].children[1].innerText,
            top: list.style.top,
            left: list.style.left,
            zIndex: list.style.zIndex,
            todos: todolistItems
        })
    })

    localStorage.setItem('todolists', JSON.stringify(todolists));
}