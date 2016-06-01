/**
* Created by barna on 30/05/16.
*/
"use strict";
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
    let wonMessageTemplate = `<div class="panel panel-default">
                <div class="panel-heading">
                    Congratulations!
                </div>
                <div class="panel-body">
                        <h1> You cracked the code! </h1>
                        <h2 id="transText"> Here's how your result compares against your own record. </h2>
                        <p id="loading">Uploading your results and retrieving statistics... </p>
                </div>
            </div>`;
    let lostMessageTemplate = `<div class="panel panel-default">
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
                        </div>`;
    let colorBoxTemplate = `<div></div>`;
    let newGameTemplate = `<div id="gameTable" class="panel panel-default">
                <div class="panel-heading">
                    You have <span id="remainingSteps">10</span> turns left.
                </div>

                <div class="panel-body">
                    <table id="bigTable" class="table">
                        <tbody>
                            <tr id="insertRow">
                                <form action="step" method="POST" class="form-horizontal">
                                    <td class="hidden-xs" id="insertCount">
                                        #1
                                    </td>

                                    <td id="selectButtonColumn1" class="col-xs-2""> </td>
                                    <td id="selectButtonColumn2" class="col-xs-2""> </td>
                                    <td id="selectButtonColumn3" class="col-xs-2""> </td>
                                    <td id="selectButtonColumn4" class="col-xs-2""> </td>
                                    <td>
                                        <button id="submitButton" type="submit" class="btn btn-default">
                                            <i class="fa fa-btn fa-plus"></i>Send
                                        </button>
                                    </td>
                                </form>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </div>`;
    let $wonMessage = $(wonMessageTemplate);
    let $lostMessage = $(lostMessageTemplate);
    let alertText = ['sample'];
    let alertTemplate = `<div id="alertBox" class="alert alert-danger">
        <strong>Whoops! Something went wrong!</strong>
        <br><br>
        <ul>
                <li>msg</li>
        </ul>
    </div>`;
    let successTemplate = `<div id="successBox" class="alert alert-success">
        <strong>Yep, I did it!</strong>
        <br><br>
        <ul>
                <li>msg</li>
        </ul>
    </div>`;
    let selectedColors = [];

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
                                                     '</span> <span class="visible-xs visible-sm">' + colors[i][0]);
            $('div#eval'+ (i + 1), $displayRow).attr('class', 'btn btn-' + evals[i] +' disabled btn-xs btn-block')
        }

        $('tr#insertRow').before($displayRow);
        $('td#insertCount').text("#" + (gameModel.getSteps() + 1));
        $('span#remainingSteps').text((gameModel.getStepsAllowed() - gameModel.getSteps()));
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
            $wonMessage.append(successTemplate.replace(/msg/, "We have successfully added your scores to the leaderboard."));
            $lostMessage.append(successTemplate.replace(/msg/, "We have successfully added your scores to the leaderboard."));
        } else {
            $('p#loading', $wonMessage).hide();
        }
    };

    let showFailureResponse = function () {
        $('p#loading', $wonMessage).hide();
        $('h2#transText', $wonMessage).hide();
        $wonMessage.append($(alertTemplate.replace(/msg/, "We couldn't add your scores to the leaderboard")));
        $lostMessage.append($(alertTemplate.replace(/msg/, "We couldn't add your scores to the leaderboard")));
    };

    let mineAjaxToken = function() {
        return $('meta[name="csrf-token"]').attr('content');
    };

    let onSubmitButtonClicked = function() {
        $('div#alertBox').remove();
        if (selectedColors.length !== 4) {
            let $bigTable = $('table#bigTable');
            $bigTable.after($(alertTemplate.replace(/msg/, "Make sure you've specified all colors")));
            return;
        }
        let evals = gameModel.makeStep(selectedColors);
        if (gameModel.getSteps() == 3) {
            for (let i = 1; i <=4; ++i) {
                $('div#btn-select' + i).attr('class', 'btn-group btn-block dropup');
            }
        }
        displayRow(gameModel.getSteps(), selectedColors, evals);
    };

    let startNewGame = function () {
        $('div#columnContainer').html(newGameTemplate);
        inputsToBootstrapDropdowns();
        $('button#submitButton').click(function (e) {
            e.preventDefault();
            onSubmitButtonClicked();
        });
        $wonMessage = $(wonMessageTemplate);
        $lostMessage = $(lostMessageTemplate);
        selectedColors = [];
        model.newGame();
    };

    let inputsToBootstrapDropdowns = function() {
        let buttonTemplate = `<div class="btn-group btn-block">
                                <button type="button" class="btn btn-default btn-block dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span class="hidden-xs hidden-sm">Color...</span>
                                    <span class="visible-xs visible-sm"></span><span class="caret"></span>
                                </button>
                                <ul id="dropdown-elements" class="dropdown-menu">
                                </ul>
                              </div>`;
        let buttonElementTemplate = `<li></li>`;
        let $button = $(buttonTemplate);
        gameModel.getColors().forEach(function(color) {
            $('ul', $button).append($(buttonElementTemplate).html('<a href="#">'+ color + '</a>'));
        });
        for (let i = 1; i <= 4; ++i){
            let $button_temp = $button.clone().attr('id', 'btn-select' + i);
            $('td#selectButtonColumn' + i).html($button_temp);
        }
        for (let i = 1; i <= 4; ++i) {
            $('div#btn-select' + i + ' a').click(function() {
                let $activeButton = $('div#btn-select' + i + ' button');
                $activeButton.attr('class', 'btn btn-' + $(this).text() + ' btn-block dropdown-toggle');
                $activeButton.html('<span class="hidden-xs hidden-sm">' + $(this).text() + '</span>' +
                    '<span class="visible-xs visible-sm">' + $(this).text()[0] + '</span><span class="caret"></span>');
                selectedColors[i - 1] = $(this).text();
            })
        }
    };

    init();

    return {
        mineAjaxToken: mineAjaxToken,
        showSuccessResponse: showSuccessResponse,
        showFailureResponse: showFailureResponse,
        onSubmitButtonClicked: onSubmitButtonClicked,
        startNewGame: startNewGame,
        inputsToBootstrapDropdowns : inputsToBootstrapDropdowns
    };
};