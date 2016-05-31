/**
 * Created by barna on 30/05/16.
 */
"use strict";
{
    let createGameUI = function(model) {
        let gameModel = model;

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
        let $wonMessage = $(`<div class="panel panel-default">
                    <div class="panel-heading">
                        Congratulations!
                    </div>
                    <div class="panel-body">
                            <h1> You cracked the code! </h1>
                            <h2 id="transText"> Here's how your result compares against your own record. </h2>
                            <p id="loading">Uploading your results and retrieving statistics... </p>
                    </div>
                </div>`);
        let $lostMessage = $(`<div class="panel panel-default">
                                <div class="panel-heading">
                                    Hey, so...
                                </div>
                                <div class="panel-body">
                                    <h1> nope, that's still not it. </h1>
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <p>However, your lives ran out. The correct pattern was:</p>
                                        </div>
                                        <div id="colorPatternRow" class="col-xs-9">
                                                
                                        </div>
                                    </div>
                                </div>
                            </div>`);
        let colorBoxTemplate = `<div></div>`;

        let init = function() {
            gameModel.gameWonEvent.addListener(displayWin);
            gameModel.gameLostEvent.addListener(displayLost);
        };

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

        let displayLost =  function({codePattern}) {
            $('tr#insertRow').hide();
            let $colorPatternRow = $('div#colorPatternRow', $lostMessage);
            for (let i = 0; i < 4; i++) {
                let $colorBox = $(colorBoxTemplate);
                $colorBox.attr('class', 'btn btn-'+ codePattern[i] +' disabled').text(codePattern[i]);
                $colorPatternRow.append($colorBox);
            }
            $('#gameTable').after($lostMessage);
        };

        let displayWin = function () {
            $('tr#insertRow').hide();
            $('#gameTable').after($wonMessage);
        };


        let showSuccessResponse = function(stats) {
            let $statistics = $(`<p>You took <strong id="guesses"></strong> steps to crack the code.
                                <span id="statistics">
                                    Usually, this takes <strong id="average"></strong> steps.
                                    The longest it ever took you to win was <strong id="worst"></strong>
                                    steps. Your best win took <strong id="best"></strong> steps.
                                </span></p>`);
            $('strong#guesses', $statistics).text(gameModel.getSteps());
            if (stats.count > 1) {
                $('strong#average', $statistics).text(stats.the_stats.average);
                $('strong#worst', $statistics).text(stats.the_stats.worst);
                $('strong#best', $statistics).text(stats.the_stats.best);
                $('p#loading', $wonMessage).html($statistics.html());
                $wonMessage.append($(`<p class="alert-success">We have successfully added your scores to the leaderboard.</p>`));
                $lostMessage.append($(`<p class="alert-success">We have successfully added your scores to the leaderboard.</p>`));
            } else {
                $('p#loading', $wonMessage).hide();
            }
        };

        let showFailureResponse = function () {
            $('p#loading', $wonMessage).hide();
            $('h2#transText', $wonMessage).hide();
            $wonMessage.append($(`<p class="alert-danger">We couldn't add your scores to the leaderboard.</p>`));
            $lostMessage.append($(`<p class="alert-danger">We couldn't add your scores to the leaderboard.</p>`));
        };

        let mineAjaxToken = function() {
            return $('meta[name="csrf-token"]').attr('content');
        };

        let onSubmitButtonClicked = function() {
            let colors = collectSelections();
            let evals = gameModel.makeStep(colors);
            displayRow(gameModel.getSteps(), colors, evals);
        };

        init();

        return {
            mineAjaxToken: mineAjaxToken,
            showSuccessResponse: showSuccessResponse,
            showFailureResponse: showFailureResponse,
            onSubmitButtonClicked: onSubmitButtonClicked
        };
    };

    $(document).ready(function () {
        let gameModel = createGameModel();
        let gameUI = createGameUI(gameModel);
        let persistence = createGamePersistence(gameModel, gameUI.mineAjaxToken());

        $('button#submitButton').click(function (e) {
            e.preventDefault();
            gameUI.onSubmitButtonClicked();
        });

        persistence.successfullySavedEvent.addListener(function(stats) {
            gameUI.showSuccessResponse(stats);
        });

        persistence.couldNotSaveEvent.addListener(function() {
            gameUI.showFailureResponse();
        })
    });
}