$(document).ready(function () {
	getAllData();
    
    // $("#btn_set").click(function(){
    //     setPersonalTask($("#input_date").val(), $("#input_name").val(), $("#input_dataToChange").val());
    // })
});

function getAllData(){
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
function getNewSched(){ // page 2
    $.ajax({
        url: "/getNewSched",
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

function formatSched(sched){
    var formatSched = {};
    var allPersonName = new Array(sched.project.employee_num);

    var dailyTask = sched.project.daily_task;
    for(var day = 0; day < dailyTask.length; day++){
        for(var stuff = 0; stuff < dailyTask[day].each_task.length; stuff++){
            allPersonName[stuff] = dailyTask[day].each_task[stuff].name;
        }
    }

    var allPersonData = new Array(sched.project.employee_num);
    for(var stuff = 0; stuff < allPersonName.length; stuff++)
        allPersonData[allPersonName[stuff]] = new Array();
    
    for(var day = 0; day < dailyTask.length; day++){
        var today = dailyTask[day].today;
        for(var stuff = 0; stuff < dailyTask[day].each_task.length; stuff++){
            var personalData = dailyTask[day].each_task[stuff];
            var personalName = personalData.name;
            var personalTask = personalData.task;

            for(var task_num = 0; task_num < personalTask.task_detail.length; task_num++){
                var task = personalTask.task_detail[task_num];
                var taskName = task.name;
                if(!task.is_complete){
                    allPersonData[personalName].push({
                        taskName: taskName,
                        taskDate: today
                    })

                }
            }
        }
    }
    var allData = [];
    for(var stuff = 0; stuff < sched.project.employee_num; stuff++){
        allData.push({
            name : allPersonName[stuff],
            work : allPersonData[allPersonName[stuff]]
        })
    }

    return allData;
}

function dateDiff(Date1_, Date2_){ 
    var Date1 = [Date1_.slice(0, 4), Date1_.slice(4,6), Date1_.slice(6,8)].join('-') 
    var Date2 = [Date2_.slice(0, 4), Date2_.slice(4,6), Date2_.slice(6,8)].join('-') 
    
    var date1 = new Date(Date1);
    var date2 = new Date(Date2);
    var milliseconds_Time = date2.getTime() - date1.getTime();
    return milliseconds_Time / (1000 * 3600 * 24);
};