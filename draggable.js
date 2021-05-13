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