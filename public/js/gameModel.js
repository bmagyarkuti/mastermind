/**
 * Created by barna on 31/05/16.
 */
"use strict";

let createGameModel = function () {
    let stepsAllowed = 10;
    let colors = ['white', 'black', 'red', 'green', 'yellow', 'blue'];
    let codePattern = [];
    let startedDateTime;
    let steps;
    let gameWonEvent = createEvent();
    let gameLostEvent = createEvent();

    let init = function() {
        codePattern = [];
        for (let i = 0; i < 4; ++i) {
            codePattern.push(colors[Math.floor(Math.random() * colors.length)]);
        }
        startedDateTime = Math.round(new Date().getTime() / 1000);
        steps = 0;
    };

    let shuffle = function(array) {
        // from stackoverflow: http://stackoverflow.com/posts/2450976/revisions
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
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
            } else if (localGuesses[i] !== null){
                evals[i] = 'neither';
            }
        }
        shuffle(evals);
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

        if (isWinningCombo) {
            gameWonEvent.notify({
                results: {
                    started: startedDateTime,
                    won: Math.round(new Date().getTime() / 1000),
                    steps: steps
                }
            });
        } else if (steps === 10) {
            gameLostEvent.notify({
                codePattern: codePattern,
                results: {
                    started: startedDateTime
                }
            });
        }

        return evals;
    };

    init();

    return {
        makeStep: makeStep,
        getSteps: function() { return steps; },
        getStepsAllowed: function () { return stepsAllowed; },
        getColors: function() {return colors;},
        newGame: init,
        gameWonEvent: gameWonEvent,
        gameLostEvent: gameLostEvent
    };
};