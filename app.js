let currQIndex = 0,
    correctQuestions = 0;

let data;
let randomizedIndex = [];
let answers;
let currSelection = '';

const difficultyEasy = `https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple`;
const difficultyMedium = `https://opentdb.com/api.php?amount=10&category=20&difficulty=medium&type=multiple`;
const difficultyHard = `https://opentdb.com/api.php?amount=10&category=20&difficulty=hard&type=multiple`;


window.onload = initialRender;

function initialRender() {
    toggleShow.style.display = 'none';
    let container = toggleShow.parentElement;
    //Create a temporary element
    let btnContainerTemp = document.createElement('div');
    btnContainerTemp.classList.add("initBtns");
    container.appendChild(btnContainerTemp);
    btnContainerTemp.innerHTML = `
        <h1>Please Select a Difficulty Level:</h1>
        <button class='btn'>Easy</button>
        <button class='btn'>Medium</button>
        <button class='btn'>Hard</button>
    `
    //Add event listeners to the answer selection buttons
    let btnList = btnContainerTemp.querySelectorAll(".btn");
    console.log(btnList);
    for (let btn of btnList) {
        btn.addEventListener('click', selectDifficulty, false);
    }
}

function selectDifficulty(e){
    e.preventDefault();
    let selection = e.target.textContent;
    let btnContainer = document.querySelector(".initBtns");
    btnContainer.style.display = 'none';
    toggleShow.style.display = 'block';
    //SHOULD i MOVE THE ABOVE ELSEWHERE? SINCE IT'S NOT READY TO RENDER YET ANYWAYS?
    if(selection === "Easy"){
        sendApiRequest(difficultyEasy);
    }
    if(selection === "Medium"){
        sendApiRequest(difficultyMedium);
    }
    if(selection === "Hard"){
        sendApiRequest(difficultyHard);
    }
}

//An asynchronous function to fetch data from the API.
async function sendApiRequest(difficultyLevel){
    let response = await fetch(difficultyLevel);
    console.log(response);
    data = await response.json();//get our data.
    console.log(data);
    useApiData(data);//call the useApiData function and pass in the data we received.
}


//QUERY SELECTORS

let toggleShow = document.querySelector('#toggleShow');
let question = document.querySelector('#question');
let answerList = document.querySelector('#answer-list');
let checkBtn = document.querySelector('#submit');
let response = document.querySelector('#message');
let questionNumber = document.querySelector('.progress');
let correct = document.querySelector('.correct-answers');

//EVENT LISTENERS
checkBtn.addEventListener('click', checkAnswer);

//PROCESS API DATA
function useApiData(data) {
    if (currQIndex === 10){
        toggleShow.style.display = 'none';
        let container = toggleShow.parentElement;
        let finalContainer = document.createElement('div');
        finalContainer.classList.add('.final');
        container.appendChild(finalContainer);
        finalContainer.innerHTML = `
        <h1>Congratulations, you completed the Quiz!</h1>
        <h4>Your Score:</h4>
        <p>${correctQuestions}/10</p>
        <p>Play Again?</p>
        <button class='btn btn-reload'>New Quiz</button>
        `
        let btnReload = finalContainer.querySelector(".btn-reload");
        btnReload.addEventListener('click', function () {document.location.reload (true);}, false);

        return;
    }
    answers = {
        1: data.results[currQIndex].correct_answer,
        2: data.results[currQIndex].incorrect_answers[0],
        3: data.results[currQIndex].incorrect_answers[1],
        4: possibleAns4 = data.results[currQIndex].incorrect_answers[2]
    };
    randomization();
}


//Randomize the Index
function randomization(){
    let unrandomizedArray = [1, 2, 3, 4];

    for (let i = unrandomizedArray.length; i > 0; i--) {
        let j = Math.floor(Math.random() * (i));
        randomizedIndex.push(unrandomizedArray[j]);
        unrandomizedArray.splice(j, 1);
    }
    renderQA();
}

function renderQA() {
    //render stats
    questionNumber.textContent = `Questions Completed: ${currQIndex}/10`;
    correct.textContent = `Correct Answers: ${correctQuestions}`;
    //Render question
    question.innerHTML = `Question: ${data.results[currQIndex].question}`;

    //Render randomized answers
    answerList.innerHTML = `
        ${randomizedIndex.map((randIndex, index) => `
            <button class="btn btn-answer" i=${index}>${answers[randIndex]}</button>
        `).join("")}
    `;

    //Add event listeners to the answer selection buttons
    let nodeList = answerList.querySelectorAll(".btn");
    console.log(nodeList);
    for (let btn of nodeList) {
        btn.addEventListener('click', selectAnswer, false);
    }
}

function selectAnswer(e){
    e.preventDefault();
    currSelection = e.target.innerText;
    console.log(currSelection);
}

function displayResult(message) {
    response.textContent = message;
    response.style.display = 'block';
    answerList.style.display = 'none';
    //remove alert
    setTimeout(function () {
        response.textContent = '';
        response.style.display = 'none';
        answerList.style.display = 'block';
        if (message === 'Please make a selection.'){
        return;
        } else {
        console.log('time to move on');
        currQIndex++;
        currSelection = '';
        randomizedIndex = [];
        useApiData(data);
        }
    }, 1000);
}

//After submit, check the currSelection answer.
function checkAnswer(e){
    e.preventDefault();
    if(currSelection === ''){
        displayResult('Please make a selection.');
        return;
    }

    if(currSelection === answers[1]){
        correctQuestions++;
        displayResult('correct!');
    } else {
        displayResult('incorrect');
    }
}
