$(document).ready(function () {
    getOriSched();

    // $("#btn_set").click(function(){
    //     setPersonalTask($("#input_date").val(), $("#input_name").val(), $("#input_dataToChange").val());
    // })
});

function getOriSched() {
    $.ajax({
        url: "/getOriSched",
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

function getAllData() {
    $.ajax({
        url: "/getAllData",
        type: "POST",
        success: function (res) {
            document.getElementById("all_data").innerHTML = JSON.stringify(formatSched(res));
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

function setPersonalTask(date, name, dataToChange) {

    $.ajax({
        url: "/getAllData",
        type: "POST",
        success: function (res) {
            for (var i = 0; i < res.project.daily_task.length; i++) {
                if (date == res.project.daily_task[i].today) {
                    for (var j = 0; j < res.project.employee_num; j++) {
                        if (name == res.project.daily_task[i].each_task[j].name) {
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
function changePersonalTask(date, name, dataToChange) {

    var data = {
        date: date,
        name: name,
        dataToChange: dataToChange
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
function getNewSched() { // page 2
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

function dateDiff(Date1_, Date2_) {
    var Date1 = [Date1_.slice(0, 4), Date1_.slice(4, 6), Date1_.slice(6, 8)].join('-')
    var Date2 = [Date2_.slice(0, 4), Date2_.slice(4, 6), Date2_.slice(6, 8)].join('-')

    var date1 = new Date(Date1);
    var date2 = new Date(Date2);
    var milliseconds_Time = date2.getTime() - date1.getTime();
    return milliseconds_Time / (1000 * 3600 * 24);
};