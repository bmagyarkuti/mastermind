/**
 * Created by barna on 30/05/16.
 */
"use strict";
{
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
                $('div#btn' + (i + 1), $displayRow).html('<span class="hidden-xs hidden-sm">' + colors[i] +
                                                         '</span> <span class="visible-xs visible-sm">' + colors[i][1]);
                $('div#eval'+ (i + 1), $displayRow).attr('class', 'btn btn-' + evals[i] +' disabled btn-xs btn-block')
            }

            $('tr#insertRow').before($displayRow);
            $('td#insertCount').text("#" + (gameModel.getSteps() + 1));
            $('span#remainingSteps').text((gameModel.getStepsAllowed() - gameModel.getSteps()));
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

        gameUI.gameWonEvent.addListener(function() {
            alert("Congrats, you won!");
        })
    });
}