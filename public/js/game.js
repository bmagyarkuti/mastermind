/**
 * Created by barna on 30/05/16.
 */
{
    let createGameModel = function () {
        let nrTurns = 10;
        let colors = ['white', 'black', 'red', 'green', 'yellow', 'blue'];
        let codePattern = [];
        let started = new Date().getTime();
        let won;
        let isGameWon = false;
        let steps = 0;
        let isGameOver = false;
        let evals = [];
        
        let init = function() {
            for (let i = 0; i < 4; ++i) {
                codePattern.push(colors[Math.floor(Math.random() * colors.length)]);
            }
        };

        /**
         *  @param {Array<string>} guesses*/
        let evaluatePattern = function (guesses) {
            let localCodePattern = codePattern.slice();
            evals = [];
            for (let i = 0; i < 4; ++i) {
                if (guesses[i] === localCodePattern[i]) {
                    evals[i] = "black";
                    guesses[i] = null;
                    localCodePattern[i] = null;
                }
            }
            for (let i = 0; i < 4; ++i) {
                let patternIndex;
                if (guesses[i] !== null && (patternIndex = localCodePattern.indexOf(guesses[i])) !== -1) {
                    evals[i] = "white";
                    guesses[i] = null;
                    localCodePattern[patternIndex] = null;
                } else {
                    evals[i] = 'neither';
                }
            }
        };

        let makeStep = function (guesses) {
            steps += 1;

            evaluatePattern(guesses);
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
        };
        
        init();
        
        return {
            makeStep: makeStep,
            iGameWon: isGameWon,
            isGameOver: isGameOver,
            evals: evals,
            started: started,
            won: won,
            steps: steps
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
                $('div#btn' + (i + 1), $displayRow).text(colors[i]);
                $('div#eval'+ (i + 1), $displayRow).attr('class', 'btn btn-' + evals[i] +' disabled btn-xs btn-block')
            }

            $('tr#insertRow').before($displayRow);
        };

        return {
            displayRow: displayRow
        };
    };

    let gameUI = createGameUI();

    $(document).ready(function () {
        $('button#submitButton').click(function (e) {
            e.preventDefault();
            gameUI.displayRow(1, ['red', 'green', 'blue', 'black'], ['white', 'neither', 'neither', 'black']);
        });
    })
}