/**
 * Created by barna on 27/05/16.
 */

"use strict";

{
    (function () {
        var $link = $('a#login');
        var $modal = $('<div class="modal fade" id="myModal" role="dialog">\n                <div class="modal-dialog">\n                \n                  <div class="modal-content">\n                    <div class="modal-header">\n                      <button type="button" class="close" data-dismiss="modal">&times;</button>\n                      <h4 class="modal-title">Modal Header</h4>\n                    </div>\n                    <div class="modal-body">\n                    </div>\n                  </div>\n                  \n                </div>\n            </div>');
        var $error_message = $('<div class="form-group">\n                            <div class="col-md-6 col-md-offset-4">\n                                <p id="errorDisplay" class="alert-danger"></p>\n                            </div>\n                        </div>');

        // fix index.php address (add /)
        var fixURL = function fixURL() {
            if (window.location.href === 'http://webprogramozas.inf.elte.hu/hallgatok/mabpafb/mastermind/public/index.php') {
                window.location.href = 'http://webprogramozas.inf.elte.hu/hallgatok/mabpafb/mastermind/public/index.php/';
            }
        };

        var onWindowLoginButtonClicked = function onWindowLoginButtonClicked(e) {
            e.preventDefault();

            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]', $modal).attr('content')
                }
            });

            var user = $('input[name="email"]', $modal).val();
            var psw = $('input[name="password"]', $modal).val();
            var remember = $('input[name="remember"]', $modal).prop('checked');

            console.log(user, psw, remember);
            $.ajax("ajax/auth/login", {
                type: 'POST',
                dataType: 'JSON',
                data: {
                    user: user,
                    psw: psw,
                    remember: remember
                }
            }).done(function (data) {
                console.log('helo');
                if (data.success) {
                    console.log(data);
                    $modal.modal('hide');
                    var $source = $('a#main_page');
                    $('#leaderboard').load($source.attr('href') + ' #leaderboard');
                    $('#accountButtons').load($source.attr('href') + ' #accountButtons');
                } else {
                    $error_message.show();
                    $('#errorDisplay', $modal).text(data.message);
                }
            });
        };

        var replaceLoginWithJSPopUp = function replaceLoginWithJSPopUp() {
            $link.click(function (e) {
                e.preventDefault();

                $('.modal-body', $modal).load($link.attr('href') + " #content", function () {
                    $('#windowLoginButton', $modal).click(onWindowLoginButtonClicked);
                    $error_message.hide();
                    $('meta[name="csrf-token"]', $modal).after($error_message.html());
                });
                $('.modal-title', $modal).text($link.attr('title'));
                $modal.modal('show');
            });
        };

        $(document).ready(function () {
            fixURL();
            replaceLoginWithJSPopUp();
        });
    })();
}