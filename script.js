let currentDroppable = null;

const control = document.getElementById('control')
if (!control) console.log('Control не найден!')
const pickItems = Array.from(control.getElementsByClassName('pick-item'))
let isDrop = false;
let targetList;
pickItems.forEach(item => {
    item.addEventListener('mousedown', holdDownHandler)

    function holdDownHandler(event) {
        const point = event.currentTarget
        const currentWindow = item.closest('.pick-list')
        // Отмена браузерного обработчика перемещения
        point.ondragstart = () => false

        let shiftX = event.clientX - item.getBoundingClientRect().left;
        let shiftY = event.clientY - item.getBoundingClientRect().top;

        const onCursorMove = (event) => {
            moveItem(point, event, shiftX, shiftY)
        }

        item.style.position = 'absolute';
        item.style.zIndex = 5;

        moveAt(event.pageX, event.pageY);

        // Позиционируем элемент с position: absolute
        function moveAt(pageX, pageY) {
            item.style.left = pageX - shiftX + 'px';
            item.style.top = pageY - shiftY + 'px';
        }

        document.addEventListener('mousemove', onCursorMove);
        document.onmouseup = () => {
            console.log('Remove Handler')
            if (!isDrop) {
                item.style.position = 'static';
            } else {
                console.log(targetList)
                item.style.position = 'static';
                targetList.prepend(item)
            }
            document.removeEventListener('mousemove', onCursorMove);
            document.onmouseup = null
        }
    }
})

const moveItem = (item, event, shiftX, shiftY) => {
    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        item.style.left = pageX - shiftX + 'px';
        item.style.top = pageY - shiftY + 'px';
    }

    // Прячем переносимый элемент, чтобы поймать событие elementFromPoint
    item.hidden = true;
    // Поиск самого глубокого элемента по дереву под перетаскиваемым элементом
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    item.hidden = false;

    // Если нет элементов под перетаскиваемым элементом
    if (!elemBelow) return;
    let droppableBelow = elemBelow.closest('.droppable');
    console.log(currentDroppable)
    if (currentDroppable !== droppableBelow) {

        // Если перетаскиваемый элемент покинул зону сброса
        if (currentDroppable) {
            console.log('Leave target!')
            isDrop = false
            targetList = null
            leaveDroppable(item, currentDroppable);
        }
        currentDroppable = droppableBelow;
        // Если перетаскиваемый элемент зашел в зону сброса
        if (currentDroppable) {
            console.log('TARGET!')
            isDrop = true
            targetList = currentDroppable
            enterDroppable(item, currentDroppable);
        }
    }
}

function enterDroppable(dropElem, targetElement) {
    //dropElem.style.position = 'static';
    //targetElement.prepend(dropElem)
}

function leaveDroppable(dropElem, targetElement) {
    //dropElem.style.position = 'absolute';
    //dropElem.style.zIndex = 5;
}

