$(document).ready(function () {
	$("#all_data").innerHTML = "ooo";
	$("#btn_get").click(function () {
		getAllData();
	});
});

function getAllData(){
    $.ajax({
        url: "/getAllData",
        type: "GET",
        success: function (res) {
            document.getElementById("all_data").innerHTML = JSON.stringify(res);
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