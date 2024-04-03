const control = document.getElementById('control')
if (control) {
    initControl(control)
}

function initControl(control) {

    const pickItems = Array.from(control.getElementsByClassName('pick-item'))
    pickItems.forEach(item => {
        let targetList = null;
        let currentDroppable = null;
        item.addEventListener('mousedown', holdDownHandler)

        function holdDownHandler(event) {
            // Отмена браузерного обработчика перемещения
            item.ondragstart = () => false

            // Получаем координаты курсора при нажатии на элемент
            let shiftX = event.clientX - item.getBoundingClientRect().left;
            let shiftY = event.clientY - item.getBoundingClientRect().top;

            // Позиционируем элемент рядом с курсором
            item.style.position = 'absolute';
            item.style.zIndex = '5';
            item.style.left = event.pageX - shiftX + 'px';
            item.style.top = event.pageY - shiftY + 'px';

            const onCursorMove = (event) => {
                moveItem(event, shiftX, shiftY)
            }

            document.addEventListener('mousemove', onCursorMove);
            document.onmouseup = () => {
                item.style.position = 'static';
                if (targetList) targetList.prepend(item)

                document.removeEventListener('mousemove', onCursorMove);
                document.onmouseup = null
            }
        }

        const moveItem = (event, shiftX, shiftY) => {
            // Позиционируем элемент всегда рядом с курсором
            item.style.left = event.pageX - shiftX + 'px';
            item.style.top = event.pageY - shiftY + 'px';

            // Прячем переносимый элемент, чтобы поймать событие elementFromPoint
            item.hidden = true;
            item.style.pointerEvents = "none";

            // Поиск самого глубокого элемента по дереву под перетаскиваемым элементом
            let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

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


