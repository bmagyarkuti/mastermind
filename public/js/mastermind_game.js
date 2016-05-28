/**
 * Created by barna on 27/05/16.
 */
$(document).ready(function() {
    for (let i = 1; i <= 4; ++i) {
        $("#" + i).change(function() {
            let selectedColor = $("#" + i + " option:selected").text();
            $("#" + i).siblings('.btn').attr('class', 'btn dropdown-toogle ' + selectedColor);
            $("#" + i).data('style', selectedColor);
        })
    }
});