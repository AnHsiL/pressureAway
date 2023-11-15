$(document).ready(function () {
    document.getElementById("today").innerHTML = formatToday();
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
            console.log("oriSched");
            console.log(res);
            drawGantt(res);
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
function drawGantt(oriSched) {
    var dataToGantt = { "data": [], "links": [] };

    for (var i = 1; i <= oriSched.length; i++) {
        var eachEmployee = {
            "id": String(i),
            "text": oriSched[i - 1].name,
            "type": "project",
            "open": true
        };
        dataToGantt.data.push(eachEmployee);

        for (var j = 1; j <= oriSched[i - 1].task.length; j++) {
            var taskNum = oriSched[i - 1].task[j - 1].start.length;
            var task = oriSched[i - 1].task[j - 1];
            if (taskNum == 1) {
                var eachTask = {
                    "id": String(i) + "-" + String(j),
                    "text": task.taskName,
                    "start_date": task.start[0],
                    "duration": task.duration[0],
                    "parent": String(i),
                    "type": "task",
                };
                dataToGantt.data.push(eachTask);
            }
            else {
                var taskParent = {
                    "id": String(i) + "-" + String(j),
                    "text": task.taskName,
                    "color": "#ffa500",
                    "textColor": "#000000",
                    "parent": String(i),
                    "type": "project",
                    "render": "split",
                    "open": false
                };
                dataToGantt.data.push(taskParent);
                for (var k = 1; k <= taskNum; k++) {
                    var eachTask = {
                        "id": String(i) + "-" + String(j) + "-" + String(k),
                        "text": task.taskName,
                        "start_date": task.start[k - 1],
                        "duration": task.duration[k - 1],
                        "parent": String(i) + "-" + String(j),
                        "type": "task",
                    };
                    dataToGantt.data.push(eachTask);
                }
            }
            sessionStorage.setItem("oriSched", JSON.stringify(dataToGantt));
        }
    }
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
                icon: "success",
            }).then(() => {
                location.reload();
            });
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
            var score = res.avg_pressScore;
            sessionStorage.setItem("avgPressureScore", score);
            document.getElementById("btn_pressure").innerText = "Pressure Score\n" + score;
            if (score < 42) {
                $("#btn_pressure").css("background-color", "HoneyDew");
                $("#btn_pressure").css("border-color", "MediumSeaGreen");
                $("#btn_pressure").css("border-width", "1.3px");
                $("#btn_pressure").css("color", "MediumSeaGreen");
                document.getElementById("btn_pressure").disabled = true;
            }
            else if (score < 66) {
                $("#btn_pressure").css("background-color", "PaleTurquoise");
                $("#btn_pressure").css("border-color", "#258E8E");
                $("#btn_pressure").css("border-width", "1.3px");
                $("#btn_pressure").css("color", "#258E8E");
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
function formatToday() {
    var date = new Date();
    var month = String(date.getMonth() + 1);
    if (month.length < 2) month = "0" + month;
    var day = String(date.getDate());
    if (day.length < 2) day = "0" + day;
    var today = [date.getFullYear(), month, day].join('/');
    return today;
}
function sendWarning(){

    var dateToAsk = formatToday();

    var data = {
        today: dateToAsk,
        avg_pressureScore: sessionStorage.getItem("avgPressureScore")
    };
    // alert(JSON.stringify(data))
    $.ajax({
        url: "/sendDailyWarning",
        type: "POST",
        data:data,
        success: function () {
            alert("succ")
        },
        error: function (err) {
            swal.fire({
                title: "Error",
                text: err,
                icon: "error",
            });
        }
    });
    
}
