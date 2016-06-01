/**
 * Created by barna on 31/05/16.
 */
"use strict";

var createGameModel = function createGameModel() {
    var stepsAllowed = 10;
    var colors = ['white', 'black', 'red', 'green', 'yellow', 'blue'];
    var codePattern = [];
    var startedDateTime = void 0;
    var steps = void 0;
    var gameWonEvent = createEvent();
    var gameLostEvent = createEvent();

    var init = function init() {
        codePattern = [];
        for (var i = 0; i < 4; ++i) {
            codePattern.push(colors[Math.floor(Math.random() * colors.length)]);
        }
        startedDateTime = Math.round(new Date().getTime() / 1000);
        steps = 0;
    };

    var shuffle = function shuffle(array) {
        // from stackoverflow: http://stackoverflow.com/posts/2450976/revisions
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;

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
    var evaluatePattern = function evaluatePattern(guesses) {
        var localGuesses = guesses.slice();
        var localCodePattern = codePattern.slice();
        var evals = [];
        for (var i = 0; i < 4; ++i) {
            if (localGuesses[i] === localCodePattern[i]) {
                evals[i] = "black";
                localGuesses[i] = null;
                localCodePattern[i] = null;
            }
        }
        for (var _i = 0; _i < 4; ++_i) {
            var patternIndex = void 0;
            if (localGuesses[_i] !== null && (patternIndex = localCodePattern.indexOf(localGuesses[_i])) !== -1) {
                evals[_i] = "white";
                localGuesses[_i] = null;
                localCodePattern[patternIndex] = null;
            } else if (localGuesses[_i] !== null) {
                evals[_i] = 'neither';
            }
        }
        shuffle(evals);
        return evals;
    };

    var makeStep = function makeStep(guesses) {
        steps += 1;

        var evals = evaluatePattern(guesses);
        var isWinningCombo = true;
        evals.forEach(function (color) {
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
        getSteps: function getSteps() {
            return steps;
        },
        getStepsAllowed: function getStepsAllowed() {
            return stepsAllowed;
        },
        getColors: function getColors() {
            return colors;
        },
        newGame: init,
        gameWonEvent: gameWonEvent,
        gameLostEvent: gameLostEvent
    };
};