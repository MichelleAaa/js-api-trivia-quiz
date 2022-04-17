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
    <div class="row d-flex justify-content-center"> 
        <div class="col-10 text-center">    
            <h4 class="text-center mb-4 mt-5">Please Select a Difficulty Level:</h4>
            <div class="btn-difficulty-wrapper mt-2">
                <button type="button" class='btn'>Easy</button>
                <button type="button" class='btn'>Medium</button>
                <button type="button" class='btn'>Hard</button>
            </div>
        </div>
    </div>
    `;

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

//Fetch data from the API.
async function sendApiRequest(difficultyLevel){
    //Immediately display a loading message.
    response.innerHTML = `
    <h2 class="loading text-center pb-5">Loading</h2>
    `
    //Hide everything else while loading:
    $('#status').hide();
    $('#question').hide();
    $('#submit-btn').hide();
    $('answer-list').hide();

    try {
    let response = await fetch(difficultyLevel);
    data = await response.json();//get our data.
    if(data){
    useApiData(data);//call the useApiData function and pass in the data we received.
    }
    } catch (error) {
        console.log(error);
        $('#submit-btn').hide();
        answerList.innerHTML = `
        <h4 class="text-center">Sorry, the quiz is not available right now. Please try again later.</h4>
        `
    }
}

//QUERY SELECTORS
let toggleShow = document.querySelector('#toggleShow');
let question = document.querySelector('#question');
let answerList = document.querySelector('#answer-list');
let checkBtn = document.querySelector('#submit');
let response = document.querySelector('#message');
let questionNumber = document.querySelector('.progress');
let numberCorrect = document.querySelector(".number-correct");

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
        <div class="row d-flex justify-content-center">
            <div class="col-11 text-center">
                <h2 class="px-2 py-3">Congratulations, you completed the Quiz!</h2>
                <h4>Your Final Score:</h4>
                <p class="final-score">${correctQuestions}/10</p>
                <p>Play Again?</p>
                <button type="button" class='btn btn-reload'>New Quiz</button>
            </div>
        </div>
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
    questionNumber.innerHTML = `
    <p class="progress-done">Questions Completed: ${currQIndex}/10
    </p>
    <span class="progress-bar"></span>
    `;
    // let progressDone = document.querySelector('.progress-done');
    let progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = Math.round(parseInt(currQIndex) * 10) + '%';

    // numberCorrect
    numberCorrect.innerHTML = `
    <p class="correct-done">Correct Answers: ${correctQuestions}
    </p>
    <span class="correct-bar"></span>
    `;

    let correctBar = document.querySelector('.correct-bar');
    correctBar.style.width = Math.round(parseInt(correctQuestions) * 10) + '%';
    console.log(Math.round(parseInt(correctQuestions) * 10) + '%');

    // correct.textContent = `Correct Answers: ${correctQuestions}`;

    //Render question
    question.innerHTML = `Question: ${data.results[currQIndex].question}`;

        //Render randomized answers
    answerList.innerHTML = `
        ${randomizedIndex.map((randIndex, index) => `
            <button type="button" class="btn btn-answer" i=${index}>${answers[randIndex]}</button>
        `).join("")}
    `;

    //Add event listeners to the answer selection buttons
    let nodeList = answerList.querySelectorAll(".btn");
    console.log(nodeList);
    for (let btn of nodeList) {
        btn.addEventListener('click', selectAnswer, false);
    }

    //Hide the temporary loading message and show all other fields
    $('#message').hide();
    $('#status').show();
    $('#question').show();
    $('#submit-btn').show();
    $('answer-list').show();
}

function selectAnswer(e){
    e.preventDefault();
    console.log(e);
    currSelection = e.target.innerText;
    console.log(currSelection);    
}

function displayResult(message) {
    response.innerHTML = `
    <div class="quest-result-wrapper text-center">
        <p>Your Answer: <span>${currSelection}</span></p>
        <p>Result:</p>
        <p class="message">${message}</p>
    </div>
    `;
    let messageTxt = response.querySelector('.message');
    if(message === 'Correct!'){
        messageTxt.style.color = 'green';
    }
    if(message === 'Incorrect'){
        messageTxt.style.color = 'red';
    }
    response.style.display = 'block';
    answerList.style.display = 'none';
    checkBtn.style.display = 'none';
    //remove alert
    setTimeout(function () {
        response.textContent = '';
        response.style.display = 'none';
        answerList.style.display = 'block';
        checkBtn.style.display = 'block';
        if (message === 'Please make a selection.'){
        return;
        } else {
        currQIndex++;
        currSelection = '';
        randomizedIndex = [];
        useApiData(data);
        }
    }, 2000);
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
        displayResult('Correct!');
    } else {
        displayResult('Incorrect');
    }
}

