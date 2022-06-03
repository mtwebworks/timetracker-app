import { userData } from './UserData.js';
import { list } from './List.js';
import { UI } from './Ui.js';

class TimeTracker extends UI {
    constructor() {
        super();
        this.colorMode = false; 
        this.hiddenClass = false;
    }
    darkModeBtn = this.getElement(this.uiSelectors.darkModeBtn);

    init() {
        userData.manageLocalStorage();
        this.checkColorMode();
        list.renderWorksList();
        this.darkModeBtn.addEventListener('click', () => this.toggleDarkMode())
    }


    checkColorMode() {
        if (this.colorMode) {
            document.body.classList.toggle('dark-theme');
            this.darkModeBtn.classList.toggle('dark-mode-btn__icon--rotate');
        }
    }
    
    toggleDarkMode() {
            this.colorMode = !this.colorMode
            document.body.classList.toggle('dark-theme');
            this.darkModeBtn.classList.toggle('dark-mode-btn__icon--rotate');
    }

}

export const timeTracker = new TimeTracker();

timeTracker.init()