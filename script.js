const inputWordle = document.querySelector(".wordle-game");


inputWordle.addEventListener("input", (event) => {
    const char = event.target.value;
    const parentDiv = event.target.parentElement;
    const inputs = Array.from(parentDiv.querySelectorAll("input"))
    const currentIndex = inputs.indexOf(event.target);

    if (char.length === 1 && char.match(/[a-zA-Z]/)) {
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        }
        if (currentIndex === inputs.length - 1) {
            console.log("Fim linha");
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