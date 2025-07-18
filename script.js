const inputWordle = document.querySelector(".wordle-game");
const statusMessage = document.querySelector(".wordle-header-status-message");
const hashMapLettersWordOfDay = new Map();

let endLineCheck = false;

let wordOfDay;
let lettersWordOfDay = [];
let qtdTries = 0;

//
// WORD OF DAY VERIFICATION
//

async function wordOfDayCheck() {
    const response = await fetch("https://words.dev-apis.com/word-of-the-day");
    const data = await response.json();
    wordOfDay = data.word.toUpperCase();
    lettersWordOfDay = wordOfDay.split("");
    setLettersHashMap(lettersWordOfDay);
}

wordOfDayCheck();

function setLettersHashMap(word) {
    hashMapLettersWordOfDay.clear();
    for (const letra of word) {
        hashMapLettersWordOfDay.set(letra, true);
    }
}

//
// INPUT BLOCK
//

function activateInput(parentDiv){
    const todosInputs = document.querySelectorAll('.wordle-game input');
    todosInputs.forEach(input => input.disabled = true);
    parentDiv.querySelectorAll('input').forEach(input => input.disabled = false);
}


//
// ON INPUT CHAR
//

inputWordle.addEventListener("input", (event) => {
    const char = event.target.value;
    event.target.value = char.toUpperCase();
    const parentDiv = event.target.parentElement;
    const inputs = Array.from(parentDiv.querySelectorAll("input"))
    const currentIndex = inputs.indexOf(event.target);

    if (char.length === 1 && char.match(/[a-zA-Z]/)) {
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        }
        if (currentIndex === inputs.length - 1) {
            endLineCheck = true;
        }

    } else {
        event.target.value = "";
    }

});

inputWordle.addEventListener("keydown", (event) => {
    if (event.key === "Backspace") {
        const parentDiv = event.target.parentElement;
        const inputs = Array.from(parentDiv.querySelectorAll("input"))
        const currentIndex = inputs.indexOf(event.target);
        if (event.target.value === "" && currentIndex > 0) {
            inputs[currentIndex - 1].focus();
        }
    }
});


// 
// CONFIRM WORD
//  


inputWordle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && endLineCheck === true) {
        const parentDiv = event.target.parentElement;
        const tries = Array.from(inputWordle.querySelectorAll("div"));
        const tryIndex = tries.indexOf(parentDiv);
        const firstChar = parentDiv.querySelector(".first-char").value;
        const secondChar = parentDiv.querySelector(".second-char").value;
        const thirdChar = parentDiv.querySelector(".third-char").value;
        const fourthChar = parentDiv.querySelector(".fourth-char").value;
        const fifthChar = parentDiv.querySelector(".fifth-char").value;


        handleWord(firstChar, secondChar, thirdChar, fourthChar, fifthChar, parentDiv);
        if (tryIndex + 1 < tries.length) {
            activateInput(tries[tryIndex+1]);
            const nextTryInputs = tries[tryIndex + 1].querySelectorAll("input");
            if (nextTryInputs.length > 0) {
                nextTryInputs[0].focus();
            }
        }
        
    }
});

//
// WORD HANLDE
//

async function handleWord(l1, l2, l3, l4, l5, parentDiv) {

    // API VERIFICATION

    const wordToVerify = l1 + l2 + l3 + l4 + l5;
    const lettersWordToVerify = wordToVerify.split("");
    isLoading(true);
    const response = await fetch("https://words.dev-apis.com/validate-word", {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({ word: wordToVerify })
    });
    const data = await response.json();
    isLoading(false);
    setLettersHashMap(lettersWordOfDay);

    // USER ENTER VERIFICATION

    if (data.validWord === true) {
        endLineCheck = false;
        const inputs = parentDiv.querySelectorAll("input");
        inputs.forEach(input => input.disabled = true);
        if (wordToVerify === wordOfDay) {
            for (let i = 0; i < 5; i++) {
                inputs[i].classList.add("input-letter-correct");
            }
            const todosInputs = document.querySelectorAll('.wordle-game input');
            todosInputs.forEach(input => input.disabled = true);
            alert("You win!");


        } else {
            for (let i = 0; i < 5; i++) {
                if (lettersWordToVerify[i] === lettersWordOfDay[i]) {
                    const inputs = parentDiv.querySelectorAll("input");
                    inputs[i].classList.add("input-letter-correct");
                    hashMapLettersWordOfDay.delete(lettersWordToVerify[i]);
                }
            }
            for (let i = 0; i < 5; i++) {
                if (hashMapLettersWordOfDay.has(lettersWordToVerify[i])) {
                    const inputs = parentDiv.querySelectorAll("input");
                    inputs[i].classList.add("input-letter-exist");
                }
            }
            qtdTries++;
            if (qtdTries === 6) {
                alert("You loose!");
            }
        }
    } else {
        alert("Invalid Word! Try Again!")
        activateInput(parentDiv);
    }
}

//
// LOADING STATUS
//

function isLoading(status) {
    const todosInputs = document.querySelectorAll('.wordle-game input');
    if (status === true) {
        statusMessage.innerText = 'Loading...';
        todosInputs.forEach(input => input.disabled = true);
    } else {
        statusMessage.innerText = 'Try It!';
    }
}

