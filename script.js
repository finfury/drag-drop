const isMobile = isMobileDevice()
const control = document.getElementById('control')
if (control) {
    initControl(control)
}

function isMobileDevice() {
    return 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch) || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
}

function initControl(control) {

    const pickItems = Array.from(control.getElementsByClassName('pick-item'))
    pickItems.forEach(item => {
        const startToDragNameEvent = isMobile ? "touchstart" : "mousedown"
        const moveNameEvent = isMobile ? "touchmove" : "mousemove"
        const upEventName = isMobile ? "ontouchend" : "onmouseup"
        let targetList = null;
        let currentDroppable = null;

        if (isMobile) {
            item.addEventListener(startToDragNameEvent, holdDownHandler)
        } else {
            item.addEventListener(startToDragNameEvent, holdDownHandler)
        }

        function holdDownHandler(event) {
            // Отмена браузерного обработчика перемещения
            item.ondragstart = () => false

            // Получаем координаты курсора при нажатии на элемент
            let shiftX,
                shiftY;
            if (isMobile) {
                shiftX = event.touches[0].clientX - item.getBoundingClientRect().left
                shiftY = event.touches[0].clientY - item.getBoundingClientRect().top
            } else {
                shiftX = event.clientX - item.getBoundingClientRect().left;
                shiftY = event.clientY - item.getBoundingClientRect().top;
            }

            // Позиционируем элемент рядом с курсором
            item.style.position = 'absolute';
            item.style.zIndex = '5';
            if (isMobile) {
                console.log(event.touches[0])
                item.style.left = event.touches[0].pageX - shiftX + 'px'
                item.style.top = event.touches[0].pageY - shiftY + 'px'
            } else {
                console.log(event)
                item.style.left = event.pageX - shiftX + 'px';
                item.style.top = event.pageY - shiftY + 'px';
            }

            const onCursorMove = (event) => {
                moveItem(event, shiftX, shiftY)
            }

            document.addEventListener(moveNameEvent, onCursorMove);
            document[upEventName] = () => {
                item.style.position = 'static';
                if (targetList) targetList.prepend(item)

                document.removeEventListener(moveNameEvent, onCursorMove);
                document[upEventName] = null
            }
        }

        const moveItem = (event, shiftX, shiftY) => {
            // Позиционируем элемент всегда рядом с курсором
            if (isMobile) {
                item.style.left = event.touches[0].pageX - shiftX + 'px'
                item.style.top = event.touches[0].pageY - shiftY + 'px'
            } else {
                item.style.left = event.pageX - shiftX + 'px';
                item.style.top = event.pageY - shiftY + 'px';
            }

            // Прячем переносимый элемент, чтобы поймать событие elementFromPoint
            item.hidden = true;
            item.style.pointerEvents = "none";

            // Поиск самого глубокого элемента по дереву под перетаскиваемым элементом
            let elemBelow;
            if (isMobile) {
                elemBelow = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
            } else {
                elemBelow = document.elementFromPoint(event.clientX, event.clientY);
            }

            item.style.pointerEvents = "all";
            item.hidden = false;

            // Если курсор вышел за пределы экрана
            if (!elemBelow) return;

            let droppableBelow = elemBelow.closest('.droppable');
            if (currentDroppable !== droppableBelow) {

                // Если перетаскиваемый элемент покинул зону сброса
                if (currentDroppable) {
                    targetList = null
                }
                currentDroppable = droppableBelow;
                // Если перетаскиваемый элемент зашел в зону сброса
                if (currentDroppable) {
                    targetList = currentDroppable
                }
            }
        }
    })
}


