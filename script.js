//timer object
const Timer = {
    currTime : 0, //currently stored time
    currInterval : 0, //id of currently running setInterval

    async start(){
        this.currTime = 0; //settin the timer to 0

        let startingPoint = Date.now(); //current time in ms
        let delta; //ms since last tick
        
        this.currInterval = setInterval(() => {
            /* this avoids setInterval innacuracy */
            
            delta = Date.now() - startingPoint;
            startingPoint = Date.now();
            this.currTime += delta;
        }, 1);
    },

    async stop(){
        clearInterval(this.currInterval);
    },

    get time(){
        let ctime = this.currTime;
    
        const minutes = Math.floor(ctime / 60000);
        ctime -= minutes * 60000;

        const seconds = Math.floor(ctime / 1000);
        ctime -= seconds * 1000;

        const miliseconds = ctime;

        return (minutes) ? `${minutes}:${seconds}.${miliseconds}` : `${seconds}.${miliseconds}`;
    },
};

const welcomeButton = document.querySelector('.name-button');
const welcomeInput = document.querySelector('.name-input');
const welcomeScreen = document.querySelector('.welcome-screen');
const playIcon = document.querySelector('.fa-play');
const checkIcon = document.querySelector('.fa-check');
const mainPage = document.querySelector('.main-page');
const nameText = document.querySelector('.name-text');

let userName;


welcomeButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    if(welcomeInput.value){
        userName = welcomeInput.value;
        playIcon.classList.add('no-display');
        checkIcon.classList.remove('no-display'); //changin icon on the button to a checkmark

        welcomeButton.disabled = true; //disabling the button just in case
        welcomeScreen.classList.add('hide-animation'); 
        mainPage.classList.add('show-animation');

        nameText.innerText = userName;
    }
    else{ //if the name input is empty, it just gets in focus again
        welcomeInput.focus(); 
    }
});