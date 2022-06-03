import {
    UI
} from './Ui.js';
import {
    userData
} from './UserData.js';
import {
    timer
} from './Timer.js';

class List extends UI {
    constructor() {
        super();
        this.arrayLenght = null;
        this.defaultIndex = 1;
        this.arrayCounter = 1;
        this.hiddenClass = false;
        this.isEditing = false;
        this.workIndex;
        this.element;
    }

    navBar = this.getElement(this.uiSelectors.nav);
    worksList = this.getElement(this.uiSelectors.worksList);
    totalTime = this.getElement(this.uiSelectors.totalTime);
    addTaskBtn = this.getElement(this.uiSelectors.addBtn);


    init() {
        this.navBar.addEventListener('click', (e) => this.navBarControl(e));
        this.addTaskBtn.addEventListener('click', () => this.createBlankWork());
        this.worksList.addEventListener('click', (e) => this.worksListControl(e));
    }

    navBarControl(e) {
        switch (e.target.dataset.navBtn) {
            case "previous":
                if (this.arrayCounter <= userData.worksArray.length) {
                    this.navBar.children[2].classList.remove('works__btn--hidden');
                    this.addTaskBtn.classList.add('hidden');
                    this.arrayCounter++;
                    this.renderWorksList(this.arrayCounter);
                }
                if (this.arrayCounter == userData.worksArray.length) {
                    this.navBar.children[0].classList.add('works__btn--hidden');
                }
                break;
            case "next":
                if (this.arrayCounter > 1) {
                    this.navBar.children[0].classList.remove('works__btn--hidden');
                    this.navBar.children[2].classList.remove('works__btn--hidden');
                    this.arrayCounter--;
                    this.renderWorksList(this.arrayCounter);
                }
                if (this.arrayCounter === 1) {
                    this.navBar.children[2].classList.add('works__btn--hidden');
                    this.addTaskBtn.classList.remove('hidden');
                }
                break;
        }
    }

    worksListControl(e) {
        console.log(`dataset.btn: ${e.target.dataset.btn}, dataset.work: ${e.target.dataset.work}`);
        switch (e.target.dataset.btn) {
            case "edit":
                console.log('edit');
                this.hideAddTaskBtn();
                this.iconsToggleVisibility();
                this.isEditing = true;
                this.element = e.target.parentElement;
                this.editCurrentWork()
                break;

            case "newtime":
                timer.workIndex = Number(e.target.parentElement.dataset.index);
                timer.manageTimer()
                break;

            case 'ok':
                userData.worksArray[this.arrayLenght][this.workIndex].name = this.element.children[0].value;
                this.isEditing = this.canEdit();
                this.iconsToggleVisibility();
                this.renderWorksList();
                this.hideAddTaskBtn()
                break;

            case 'delete':

                console.log('delete');
                console.log(this.arrayLenght);

                const objectNames = Object.getOwnPropertyNames(userData.worksArray[this.arrayLenght]);
                console.log(objectNames);
                const objectToRemove = objectNames[objectNames.length - 4];
                console.log(objectToRemove);

                for (let i = this.workIndex; i <= objectNames.length - 4; i++) {
                    let nextObject = Number(i) + 1;
                    userData.worksArray[this.arrayLenght][i] = userData.worksArray[this.arrayLenght][nextObject];
                };

                delete userData.worksArray[this.arrayLenght][objectToRemove];


                userData.worksArray[this.arrayLenght].tasks -= 1;

                this.isEditing = this.canEdit();

                this.hideAddTaskBtn();
                this.renderWorksList();
                break;

            case 'cancel':

                this.isEditing = this.canEdit();
                this.renderWorksList();
                this.hideAddTaskBtn()
                break;
        }
    }

    renderWorksList(index) {
        if (this.worksList.firstChild) {
            this.removeListItems();
        }

        const currentObject = userData.worksArray[userData.worksArray.length - ((index === undefined) ? this.defaultIndex : index)];
        let totalTimeValue = 0;

        if (currentObject.day === new Date().getDate()) {
            document.querySelector('[works-date]').innerText = "Today"
            let hiddenClass = this.isEditing ? 'hidden' : '';

            for (let i = 0; i <= currentObject.tasks; i++) {
                totalTimeValue += currentObject[i].totalTime;
                const time = this.formatTime(currentObject[i].totalTime);

                const currentWork = document.createElement('li');
                currentWork.classList.add('works-list__item');
                currentWork.dataset.index = i;
                currentWork.innerHTML = `
                <p class="works-list__name">${currentObject[i].name}</p>
                <button class="works-list__btn ${hiddenClass}" data-btn="edit">
                <i class="fa-solid fa-edit"></i>
                </button>
                <p class="works-list__time" data-work="time">${time.h}&nbsp;h&nbsp;${time.m}&nbsp;min</p>
                <button class="works-list__btn ${hiddenClass}" data-btn="newtime">
                <i class="fa-solid fa-plus"></i>
                </buttn>`;

                this.worksList.appendChild(currentWork);
            }
        } else {
            document.querySelector('[works-date]').innerText = `${currentObject.day} ${this.numberToMonth(currentObject.month)}`
            for (let i = 0; i <= currentObject.tasks; i++) {

                totalTimeValue += currentObject[i].totalTime;
                const time = this.formatTime(currentObject[i].totalTime);

                const currentWork = document.createElement('li');
                currentWork.classList.add('works-list__item');
                currentWork.dataset.index = i;
                currentWork.innerHTML = `
                    <p class="works-list__name">${currentObject[i].name}</p>
                    <p class="works-list__time" data-work="time">${time.h}&nbsp;h&nbsp;${time.m}&nbsp;min</p>`;

                this.worksList.appendChild(currentWork);
            }
        }

        const totalTimeFormated = this.formatTime(totalTimeValue);
        this.totalTime.innerHTML = `Total time: ${totalTimeFormated.h}&nbsp;h&nbsp;${totalTimeFormated.m}&nbsp;min`;

        userData.setLocalStorage();
    }

    createBlankWork() {
        this.hideAddTaskBtn();
        this.iconsToggleVisibility();

        const blankWork = document.createElement('li');
        blankWork.classList.add('works-list__item');
        blankWork.innerHTML =
            `<input type="text" placeholder="New project" class="wokrs-list__input" data-work-input>
        <button class="works-list__btn" data-btn="ok">
        <i class="fa-solid fa-check"></i>
        </button>
        <button class="works-list__btn" data-btn="cancel">
            <i class="fa-solid fa-xmark"></i>
        </button>`
        // <p class="works-list__time" data-work="time">0h 00min</p>
        this.worksList.appendChild(blankWork);

        const workInput = blankWork.querySelector('[data-work-input]');
        workInput.focus();

        blankWork.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target.dataset.btn === 'ok') {
                this.saveNewWork(workInput)
            } else if (e.target.dataset.btn === 'cancel') {
                this.cancelNewWork(workInput);
            }
        })
    }

    editCurrentWork() {
        this.workIndex = this.element.dataset.index;
        const currentWorkName = this.element.children[0].innerText;

        this.element.innerHTML =
            `<input type="text" placeholder="${currentWorkName}" class="wokrs-list__input" data-work-input>
        <button class="works-list__btn" data-btn="ok">
        <i class="fa-solid fa-check"></i>
        </button>
        <button class="works-list__btn" data-btn="cancel">
            <i class="fa-solid fa-xmark"></i>
        </button>
        <button class="works-list__btn" data-btn="delete">
        <i class="fa-solid fa-eraser"></i>
        </button>`
        this.element.firstChild.focus()
    }

    saveNewWork(input) {
        const currentDay = new Date().getDate();
        const arrayLenght = userData.worksArray.length - 1;
        // console.log(input.value);
        if (userData.worksArray[arrayLenght].day === currentDay) {

            const index = userData.worksArray[arrayLenght].tasks + 1
            userData.worksArray[arrayLenght][index] = {
                name: input.value,
                time: [],
                totalTime: 0,
            }
            userData.worksArray[arrayLenght].tasks += 1
        }
        this.isEditing = this.canEdit();
        this.iconsToggleVisibility();
        this.hideAddTaskBtn();
        this.renderWorksList()
    }

    cancelNewWork(input) {
        this.hideAddTaskBtn();
        this.isEditing = this.canEdit();
        this.iconsToggleVisibility();
        input.parentElement.remove();
    }

    iconsToggleVisibility() {
        const worksBtns = this.getElements(this.uiSelectors.workBtns);

        if (!this.isEditing && !timer.isCounterOn) {
            worksBtns.forEach(btn => {
                btn.classList.toggle('hidden')
            })
        }
    }

    hideAddTaskBtn() {
        this.addTaskBtn.classList.toggle('hidden');
    }

    removeListItems() {
        while (this.worksList.firstChild) {
            this.worksList.firstChild.remove();
        }
    }

    canEdit() {
        return (timer.isCounterOn === true) ? true : false
    }

    formatTime(value) {
        if (value === 0 || value === undefined) {
            const h = 0;
            const m = 0;
            const s = 0;
            return {
                h,
                m,
                s
            }
        }
        const h = Math.floor(value / (1000 * 60 * 60));
        const m = Math.floor((value - h * 1000 * 60 * 60) / (1000 * 60));
        const s = Math.floor(((value - (h * 1000 * 60 * 60 + m * 1000 * 60)) / 1000));

        return {
            h,
            m,
            s
        }
    }

    numberToMonth(monthNumber) {
        const months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ];
        return months[monthNumber];
    }
}

export const list = new List()
list.init()