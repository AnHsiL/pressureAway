$(document).ready(function () {
    // gantt.init("gantt_here");
    // gantt.load("./data/schedule.json");
    // import data schedule.json
    $("#btn_get").click(function () {
        getAllData();
    });
    $("#btn_set").click(function () {
        // var data = getAllData();
        // console.log(data);
        setPersonalTask(0, 1, "test");
        // setPersonalTask($("#input_date").val(), $("#input_name").val(), $("#input_dataToChange").val());
    })
});

function toStart() {
    window.location.href = "./index.html";
}

function toSched() {
    window.location.href = "./schedule.html";
}

function getAllData() {
    $.ajax({
        url: "/getAllData",
        type: "POST",
        success: function (res) {
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

function drawGantt(data) {
    var dataToGantt = { "data": [], "links": [] };
    var DT = data.project.daily_task;
    var EN = data.project.employee_num;
    var name = data.project.name;

    for (var i = 1; i <= EN; i++) {
        var eachEmployee = {
            "id": i,
            "text": DT[0].employee[i - 1].name,
            "open": true,
            "type": "project"
        };
        dataToGantt.data.push(eachEmployee);
    }
    var eachTask = {};
    for (var i = 0; i <= EN; i++) {
    }

    dataToGantt.data.push(eachTask);
    // console.log(dataToGantt);
    gantt.init("gantt_here");
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