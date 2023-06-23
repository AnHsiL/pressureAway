$(document).ready(function () {
    getPressureScore();
    getOriSched();
});

function toSched() {
    window.location.href = "./schedule.html";
}

function getOriSched() {
    $.ajax({
        url: "/getOriSched",
        type: "POST",
        success: function (res) {
            drawGantt(res);
            console.log(res);
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
            return res;
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

function drawGantt(data) {
    var dataToGantt = { "data": [], "links": [] };
    var oriSched = data;

    for (var i = 1; i <= oriSched.length; i++) {
        var eachEmployee = {
            "id": String(i),
            "text": oriSched[i - 1].name,
            "type": "project",
            "open": true
        };
        dataToGantt.data.push(eachEmployee);

        for (var j = 1; j <= oriSched[i - 1].task.length; j++) {
            task = oriSched[i - 1].task[j - 1];
            var eachTask = {
                "id": String(i) + "-" + String(j),
                "text": task.taskName,
                "start_date": task.start[0],
                "duration": task.duration,
                "parent": String(i),
                "type": "task",
            };
            dataToGantt.data.push(eachTask);
        }
    }
    sessionStorage.setItem("oriSched", JSON.stringify(dataToGantt));

    gantt.init("ori_gantt_here");
    gantt.parse(dataToGantt);
}

function setPersonalTask(date, name, dataToChange) {

    $.ajax({
        url: "/setPersonalTask",
        type: "POST",
        success: function (res) {
            for (var i = 0; i < res.project.daily_task.length; i++) {
                if (date == res.project.daily_task[i].today) {
                    for (var j = 0; j < res.project.employee_num; j++) {
                        if (name == res.project.daily_task[i].employee[j].name) {
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
        data: JSON.stringify(data),
        success: function (res) {
            swal.fire({
                title: "Success",
                text: "Data Changed",
                icon: "success",
            }).then(() => {
                location.reload();
            });
            // alert("Data Changed");
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

function setNewSched(dataToChange) {

    $.ajax({
        url: "/getNewSched",
        type: "POST",
        success: function (res) {
            setNewSchedData(dataToChange);
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
function setNewSchedData(dataToChange) {

    var data = {
        dataToChange: dataToChange
    };

    $.ajax({
        url: "/setNewSched",
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

function getPressureScore() {
    var date = new Date();
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1);
    if (month.length < 2) month = "0" + month;
    var day = String(date.getDate());
    if (day.length < 2) day = "0" + day;
    var dateToAsk = year + month + day;

    var data = {
        today: dateToAsk,
    };

    $.ajax({
        url: "/getAvgPressureScore",
        type: "POST",
        data: data,
        success: function (res) {
            sessionStorage.setItem("avgPressureScore", res.avg_pressScore);
            document.getElementById("btn_pressure").innerText = "Pressure Score\n" + res.avg_pressScore;
            if (res.avg_pressScore < 67) {
                document.getElementById("btn_pressure").style.backgroundColor = "#00EB00";
                document.getElementById("btn_pressure").disabled = true;

            }
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