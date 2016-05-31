/**
 * Created by barna on 31/05/16.
 */
let createGameModel = function () {
    let nrTurns = 10;
    let colors = ['white', 'black', 'red', 'green', 'yellow', 'blue'];
    let codePattern = [];
    let started = new Date().getTime();
    let won;
    let isGameWon = false;
    let steps = 0;
    let isGameOver = false;

    let init = function() {
        for (let i = 0; i < 4; ++i) {
            codePattern.push(colors[Math.floor(Math.random() * colors.length)]);
        }
    };

    /**
     *  @param {Array<string>} guesses*/
    let evaluatePattern = function (guesses) {
        let localGuesses = guesses.slice();
        let localCodePattern = codePattern.slice();
        let evals = [];
        for (let i = 0; i < 4; ++i) {
            if (localGuesses[i] === localCodePattern[i]) {
                evals[i] = "black";
                localGuesses[i] = null;
                localCodePattern[i] = null;
            }
        }
        for (let i = 0; i < 4; ++i) {
            let patternIndex;
            if (localGuesses[i] !== null && (patternIndex = localCodePattern.indexOf(localGuesses[i])) !== -1) {
                evals[i] = "white";
                localGuesses[i] = null;
                localCodePattern[patternIndex] = null;
            } else {
                evals[i] = 'neither';
            }
        }
        return evals;
    };

    let makeStep = function (guesses) {
        steps += 1;

        let evals = evaluatePattern(guesses);
        let isWinningCombo = true;
        evals.forEach(function(color) {
            if (color !== "black") {
                isWinningCombo = false;
            }
        });
        isGameWon = isWinningCombo;
        if (isGameWon) {
            won = new Date().getTime();
        }
        isGameOver = isWinningCombo || steps === 10;
        return evals;
    };

    init();

    return {
        makeStep: makeStep,
        isGameWon: function() { return isGameWon;},
        isGameOver: function() { return isGameOver; },
        getStarted: function() { return started; },
        getWon: function() { return won; },
        getSteps: function() { return steps; }
    };
};