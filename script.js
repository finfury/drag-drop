const isMobile = isMobileDevice()
const control = document.getElementById('control')
if (control) {
    initControl(control)
}

function isMobileDevice() {
    return 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch) || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
}

function initControl(control) {
    const pickItemsNodes = control.getElementsByClassName('pick-item')
    const controlBox = Array.from(control.getElementsByClassName('control__box'))
    const controlActions = Array.from(control.getElementsByClassName('control__management'))
    controlActions.forEach(actionBlock => {
        const prevElem = actionBlock.previousElementSibling
        const nextElem = actionBlock.nextElementSibling
        const rightButton = actionBlock.querySelector("button.control__actions_right")
        const rightAllButton = actionBlock.querySelector('button.control__actions_right-all')
        const leftAllButton = actionBlock.querySelector('button.control__actions_left-all')
        const leftButton = actionBlock.querySelector('button.control__actions_left')
        let prevWindow,
            nextWindow,
            prevActiveItems,
            nextActiveItems

        if (prevElem) {
            prevWindow = prevElem.querySelector('ul.pick-list')
        }
        if (nextElem) {
            nextWindow = nextElem.querySelector('ul.pick-list')
        }


        rightButton.addEventListener('click', (event) => {
            prevActiveItems = Array.from(prevWindow.getElementsByClassName('pick-item active'))
            prevActiveItems?.forEach(elem => {
                elem.classList.remove('active')
                nextWindow.appendChild(elem)
            })
        })
        rightAllButton?.addEventListener('click', (event) => {
            let prevItems = Array.from(prevWindow.getElementsByClassName('pick-item'))
            prevItems?.forEach(elem => {
                elem.classList.remove('active')
                nextWindow.appendChild(elem)
            })
        })
        leftAllButton?.addEventListener('click', (event) => {
            let nextItems = Array.from(nextWindow.getElementsByClassName('pick-item'))
            nextItems?.forEach(elem => {
                elem.classList.remove('active')
                prevWindow.appendChild(elem)
            })
        })
        leftButton?.addEventListener('click', (event) => {
            nextActiveItems = Array.from(nextWindow.getElementsByClassName('pick-item active'))
            nextActiveItems?.forEach(elem => {
                elem.classList.remove('active')
                prevWindow.insertAdjacentElement("afterbegin", elem)
            })
        })
    })

    controlBox.forEach(box => {
        const list = box.querySelector('ul.pick-list')
        const activeItemsNodes = box.getElementsByClassName('pick-item active')
        const items = box.getElementsByClassName('pick-item')
        const upButton = box.querySelector('button.control__actions_up')
        const headerButton = box.querySelector('button.control__actions_header')
        const bottomButton = box.querySelector('button.control__actions_bottom')
        const downButton = box.querySelector('button.control__actions_down')

        upButton.addEventListener('click', (event) => {
            const sortedItems = Array.from(items)
            for (let i = 1; i < sortedItems.length; i++) {
                if (!sortedItems[i - 1].className.includes('active') && sortedItems[i].className.includes('active')) {
                    [sortedItems[i - 1], sortedItems[i]] = [sortedItems[i], sortedItems[i - 1]]
                    continue
                }
                if (sortedItems[i - 1].className.includes('active')) {
                    continue
                }
            }

            list.innerHTML = ''
            sortedItems.forEach(el => {
                list.appendChild(el)
                el.classList.remove('active')
            })
        })
        headerButton.addEventListener('click', (event) => {
            const allItems = Array.from(items)
            const activeItems = Array.from(activeItemsNodes)
            const sortedItems = allItems.sort((a, b) => {
                if (activeItems.includes(a) && activeItems.includes(b)) return 0
                if (activeItems.includes(a)) return -1
                if (activeItems.includes(b)) return 1
                return 0
            })
            list.innerHTML = ''
            sortedItems.forEach(el => {
                list.appendChild(el)
                el.classList.remove('active')
            })
        })
        bottomButton.addEventListener('click', (event) => {
            const allItems = Array.from(items)
            const activeItems = Array.from(activeItemsNodes)
            const sortedItems = allItems.sort((a, b) => {
                if (activeItems.includes(a) && activeItems.includes(b)) return 0
                if (activeItems.includes(a)) return 1
                if (activeItems.includes(b)) return -1
                return 0
            })
            list.innerHTML = ''
            sortedItems.forEach(el => {
                list.appendChild(el)
                el.classList.remove('active')
            })
        })
        downButton.addEventListener('click', (event) => {
            const sortedItems = Array.from(items)
            for (let i = sortedItems.length - 1; i > 0; i--) {
                if (!sortedItems[i].className.includes('active') && sortedItems[i - 1].className.includes('active')) {
                    [sortedItems[i - 1], sortedItems[i]] = [sortedItems[i], sortedItems[i - 1]]
                    continue
                }
                if (sortedItems[i].className.includes('active')) {
                    continue
                }
            }

            list.innerHTML = ''
            sortedItems.forEach(el => {
                list.appendChild(el)
                el.classList.remove('active')
            })
            /*let start = 0;
            const sortedItems = Array.from(items)

            for (; start < sortedItems.length - 1; start++) {
                let prev = sortedItems[start]
                let next = sortedItems[start + 1]
                if (prev.className.includes('active') && next.className.includes('active')) continue;
                if (prev.className.includes('active') && !next.className.includes('active')) {
                    [sortedItems[start], sortedItems[start + 1]] = [sortedItems[start + 1], sortedItems[start]]
                    start++
                }
            }
            list.innerHTML = ''
            sortedItems.forEach(el => {
                list.appendChild(el)
                el.classList.remove('active')
            })*/
        })
    })

    const pickItems = Array.from(pickItemsNodes)
    pickItems.forEach(item => {
        const startToDragNameEvent = isMobile ? "touchstart" : "mousedown"
        const moveNameEvent = isMobile ? "touchmove" : "mousemove"
        const upEventName = isMobile ? "ontouchend" : "onmouseup"
        let targetList = null;
        let currentDroppable = null;

        item.addEventListener('click', toggleActive)

        function toggleActive(event) {
            console.log('toggle Active class')
            event.currentTarget.classList.toggle('active')
        }
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

            const onCursorMove = (event) => {
                moveItem(event, shiftX, shiftY)
            }

            document.addEventListener(moveNameEvent, onCursorMove);
            document[upEventName] = () => {
                item.style.position = 'static';
                if (targetList) {
                    targetList.prepend(item)
                }

                document.removeEventListener(moveNameEvent, onCursorMove);
                document[upEventName] = null
            }
        }

        const moveItem = (event, shiftX, shiftY) => {
            // Позиционируем элемент всегда рядом с курсором
            item.style.position = 'absolute';
            item.style.zIndex = '5';
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


