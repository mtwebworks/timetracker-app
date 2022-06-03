import { list } from "./List.js";
import { timeTracker } from "./TimeTracker.js";

class UserData {
    constructor(){
        this.worksArray = null;
        this.tasksStartIndex = -1;
    }

    manageLocalStorage() {
        if (this.checkLocalStorage()) {
            this.loadLocalStorage();
            if (!this.checkIsCurrentDay()) {
            this.addNewDay();
            }
            if (this.worksArray.length === 1) {
                list.navBar.children[0].classList.add('works__btn--hidden');
            }
        } else {
            this.worksArray = [];
            this.addNewDay();
           list.navBar.children[0].classList.add('works__btn--hidden');
        }

        list.arrayLenght = userData.worksArray.length - 1;
    }
    
    setLocalStorage() {
        localStorage.setItem('worksArray', JSON.stringify(this.worksArray));
        localStorage.setItem('colorMode', JSON.stringify(timeTracker.colorMode));
    }

    loadLocalStorage() {
            this.worksArray = JSON.parse(localStorage.getItem('worksArray'));
            timeTracker.colorMode = JSON.parse(localStorage.getItem('colorMode'));
    }

    checkLocalStorage() {
        if (localStorage.length === 0 && !localStorage.key(0) === 'worksArray') {
            return false
        } else if (localStorage.length > 0) {
            for (let i = 0; i <= localStorage.length; i++) {
                if (localStorage.key(i) === 'worksArray') {
                    return true
                }
            }
        }
    }

    checkIsCurrentDay() {
        let worksArrayLength = this.worksArray.length - 1
        if (this.worksArray[worksArrayLength].day === new Date().getDate() && this.worksArray[worksArrayLength].month === new Date().getMonth()) {
            return true 
        } else {
            return false
        }
    }
    
    addNewDay() {
        this.worksArray.push({
            day: new Date().getDate(),
            month: new Date().getMonth(),
            tasks: this.tasksStartIndex
        })
    }
}

export const userData = new UserData;