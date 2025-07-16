const inputWordle = document.querySelector(".wordle-game");
const statusMessage = document.querySelector(".wordle-header-status-message");

let endLineCheck = false;

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
            inputs[currentIndex-1].focus();
        }
    }
});



// OPERAÇÃO AO APERTAR ENTER
// - IR PARA PRÓXIMA LINHA
// - VERIFICAR COM A API SE A PALAVRA EXISTE 


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
        
        
        handleWord(firstChar, secondChar, thirdChar, fourthChar, fifthChar);
        if (tryIndex + 1 < tries.length) {
            const nextTryInputs = tries[tryIndex+1].querySelectorAll("input");
            if (nextTryInputs.length > 0) {
                nextTryInputs[0].focus();
            }
        }

    }
})

async function handleWord(l1,l2,l3,l4,l5) {
    const wordToVerify = l1+l2+l3+l4+l5;
    statusMessage.innerText = 'Loading...';
    const response = await fetch("https://words.dev-apis.com/validate-word", {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({word: wordToVerify})
    });
    const data = await response.json();
    statusMessage.innerText = 'Try It!';
    console.log(data);

}