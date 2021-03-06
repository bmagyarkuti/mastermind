/**
* Created by barna on 30/05/16.
*/
"use strict";

var createGameUI = function createGameUI(model) {
    var gameModel = model;

    var rowTemplate = '<tr>\n                            <td id=\'guessNR\' class="hidden-xs"></td>\n                            <td class="table-text"><div id="btn1"></div> </td>\n                            <td class="table-text"><div id="btn2"></div> </td>\n                            <td class="table-text"><div id="btn3"></div> </td>\n                            <td class="table-text"><div id="btn4"></div> </td>\n                            <td align="center">\n                                <table>\n                                    <tbody>\n                                    <tr>\n                                        <td><div id="eval1">x</div></td>\n                                        <td><div id="eval2">x</div></td>\n                                    </tr>\n                                    <tr>\n                                        <td><div id="eval3">x</div></td>\n                                        <td><div id="eval4">x</div></td>\n                                    </tr>\n                                    </tbody>\n                                </table>\n                            </td>\n                         </tr>';
    var wonMessageTemplate = '<div class="panel panel-default">\n                <div class="panel-heading">\n                    Congratulations!\n                </div>\n                <div class="panel-body">\n                        <h1> You cracked the code! </h1>\n                        <h2 id="transText"> Here\'s how your result compares against your own record. </h2>\n                        <p id="loading">Uploading your results and retrieving statistics... </p>\n                </div>\n            </div>';
    var lostMessageTemplate = '<div class="panel panel-default">\n                            <div class="panel-heading">\n                                Hey, so...\n                            </div>\n                            <div class="panel-body">\n                                <h1> nope, that\'s still not it. </h1>\n                                <div class="row">\n                                    <div class="col-xs-3">\n                                        <p>However, your lives ran out. The correct pattern was:</p>\n                                    </div>\n                                    <div id="colorPatternRow" class="col-xs-9">\n                                            \n                                    </div>\n                                </div>\n                            </div>\n                        </div>';
    var colorBoxTemplate = '<div></div>';
    var newGameTemplate = '<div id="gameTable" class="panel panel-default">\n                <div class="panel-heading">\n                    You have <span id="remainingSteps">10</span> turns left.\n                </div>\n\n                <div class="panel-body">\n                    <table id="bigTable" class="table">\n                        <tbody>\n                            <tr id="insertRow">\n                                <form action="step" method="POST" class="form-horizontal">\n                                    <td class="hidden-xs" id="insertCount">\n                                        #1\n                                    </td>\n\n                                    <td id="selectButtonColumn1" class="col-xs-2""> </td>\n                                    <td id="selectButtonColumn2" class="col-xs-2""> </td>\n                                    <td id="selectButtonColumn3" class="col-xs-2""> </td>\n                                    <td id="selectButtonColumn4" class="col-xs-2""> </td>\n                                    <td>\n                                        <button id="submitButton" type="submit" class="btn btn-default">\n                                            <i class="fa fa-btn fa-plus"></i>Send\n                                        </button>\n                                    </td>\n                                </form>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n        </div>';
    var $wonMessage = $(wonMessageTemplate);
    var $lostMessage = $(lostMessageTemplate);
    var alertText = ['sample'];
    var alertTemplate = '<div id="alertBox" class="alert alert-danger">\n        <strong>msg</strong>\n    </div>';
    var successTemplate = '<div id="successBox" class="alert alert-success">\n        <strong>msg</strong>\n    </div>';
    var selectedColors = [];

    var init = function init() {
        gameModel.gameWonEvent.addListener(displayWin);
        gameModel.gameLostEvent.addListener(displayLost);
    };

    var displayRow = function displayRow(nr, colors, evals) {
        var $displayRow = $(rowTemplate);
        $('td#guessNR', $displayRow).text('#' + nr);

        for (var i = 0; i < 4; ++i) {
            $('div#btn' + (i + 1), $displayRow).attr('class', 'btn btn-' + colors[i] + ' disabled btn-block');
            $('div#btn' + (i + 1), $displayRow).html('<span class="hidden-xs hidden-sm">' + colors[i] + '</span> <span class="visible-xs visible-sm">' + colors[i][0]);
            $('div#eval' + (i + 1), $displayRow).attr('class', 'btn btn-' + evals[i] + ' disabled btn-xs btn-block');
        }

        $('tr#insertRow').before($displayRow);
        $('td#insertCount').text("#" + (gameModel.getSteps() + 1));
        $('span#remainingSteps').text(gameModel.getStepsAllowed() - gameModel.getSteps());
    };

    var displayLost = function displayLost(_ref) {
        var codePattern = _ref.codePattern;

        $('tr#insertRow').hide();
        var $colorPatternRow = $('div#colorPatternRow', $lostMessage);
        for (var i = 0; i < 4; i++) {
            var $colorBox = $(colorBoxTemplate);
            $colorBox.attr('class', 'btn btn-' + codePattern[i] + ' disabled').text(codePattern[i]);
            $colorPatternRow.append($colorBox);
        }
        $('#gameTable').after($lostMessage);
    };

    var displayWin = function displayWin() {
        $('tr#insertRow').hide();
        $('#gameTable').after($wonMessage);
    };

    var showSuccessResponse = function showSuccessResponse(stats) {
        var $statistics = $('<p>You took <strong id="guesses"></strong> steps to crack the code.\n                            <span id="statistics">\n                                Usually, this takes <strong id="average"></strong> steps.\n                                The longest it ever took you to win was <strong id="worst"></strong>\n                                steps. Your best win took <strong id="best"></strong> steps.\n                            </span></p>');
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

    var showFailureResponse = function showFailureResponse() {
        $('p#loading', $wonMessage).hide();
        $('h2#transText', $wonMessage).hide();
        $wonMessage.append($(alertTemplate.replace(/msg/, "We couldn't add your scores to the leaderboard")));
        $lostMessage.append($(alertTemplate.replace(/msg/, "We couldn't add your scores to the leaderboard")));
    };

    var mineAjaxToken = function mineAjaxToken() {
        return $('meta[name="csrf-token"]').attr('content');
    };

    var onSubmitButtonClicked = function onSubmitButtonClicked() {
        $('div#alertBox').remove();
        if (selectedColors.length !== 4) {
            var $bigTable = $('table#bigTable');
            $bigTable.after($(alertTemplate.replace(/msg/, "Make sure you've specified all colors")));
            return;
        }
        var evals = gameModel.makeStep(selectedColors);
        if (gameModel.getSteps() == 3) {
            for (var i = 1; i <= 4; ++i) {
                $('div#btn-select' + i).attr('class', 'btn-group btn-block dropup');
            }
        }
        displayRow(gameModel.getSteps(), selectedColors, evals);
    };

    var startNewGame = function startNewGame() {
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

    var inputsToBootstrapDropdowns = function inputsToBootstrapDropdowns() {
        var buttonTemplate = '<div class="btn-group btn-block">\n                                <button type="button" class="btn btn-default btn-block dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n                                    <span class="hidden-xs hidden-sm">Color...</span>\n                                    <span class="visible-xs visible-sm"></span><span class="caret"></span>\n                                </button>\n                                <ul id="dropdown-elements" class="dropdown-menu">\n                                </ul>\n                              </div>';
        var buttonElementTemplate = '<li></li>';
        var $button = $(buttonTemplate);
        gameModel.getColors().forEach(function (color) {
            $('ul', $button).append($(buttonElementTemplate).html('<a href="#">' + color + '</a>'));
        });
        for (var i = 1; i <= 4; ++i) {
            var $button_temp = $button.clone().attr('id', 'btn-select' + i);
            $('td#selectButtonColumn' + i).html($button_temp);
        }

        var _loop = function _loop(_i) {
            $('div#btn-select' + _i + ' a').click(function (e) {
                e.preventDefault();
                var $activeButton = $('div#btn-select' + _i + ' button');
                $activeButton.attr('class', 'btn btn-' + $(this).text() + ' btn-block dropdown-toggle');
                $activeButton.html('<span class="hidden-xs hidden-sm">' + $(this).text() + '</span>' + '<span class="visible-xs visible-sm">' + $(this).text()[0] + '</span><span class="caret"></span>');
                selectedColors[_i - 1] = $(this).text();
            });
        };

        for (var _i = 1; _i <= 4; ++_i) {
            _loop(_i);
        }
    };

    init();

    return {
        mineAjaxToken: mineAjaxToken,
        showSuccessResponse: showSuccessResponse,
        showFailureResponse: showFailureResponse,
        onSubmitButtonClicked: onSubmitButtonClicked,
        startNewGame: startNewGame,
        inputsToBootstrapDropdowns: inputsToBootstrapDropdowns
    };
};