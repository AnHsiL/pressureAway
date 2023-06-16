$(document).ready(function () {
	$("#btn_get").click(function () {
		getAllData();
	});
    $("#btn_set").click(function(){
        setPersonalTask($("#input_date").val(), $("#input_name").val(), $("#input_dataToChange").val());
    })
});

function getAllData(){
    $.ajax({
        url: "/getAllData",
        type: "POST",
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

function setPersonalTask(date, name, dataToChange){

    $.ajax({
        url: "/getAllData",
        type: "POST",
        success: function (res) {
            for(var i = 0; i < res.project.daily_task.length; i++){
                if(date == res.project.daily_task[i].today){
                    for(var j = 0; j < res.project.employee_num; j++){
                        if(name == res.project.daily_task[i].each_task[j].name){
                            changePersonalTask(i, j, dataToChange);
                            break;
                        }
                    }
                    break;
                }
            }
        },
        error: function (err) {
            swal.fire({
                title: "getAllData_error",
                text: err,
                icon: "error",
            }).then(() => {
                location.reload();
            });
        }
    });
    
}
function changePersonalTask(date, name, dataToChange){

    var data = {
        date : date,
        name : name,
        dataToChange : dataToChange
    };

    $.ajax({
        url: "/setPersonalTask",
        type: "POST",
        data: data,
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