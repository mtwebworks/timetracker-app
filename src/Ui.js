const hiddenClass = 'hidden'

export class UI {
    uiSelectors = {
        timer: '[data-timer]',
        startBtn: '[data-timer-start]',
        pauseBtn: '[data-timer-pause]',
        stopBtn: '[data-timer-stop]',

        progresBarElements: '[data-progres-element]',
        currentTimerTitle: '[data-timer-title]',
        currentTimer: '[data-timer-current]',
        totalTimer: '[data-timer-total]',

        addBtn: '[data-addbtn]',
        nav: '[data-works-nav]',
        worksList: '[data-works-list]',
        totalTime: '[data-total-time]',
        darkModeBtn: '.dark-mode-btn',
        workBtns: '[data-btn]'

    };

    getElement(selector) {
        return document.querySelector(selector)
    }

    getElements(selector) {
        return document.querySelectorAll(selector)
    }
    
    toggleElementVisiblity(element) {
        element.classList.toggle(hiddenClass);
    }

    showElement(element) {
        element.classList.remove(hiddenClass);
    }

    hideElement(element) {
        element.classList.add(hiddenClass)
    }
}