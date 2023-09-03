function msToDisplayTime(msTime){
    if(msTime === 'DNF' || msTime === Infinity)
        return 'DNF';
    
    const minutes = Math.floor(msTime / 60000);
    msTime -= minutes * 60000;

    let seconds = Math.floor(msTime / 1000);
    msTime -= seconds * 1000;

    seconds = seconds.toString();

    if(minutes && seconds.length === 1){
        seconds = '0' + seconds;
    }

    msTime = msTime / 10;

    let miliseconds = msTime.toString().slice(0, 2);

    if(miliseconds.length === 1){
        miliseconds = '0' + miliseconds;
    }
    
    return (minutes) ? `${minutes}:${seconds}.${miliseconds}` : `${seconds}.${miliseconds}`;
}


//timer object
const Timer = {
    currTime : 0, //currently stored time
    currInterval : 0, //id of currently running setInterval
    isRunning : false,

    async start(){
        if(!this.isRunning){
            this.isRunning = true;
            
            this.currTime = 0; //settin the timer to 0

            let startingPoint = Date.now(); //current time in ms
            let delta; //ms since last tick
            
            this.currInterval = setInterval(() => {
                /* this avoids setInterval innacuracy */
                
                delta = Date.now() - startingPoint;
                startingPoint = Date.now();
                this.currTime += delta;
            }, 1);
        }
    },

    async stop(){
        clearInterval(this.currInterval);
        this.isRunning = false;
    },

    get time(){
        
        let ctime = this.currTime;

        const lastDigit = parseInt(ctime.toString().at(-1));
    
        if(lastDigit >= 5){
            ctime += (10 - lastDigit);
        }
        else{
            ctime -= lastDigit;
        }
    
        return ctime;
    },

    get seconds(){
        let ctime = this.currTime;
        const seconds = Math.floor(ctime / 1000);

        return seconds;
    },
};

const welcomeButton = document.querySelector('.name-button');
const welcomeInput = document.querySelector('.name-input');
const welcomeScreen = document.querySelector('.welcome-screen');
const playIcon = document.querySelector('.fa-play');
const checkIcon = document.querySelector('.fa-check');
const mainPage = document.querySelector('.main-page');
const nameText = document.querySelector('.name-text');
const scrambleArea = document.querySelector('.scramble-area');
const timerArea = document.querySelector('.timer-area');
const statsContainer = document.querySelector('.stats-content');
const bestSingleText = document.querySelector('.best-single');
const bestAo5Text = document.querySelector('.best-ao5');
const deleteLast = document.querySelector('.delete-last');
const plus2Last = document.querySelector('.plus2-last');
const dnfLast = document.querySelector('.dnf-last');
const timerControls = document.querySelector('.timer-controls');
const keyboardIcon = document.querySelector('.keyboard-icon');
const keyboard1 = document.querySelector('.fa-keyboard.fa-regular');
const keyboard2 = document.querySelector('.fa-keyboard.fa-solid');
const timerText = document.querySelector('.timer-text');
const timeInput = document.querySelector('.time-input');
const welcomeOptions = document.querySelector('.options-button');
const welcomeText = document.querySelector('.welcome-text');
const welcomeButtonSpan = welcomeButton.querySelector('span');

let latestAo5;
let latestTd;
let latestH3;
let allTimes = [];
let allAo5s = [];
let currAo5 = [];
let bestSingle = Infinity;
let bestAo5 = Infinity;
let isPlus2Last = false;
let isDNFLast = false;
let currDNFTime;
let latestAo5Value;
let latestHr;

let timerMode = 'timer';

let prevAo5;
let prevTd;
let prevH3;
let prevBestSingle;
let prevBestAo5;
let prevAo5Value;
let prevHr;


async function newAo5(){
    const hr = document.createElement('hr');
    hr.classList.add('break');

    const table = document.createElement('table');
    table.classList.add('stats-table');

    const tr = document.createElement('tr');
    tr.classList.add('ao5-times');

    const td = [];

    for(let i=0; i<5; i++){
        td.push(document.createElement('td'));
    }

    const h3 = document.createElement('h3');
    h3.classList.add('ao5-summary');

    const span1 = document.createElement('span');
    span1.classList.add('ao5-text');
    span1.innerText = 'ao5: ';

    const span2 = document.createElement('span');
    span2.classList.add('ao5-value');

    statsContainer.appendChild(hr);

    table.appendChild(tr);

    for(let i=0; i<5; i++){
        tr.appendChild(td[i]);
    }

    statsContainer.appendChild(table);

    h3.appendChild(span1);
    h3.appendChild(span2);
    statsContainer.appendChild(h3);
    statsContainer.appendChild(hr);

    prevHr = latestHr;
    latestHr = hr;

    return [table, h3];
};

async function calculateAo5(){
    let maxVal;
    let minVal;
    let DNFCount = 0;
    let sum = 0;

    if(currAo5.length < 5){
        return '---';
    }
    else{ 
        for(let i=0; i<5; i++){
            if(currAo5[i] === 'DNF' || currAo5[i] === Infinity){
                currAo5[i] = Infinity;
                DNFCount++;

                if(DNFCount > 1){
                    return 'DNF';
                }
            }
        }

        maxVal = Math.max(...currAo5);
        minVal = Math.min(...currAo5);

        for(let a of currAo5){

            if(a === maxVal){
                maxVal = -1;
            }
            else if(a === minVal){
                minVal = -1;
            }
            else{
                sum += a;
            }
        }

        let av = (sum/3).toFixed();

        return parseInt(av);

    }
};

async function calculateAo100(){
    //ao100 calculation TODO
};

async function addTime(res){
    prevNumberOfTimes = allTimes.length;
    allTimes.push(res);

    prevBestSingle = bestSingle;
    if(bestSingle > res && res !== 'DNF' && res !== Infinity){
        bestSingle = res;

        bestSingleText.innerText = msToDisplayTime(bestSingle);
    }

    displayTime = msToDisplayTime(res);
    
    
    prevTd = latestTd;
    prevAo5 = latestAo5;
    prevH3 = latestH3;
    prevBestAo5 = bestAo5;

    if(prevNumberOfTimes % 5 === 0){
        currAo5.length = 0;
        [latestAo5, latestH3] =  await newAo5();

        latestTd = latestAo5.querySelector('td');

        latestTd.innerText = displayTime;
        currAo5.push(res);

        prevAo5Value = latestAo5Value;
        latestAo5Value = latestH3.querySelector('.ao5-value');
    }
    else{
        latestTd = latestTd.nextSibling;

        latestAo5Value = latestH3.querySelector('.ao5-value');
        latestTd.innerText = displayTime;
        currAo5.push(res);
    }

    const ao5MsFormat = await calculateAo5();

    let ao5DisplayFormat;

    if(ao5MsFormat !== 'DNF' && ao5MsFormat !== '---'){
        ao5DisplayFormat = msToDisplayTime(ao5MsFormat);

        if(bestAo5 > ao5MsFormat && ao5MsFormat !== 'DNF') {
            
            bestAo5 = ao5MsFormat;
    
            bestAo5Text.innerText = ao5DisplayFormat;
        }
    }
    else{
        ao5DisplayFormat = ao5MsFormat;
    }

    
    latestAo5Value.innerText = (latestAo5Value) ? ao5DisplayFormat : '---';
    statsContainer.scrollTo(0, statsContainer.scrollHeight);

};

async function removeTime(){
    prevTime = allTimes.pop();

    if(allTimes.length !== 0){
        bestSingle = prevBestSingle;
        bestSingleText.innerText = msToDisplayTime(bestSingle);
    }
    else{
        bestSingle = Infinity;
        prevBestSingle = Infinity;
        bestSingleText.innerText = '---';
    }
    

    Display.displayText.innerText = '0.00';
    hideControls();


    currAo5.pop();

    if(allTimes.length % 5 === 0){

        latestAo5.remove();
        latestH3.remove();
        latestHr.remove();
    }
    else if((allTimes.length - 4) % 5 === 0){
        latestTd.innerText = '';

        latestAo5Value.innerText = '---';

        if(prevAo5Value){
            latestAo5Value = prevAo5Value;
        }
    }
    else{
        latestTd.innerText = '';
        
    }

    if(prevTd)
    latestTd = prevTd;

    if(prevAo5)
        latestAo5 = prevAo5;

    if(prevH3)
        latestH3 = prevH3;

    

    if(allTimes.length >= 5){
        bestAo5 = prevBestAo5;
        bestAo5Text.innerText = msToDisplayTime(bestAo5);
    }
    else{
        bestAo5Text.innerText = '---';
        bestAo5 = Infinity;
    }
        

    if(prevHr)
        latestHr = prevHr;


    prevBestSingle = bestSingle;
    prevAo5 = latestAo5;
    prevH3 = latestH3;
    prevHr = latestHr;
    prevTd = latestTd;
    prevBestAo5 = bestAo5;

    return prevTime;
};

let userName;

async function generateScramble(){
    const faces = ['U', 'D', 'R', 'L', 'F', 'B'];
    const moves = ["", "'", "2"];
    let scramble = "";
    const len = Math.floor(Math.random() * 3)+20;
    let prevFace = 'A';
    let currRandom;
    let currFace;

    for(let i=0; i<len; i++){
        
        currRandom = Math.floor(Math.random() * faces.length);
        currFace = faces[currRandom];

        while(currFace === prevFace){
            currRandom = Math.floor(Math.random() * faces.length);
            currFace = faces[currRandom];
        }

        scramble += currFace;
        prevFace = currFace;

        currRandom = Math.floor(Math.random() * moves.length);
        scramble += moves[currRandom];

        scramble += " ";
    }

    return scramble;
};

async function setScramble(){
    const scramble = await generateScramble();

    scrambleArea.innerText = scramble;
};

async function showControls(){
    timerControls.classList.remove('hide-controls');
};

async function hideControls(){
    timerControls.classList.add('hide-controls');
};

const Display = {
    displayText : document.querySelector('.timer-text'),
    currInterval : 0,
    state : 'idle',
    penalty : 'none',
    mode : 'timer',
    async startDisplay(){
        this.state = 'timer';
        Timer.start();

        this.currInterval = setInterval(() => {
            this.displayText.innerText = msToDisplayTime(Timer.time);
        }, 10)
    },
    async stopDisplay(){
        Timer.stop();
        clearInterval(this.currInterval);
        this.displayText.innerText = msToDisplayTime(Timer.time); //ensuring reading is accurate
        this.state = 'idle';
    }, //kocham Emilię Lizurek najbardziej na świecie!!!!
    async startInspection(){
        this.state = 'inspection';
        this.penalty = 'none';
        Timer.start();

        this.displayText.innerText = '0';
        let currSeconds = 0;

        this.currInterval = setInterval(() => {
            if(Timer.seconds > currSeconds){
                currSeconds += 1;

                if(currSeconds <= 15){
                    this.displayText.innerText = currSeconds;
                    this.penalty = 'none';
                }
                else if(currSeconds <= 17){
                    this.displayText.innerText = '+2';
                    this.penalty = '+2';
                }
                else if(currSeconds > 17){
                    this.displayText.innerText = 'DNF';
                    this.penalty = 'DNF';
                } 
            }
        }, 100)
    },
    stopInspection(){
        clearInterval(this.currInterval);
        Timer.stop();
    }

};

async function togglePlus2Last(){
    if(!isPlus2Last){
        isPlus2Last = true;
    
        plus2Last.classList.add('blue-2');
        let prevTime = await removeTime();
        let newTime = prevTime + 2000;
        await addTime(newTime);
        Display.displayText.innerText = `${msToDisplayTime(newTime)}+`;
        latestTd.innerText = `${latestTd.innerText}+`;
    }
    else{
        isPlus2Last = false;

        plus2Last.classList.remove('blue-2');
        let prevTime = await removeTime();
        let newTime = prevTime - 2000;
        await addTime(newTime);
        Display.displayText.innerText = msToDisplayTime(newTime);
    }


    
};

async function toggleDNFLast(){
    if(!isDNFLast){
        isDNFLast = true;

        plus2Last.classList.add('disabled');

        dnfLast.classList.add('red-dnf');
        currDNFTime = await removeTime();
        await addTime('DNF');

        Display.displayText.innerText = `DNF`;
        latestTd.innerText = 'DNF';
    }
    else{
        isDNFLast = false;
        plus2Last.classList.remove('disabled');


        dnfLast.classList.remove('red-dnf');
        await removeTime();
        await addTime(currDNFTime);
        Display.displayText.innerText = msToDisplayTime(currDNFTime);
    }
};

plus2Last.addEventListener('click', () => {
    togglePlus2Last();
    showControls();
});
dnfLast.addEventListener('click', () => {
    toggleDNFLast();
    showControls();
});

deleteLast.addEventListener('click', () => {
    removeTime();
    setScramble();
    Display.displayText.innerText = '0.00';
    hideControls();
});

function validateTimeInput(userInput){
    let regex = /^([0-5]?[0-9])\:([0-5]?[0-9])\.([0-9][0-9][0-9]?)$|^([0-5]?[0-9])\:([0-5]?[0-9])\.([0-9])$|^([0-5]?[0-9])\.([0-9]?[0-9]?[0-9])$/mg;

    let data = regex.exec(userInput);

    return data;
}

function convertTimeInput(userInput){
    
    data = validateTimeInput(userInput);
    

    if(!data){
        return false;
    }
    else{
        let counter = -1;
        let container = [];

        for(let a of data){
            if(a){
                counter++;

                if(counter > 0)
                    container.push(a);
            }
        }

        let convertedTime = 0;

        let minutes;
        let seconds;
        let milis;

        if(counter === 3){
            [minutes, seconds, milis] = container;

            convertedTime += minutes * 60000;
        }
        else if(counter === 2){
            [seconds, milis] = container;
        }

            
            
            

            //console.log(seconds, milis);

            let pureSeconds = parseInt(seconds);

            convertedTime += pureSeconds * 1000;

            if(milis.length == 1){
                convertedTime += parseInt(milis) * 100;
            } 
            else if(milis.length == 2){
                convertedTime += parseInt(milis) * 10;
            }
            else if(milis.length == 3){
                convertedTime += parseInt(milis.slice(0, -1)) * 10;
            }

            return convertedTime;


    }
};

welcomeButton.addEventListener('click', async (evt) => {
    evt.preventDefault();

    if(welcomeInput.value || welcomeOptions.hidden === false){
        
        if(welcomeOptions.hidden === true){
            userName = welcomeInput.value;
            localStorage.setItem('userName', userName);
        }
        

        playIcon.classList.add('no-display');
        welcomeButtonSpan.innerText = '';
        checkIcon.classList.remove('no-display'); //changing icon on the button to a checkmark

        welcomeButton.disabled = true; //disabling the button just in case
        welcomeScreen.classList.add('hide-animation'); 
        mainPage.classList.add('show-animation');
        nameText.innerText = localStorage.getItem('userName');
        setScramble();


        window.addEventListener('keyup', async (evt) => {
            
            if(Display.mode === 'timer'){
                if(evt.key === ' '){
                    //start breathing
    
                    let result;
    
                    plus2Last.classList.remove('blue-2');
                    dnfLast.classList.remove('red-dnf');
                    isPlus2Last = false;
                    isDNFLast = false;
                    plus2Last.classList.remove('disabled');
    
                    if(Display.state === 'idle'){
                        await Display.startInspection();
                        hideControls();
                    }
                    else if(Display.state === 'inspection'){
                        await Display.stopInspection();
                        await Display.startDisplay();
    
                    }
                    else if(Display.state === 'timer'){
                        await Display.stopDisplay();
                        let result;
    
                        if(Display.penalty === '+2'){
                            await addTime(Timer.time);
    
                            togglePlus2Last();
    
                        }
                        else if(Display.penalty === 'none'){
                            isPlus2Last = false;
    
                            addTime(Timer.time);
                        }
                        else if(Display.penalty === 'DNF'){
                            isPlus2Last = false;
                            
                            await addTime(Timer.time);
    
                            toggleDNFLast();
                        }
    
                        showControls();
                        setScramble();
                        
                    } 
                }
            }
            
        });

    }
    else{ //if the name input is empty, it just gets in focus again
        welcomeInput.focus(); 
    }
});

keyboardIcon.addEventListener('click', () => {
    keyboard1.classList.toggle('no-display');
    keyboard2.classList.toggle('no-display');

    timeInput.value = '';

    timerText.classList.toggle('no-display');
    timeInput.classList.toggle('no-display');

    if(Display.mode === 'timer')
        Display.mode = 'typing';
    else
        Display.mode = 'timer';
});



//onDOMCOntentLoaded

function firstVisit(){
    welcomeInput.hidden = false;
    welcomeOptions.hidden = true;

    welcomeText.textContent = `Hi.`;
    welcomeButtonSpan.innerText = '';

    welcomeButton.classList.remove('welcome-bigger');
    welcomeOptions.classList.remove('buttons-bigger');

    playIcon.classList.remove('play-icon-new');

    welcomeText.classList.remove('top-mrg');
}

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('userName')){
        let theName = localStorage.getItem('userName');
        
        welcomeInput.hidden = true;
        welcomeOptions.hidden = false;

        welcomeText.textContent = `Hi ${theName}.`;

        welcomeButton.classList.add('welcome-bigger');
        welcomeOptions.classList.add('buttons-bigger');

        welcomeButtonSpan.innerText = 'START';
        playIcon.classList.add('play-icon-new');

        welcomeText.classList.add('top-mrg');
        
    }
    else{
        firstVisit();
    }
});

welcomeOptions.addEventListener('click', (evt) => {
    evt.preventDefault();
    
    firstVisit();
});

timeInput.addEventListener('keydown', (evt) => {

    if(evt.code === 'Enter'){
        const enteredTime = timeInput.value;

        const data = convertTimeInput(enteredTime);

        if(data){
            addTime(data);
            timeInput.value = '';

            plus2Last.classList.remove('blue-2');
            dnfLast.classList.remove('red-dnf');
            isPlus2Last = false;
            isDNFLast = false;
            plus2Last.classList.remove('disabled');
            
            setScramble();
            showControls();
        }
    }
});