/**
 * Created by barna on 27/05/16.
 */

// fix index.php address (add /)
{
    let $link = $('a#login');
    let $modal = $(`<div class="modal fade" id="myModal" role="dialog">
                <div class="modal-dialog">
                
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">Modal Header</h4>
                    </div>
                    <div class="modal-body">
                    </div>
                  </div>
                  
                </div>
            </div>`);
    let $error_message = $(`<div class="form-group">
                            <div class="col-md-6 col-md-offset-4">
                                <p id="errorDisplay" class="alert-danger"></p>
                            </div>
                        </div>`);

    let fixURL = function () {
        if (window.location.href === 'http://webprogramozas.inf.elte.hu/hallgatok/mabpafb/mastermind/public/index.php') {
            window.location.href = 'http://webprogramozas.inf.elte.hu/hallgatok/mabpafb/mastermind/public/index.php/';
        }
    };

    let onWindowLoginButtonClicked = function (e) {
        e.preventDefault();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]', $modal).attr('content')
            }
        });

        let user = $('input[name="email"]', $modal).val();
        let psw = $('input[name="password"]', $modal).val();
        let remember = $('input[name="remember"]', $modal).prop('checked');

        console.log(user, psw, remember);
        $.ajax("ajax/auth/login", {
            type: 'POST',
            dataType: 'JSON',
            data: {
                user: user,
                psw: psw,
                remember: remember
            }
        }).done(function (data){
            console.log('helo');
            if (data.success){
                console.log(data);
                $modal.modal('hide');
                $source = $('#main_page');
                $('#leaderboard').load($source.attr('href') + ' #leaderboard');
                $('#accountButtons').load($source.attr('href') + ' #accountButtons');
            } else {
                $error_message.show();
                $('#errorDisplay', $modal).text(data.message);
            }
        });
    };

    let replaceLoginWithJSPopUp = function () {
        $link.click(function (e) {
            e.preventDefault();

            $('.modal-body', $modal).load($link.attr('href') + " #content", function() {
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
        console.log($link);
    });
}
