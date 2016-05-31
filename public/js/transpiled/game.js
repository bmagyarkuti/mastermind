/**
 * Created by barna on 30/05/16.
 */
"use strict";
// {
var createGameModel = function createGameModel() {
    var nrTurns = 10;
    var colors = ['white', 'black', 'red', 'green', 'yellow', 'blue'];
    var codePattern = [];
    var started = new Date().getTime();
    var won = void 0;
    var _isGameWon = false;
    var steps = 0;
    var _isGameOver = false;

    var init = function init() {
        for (var i = 0; i < 4; ++i) {
            codePattern.push(colors[Math.floor(Math.random() * colors.length)]);
        }
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
            } else {
                evals[_i] = 'neither';
            }
        }
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
        _isGameWon = isWinningCombo;
        if (_isGameWon) {
            won = new Date().getTime();
        }
        _isGameOver = isWinningCombo || steps === 10;
        return evals;
    };

    init();

    return {
        makeStep: makeStep,
        isGameWon: function isGameWon() {
            return _isGameWon;
        },
        isGameOver: function isGameOver() {
            return _isGameOver;
        },
        getStarted: function getStarted() {
            return started;
        },
        getWon: function getWon() {
            return won;
        },
        getSteps: function getSteps() {
            return steps;
        }
    };
};

var createGameUI = function createGameUI() {
    var gameModel = createGameModel();
    var rowTemplate = '<tr>\n                                <td id=\'guessNR\' class="hidden-xs"></td>\n                                <td class="table-text"><div id="btn1"></div> </td>\n                                <td class="table-text"><div id="btn2"></div> </td>\n                                <td class="table-text"><div id="btn3"></div> </td>\n                                <td class="table-text"><div id="btn4"></div> </td>\n                                <td align="center">\n                                    <table>\n                                        <tbody>\n                                        <tr>\n                                            <td><div id="eval1">x</div></td>\n                                            <td><div id="eval2">x</div></td>\n                                        </tr>\n                                        <tr>\n                                            <td><div id="eval3">x</div></td>\n                                            <td><div id="eval4">x</div></td>\n                                        </tr>\n                                        </tbody>\n                                    </table>\n                                </td>\n                             </tr>';

    var displayRow = function displayRow(nr, colors, evals) {
        var $displayRow = $(rowTemplate);
        $('td#guessNR', $displayRow).text('#' + nr);

        for (var i = 0; i < 4; ++i) {
            $('div#btn' + (i + 1), $displayRow).attr('class', 'btn btn-' + colors[i] + ' disabled btn-block');
            $('div#btn' + (i + 1), $displayRow).html('<span class="hidden-xs hidden-sm">' + colors[i] + '</span> <span class="visible-xs visible-sm">' + colors[i][1]);
            $('div#eval' + (i + 1), $displayRow).attr('class', 'btn btn-' + evals[i] + ' disabled btn-xs btn-block');
        }

        $('tr#insertRow').before($displayRow);
    };

    var collectSelections = function collectSelections() {
        var selectedColors = [];
        for (var i = 1; i <= 4; ++i) {
            selectedColors.push($('select[name=color' + i).find(":selected").text());
        }
        return selectedColors;
    };

    var collectEvals = function collectEvals(guesses) {
        return gameModel.makeStep(guesses);
    };

    return {
        displayRow: displayRow,
        collectSelections: collectSelections,
        collectEvals: collectEvals,
        getSteps: function getSteps() {
            return gameModel.getSteps();
        }
    };
};

var gameUI = createGameUI();

$(document).ready(function () {
    $('button#submitButton').click(function (e) {
        e.preventDefault();
        var colors = gameUI.collectSelections();
        var evals = gameUI.collectEvals(colors);
        gameUI.displayRow(gameUI.getSteps(), colors, evals);
    });
});
// }