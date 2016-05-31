/**
 * Created by barna on 30/05/16.
 */
"use strict";
// {
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
    
    let createGameUI = function() {
        let gameModel = createGameModel();
        let rowTemplate = `<tr>
                                <td id='guessNR' class="hidden-xs"></td>
                                <td class="table-text"><div id="btn1"></div> </td>
                                <td class="table-text"><div id="btn2"></div> </td>
                                <td class="table-text"><div id="btn3"></div> </td>
                                <td class="table-text"><div id="btn4"></div> </td>
                                <td align="center">
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td><div id="eval1">x</div></td>
                                            <td><div id="eval2">x</div></td>
                                        </tr>
                                        <tr>
                                            <td><div id="eval3">x</div></td>
                                            <td><div id="eval4">x</div></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                             </tr>`;

        let displayRow = function(nr, colors, evals){
            var $displayRow = $(rowTemplate);
            $('td#guessNR', $displayRow).text('#' + nr);

            for (let i = 0; i < 4; ++i) {
                $('div#btn' + (i + 1), $displayRow).attr('class', 'btn btn-' + colors[i]+ ' disabled btn-block');
                $('div#btn' + (i + 1), $displayRow).html('<span class="hidden-xs hidden-sm">' + colors[i] + '</span> <span class="visible-xs visible-sm">' + colors[i][1]);
                $('div#eval'+ (i + 1), $displayRow).attr('class', 'btn btn-' + evals[i] +' disabled btn-xs btn-block')
            }

            $('tr#insertRow').before($displayRow);
        };

        let collectSelections = function () {
            let selectedColors = [];
            for (let i = 1; i <= 4; ++i) {
                selectedColors.push($('select[name=color' + i).find(":selected").text())
            }
            return selectedColors;
        };

        let collectEvals = function(guesses) {
            return gameModel.makeStep(guesses);
        };

        return {
            displayRow: displayRow,
            collectSelections: collectSelections,
            collectEvals: collectEvals,
            getSteps: function() { return gameModel.getSteps(); }
        };
    };

    let gameUI = createGameUI();

    $(document).ready(function () {
        $('button#submitButton').click(function (e) {
            e.preventDefault();
            let colors = gameUI.collectSelections();
            let evals = gameUI.collectEvals(colors);
            gameUI.displayRow(gameUI.getSteps(), colors, evals);
        });
    });
// }