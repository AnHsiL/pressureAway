$(document).ready(function () {
    $("#a").innerHTML;
    $("#btn_try").click(function () {
        fix();
    })
});

function fix() {
    $.ajax({
        url: "/getAllData",
        type: "POST",
        success: function (res) {
            document.getElementById("a").innerHTML = "c";
        },
        error: function (err) {
            swal.fire({
                title: "Error",
                text: err,
                icon: "error",
            }).then(() => {
                location.reload();
            });
        }
    });
}
