/**
 * Created by barna on 30/05/16.
 */
"use strict";

{
    (function () {
        var createGameUI = function createGameUI(model) {
            var gameModel = model;

            var rowTemplate = '<tr>\n                                <td id=\'guessNR\' class="hidden-xs"></td>\n                                <td class="table-text"><div id="btn1"></div> </td>\n                                <td class="table-text"><div id="btn2"></div> </td>\n                                <td class="table-text"><div id="btn3"></div> </td>\n                                <td class="table-text"><div id="btn4"></div> </td>\n                                <td align="center">\n                                    <table>\n                                        <tbody>\n                                        <tr>\n                                            <td><div id="eval1">x</div></td>\n                                            <td><div id="eval2">x</div></td>\n                                        </tr>\n                                        <tr>\n                                            <td><div id="eval3">x</div></td>\n                                            <td><div id="eval4">x</div></td>\n                                        </tr>\n                                        </tbody>\n                                    </table>\n                                </td>\n                             </tr>';
            var $wonMessage = $('<div class="panel panel-default">\n                    <div class="panel-heading">\n                        Congratulations!\n                    </div>\n                    <div class="panel-body">\n                            <h1> You cracked the code! </h1>\n                            <h2 id="transText"> Here\'s how your result compares against your own record. </h2>\n                            <p id="loading">Uploading your results and retrieving statistics... </p>\n                    </div>\n                </div>');
            var $lostMessage = $('<div class="panel panel-default">\n                                <div class="panel-heading">\n                                    Hey, so...\n                                </div>\n                                <div class="panel-body">\n                                    <h1> nope, that\'s still not it. </h1>\n                                    <div class="row">\n                                        <div class="col-xs-3">\n                                            <p>However, your lives ran out. The correct pattern was:</p>\n                                        </div>\n                                        <div id="colorPatternRow" class="col-xs-9">\n                                                \n                                        </div>\n                                    </div>\n                                </div>\n                            </div>');
            var colorBoxTemplate = '<div></div>';

            var init = function init() {
                gameModel.gameWonEvent.addListener(displayWin);
                gameModel.gameLostEvent.addListener(displayLost);
            };

            var displayRow = function displayRow(nr, colors, evals) {
                var $displayRow = $(rowTemplate);
                $('td#guessNR', $displayRow).text('#' + nr);

                for (var i = 0; i < 4; ++i) {
                    $('div#btn' + (i + 1), $displayRow).attr('class', 'btn btn-' + colors[i] + ' disabled btn-block');
                    $('div#btn' + (i + 1), $displayRow).html('<span class="hidden-xs hidden-sm">' + colors[i] + '</span> <span class="visible-xs visible-sm">' + colors[i][1]);
                    $('div#eval' + (i + 1), $displayRow).attr('class', 'btn btn-' + evals[i] + ' disabled btn-xs btn-block');
                }

                $('tr#insertRow').before($displayRow);
                $('td#insertCount').text("#" + (gameModel.getSteps() + 1));
                $('span#remainingSteps').text(gameModel.getStepsAllowed() - gameModel.getSteps());
            };

            var collectSelections = function collectSelections() {
                var selectedColors = [];
                for (var i = 1; i <= 4; ++i) {
                    selectedColors.push($('select[name=color' + i + ']').find(":selected").text());
                }
                return selectedColors;
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
                var $statistics = $('<p>You took <strong id="guesses"></strong> steps to crack the code.\n                                <span id="statistics">\n                                    Usually, this takes <strong id="average"></strong> steps.\n                                    The longest it ever took you to win was <strong id="worst"></strong>\n                                    steps. Your best win took <strong id="best"></strong> steps.\n                                </span></p>');
                $('strong#guesses', $statistics).text(gameModel.getSteps());
                if (stats.count > 1) {
                    $('strong#average', $statistics).text(stats.the_stats.average);
                    $('strong#worst', $statistics).text(stats.the_stats.worst);
                    $('strong#best', $statistics).text(stats.the_stats.best);
                    $('p#loading', $wonMessage).html($statistics.html());
                    $wonMessage.append($('<p class="alert-success">We have successfully added your scores to the leaderboard.</p>'));
                    $lostMessage.append($('<p class="alert-success">We have successfully added your scores to the leaderboard.</p>'));
                } else {
                    $('p#loading', $wonMessage).hide();
                }
            };

            var showFailureResponse = function showFailureResponse() {
                $('p#loading', $wonMessage).hide();
                $('h2#transText', $wonMessage).hide();
                $wonMessage.append($('<p class="alert-danger">We couldn\'t add your scores to the leaderboard.</p>'));
                $lostMessage.append($('<p class="alert-danger">We couldn\'t add your scores to the leaderboard.</p>'));
            };

            var mineAjaxToken = function mineAjaxToken() {
                return $('meta[name="csrf-token"]').attr('content');
            };

            var onSubmitButtonClicked = function onSubmitButtonClicked() {
                var colors = collectSelections();
                var evals = gameModel.makeStep(colors);
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
            var gameModel = createGameModel();
            var gameUI = createGameUI(gameModel);
            var persistence = createGamePersistence(gameModel, gameUI.mineAjaxToken());

            $('button#submitButton').click(function (e) {
                e.preventDefault();
                gameUI.onSubmitButtonClicked();
            });

            persistence.successfullySavedEvent.addListener(function (stats) {
                gameUI.showSuccessResponse(stats);
            });

            persistence.couldNotSaveEvent.addListener(function () {
                gameUI.showFailureResponse();
            });
        });
    })();
}