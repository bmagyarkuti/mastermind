/**
 * Created by barna on 27/05/16.
 */
$(document).ready(function() {
    // fox index.php address (add /)
    if (window.location.href == 'http://webprogramozas.inf.elte.hu/hallgatok/mabpafb/mastermind/public/index.php') {
        window.location.href = 'http://webprogramozas.inf.elte.hu/hallgatok/mabpafb/mastermind/public/index.php/';
    }

    // for (let i = 1; i <= 4; ++i) {
    //     $("#" + i).change(function() {
    //         let selectedColor = $("#" + i + " option:selected").text();
    //         $("#" + i).siblings('.btn').attr('class', 'btn dropdown-toogle ' + selectedColor);
    //         $("#" + i).data('style', selectedColor);
    //     })
    // }
});