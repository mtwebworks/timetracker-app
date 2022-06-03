import {
    UI
} from './Ui.js';
import {
    userData
} from './UserData.js';
import {
    list
} from './List.js';

class Timer extends UI {
    constructor() {
        super()
        this.arrayLenght = null;
        this.currentListElement = null;
        this.interval = null;
        this.currentTimeValue = 0;
        this.progresCounter = 0;
        this.isCounterOn = false;
        this.totalTimeValue;
        this.workIndex;

    }

    timer = this.getElement(this.uiSelectors.timer);
    startBtn = this.getElement(this.uiSelectors.startBtn);
    pauseBtn = this.getElement(this.uiSelectors.pauseBtn);
    stopBtn = this.getElement(this.uiSelectors.stopBtn);
    progresBarElements = Array.from(this.getElements(this.uiSelectors.progresBarElements));
    currentTimerTitle = this.getElement(this.uiSelectors.currentTimerTitle);
    currentTimer = this.getElement(this.uiSelectors.currentTimer);
    totalTimer = this.getElement(this.uiSelectors.totalTimer);

    init() {
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.stopBtn.addEventListener('click', () => this.stopTimer());
        this.hideTimerButtons();
    }


    manageTimer() {
        this.arrayLenght = userData.worksArray.length - 1;
        this.currentListElement = userData.worksArray[userData.worksArray.length - 1][this.workIndex]
        this.totalTimeValue = userData.worksArray[this.arrayLenght][this.workIndex].totalTime
        this.totalTimer.innerHTML = `
            ${list.formatTime(this.totalTimeValue).h < 10 ? '0'+ list.formatTime(this.totalTimeValue).h : list.formatTime(this.totalTimeValue).h}:${list.formatTime(this.totalTimeValue).m < 10 ? '0' + list.formatTime(this.totalTimeValue).m : list.formatTime(this.totalTimeValue).m}:${list.formatTime(this.totalTimeValue).s < 10 ? '0'+ list.formatTime(this.totalTimeValue).s : list.formatTime(this.totalTimeValue).s}`
        this.currentTimerTitle.innerText = userData.worksArray[userData.worksArray.length - 1][this.workIndex].name;
        this.showElement(this.startBtn);
    }

    startTimer() {
        list.iconsToggleVisibility()
        list.isEditing = true;
        this.isCounterOn = true;

        this.interval = setInterval(() => {

            this.totalTimeValue = userData.worksArray[this.arrayLenght][this.workIndex].totalTime + this.currentTimeValue;

            this.currentTimer.innerHTML = `
                            ${list.formatTime(this.currentTimeValue).h < 10 ? '0'+ list.formatTime(this.currentTimeValue).h : list.formatTime(this.currentTimeValue).h}:${list.formatTime(this.currentTimeValue).m < 10 ? '0'+ list.formatTime(this.currentTimeValue).m : list.formatTime(this.currentTimeValue).m}:${list.formatTime(this.currentTimeValue).s < 10 ? '0'+ list.formatTime(this.currentTimeValue).s : list.formatTime(this.currentTimeValue).s}`

            this.totalTimer.innerHTML = `
                            ${list.formatTime(this.totalTimeValue).h < 10 ? '0'+ list.formatTime(this.totalTimeValue).h : list.formatTime(this.totalTimeValue).h}:${list.formatTime(this.totalTimeValue).m < 10 ? '0' + list.formatTime(this.totalTimeValue).m : list.formatTime(this.totalTimeValue).m}:${list.formatTime(this.totalTimeValue).s < 10 ? '0'+ list.formatTime(this.totalTimeValue).s : list.formatTime(this.totalTimeValue).s}`

            this.progresBarElements[this.progresCounter].classList.add('timer__bar-element--active')

            if (this.progresCounter === 60) {
                this.progresBarElements.forEach(el => el.classList.remove('timer__bar-element--active'));
                this.progresCounter = 0;
                this.progresBarElements[0].classList.add('timer__bar-element--active')
            }

            this.currentTimeValue += 1000;
            this.progresCounter++

        }, 1000)

        this.hideElement(this.startBtn);
        this.showElement(this.pauseBtn);
        this.showElement(this.stopBtn);
    }

    pauseTimer() {
        clearInterval(this.interval);
        this.toggleElementVisiblity(this.startBtn);
        this.hideElement(this.pauseBtn);
    }

    stopTimer() {
        clearInterval(this.interval);

        this.currentListElement.time.push(this.currentTimeValue)
        this.currentListElement.totalTime += this.currentTimeValue;

        this.clearTimerValues()

        this.isCounterOn = false;
        list.isEditing = false;

        this.hideTimerButtons();
        list.renderWorksList();
    }

    clearTimerValues() {
        this.currentTimerTitle.innerText = '';
        this.currentTimer.innerText = '00:00:00';
        this.totalTimer.innerText = '00:00:00';
        this.totalTimeValue = 0;
        this.currentTimeValue = 0;
        this.progresCounter = 0;
        this.progresBarElements.forEach(el => el.classList.remove('timer__bar-element--active'));
    }

    hideTimerButtons() {
        this.hideElement(this.startBtn);
        this.hideElement(this.stopBtn);
        this.hideElement(this.pauseBtn);
    }
}

export const timer = new Timer();
timer.init();