$(document).ready(function () {
	getOriSched();
    
    // $("#btn_set").click(function(){
    //     setPersonalTask($("#input_date").val(), $("#input_name").val(), $("#input_dataToChange").val());
    // })
});

function getOriSched(){
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
    var dailyTask = sched.project.daily_task;

    var allPersonName = new Array(sched.project.employee_num);
    for(var day = 0; day < dailyTask.length; day++){
        for(var stuff = 0; stuff < dailyTask[day].employee.length; stuff++){
            allPersonName[stuff] = dailyTask[day].employee[stuff].name;
        }
    }

    var allPersonData = new Array(sched.project.employee_num);
    for(var stuff = 0; stuff < allPersonName.length; stuff++)
        allPersonData[allPersonName[stuff]] = new Array();
    for(var day = 0; day < dailyTask.length; day++){
        var today = dailyTask[day].today;
        for(var stuff = 0; stuff < dailyTask[day].employee.length; stuff++){
            var personalName = dailyTask[day].employee[stuff].name;
            var personalTask = dailyTask[day].employee[stuff].task;
            if(personalTask){
                for(var task_num = 0; task_num < personalTask.length; task_num++){
                    allPersonData[personalName].push({
                        taskDate: today,
                        taskName: personalTask[task_num]
                    });
                }  
            }
        }
    }

    var finalData = [];
    for(var stuff = 0; stuff < sched.project.employee_num; stuff++){
        // 建立 allTask 紀錄目前這個 stuff 有的所有任務名字
        var allTask = [];
        for(var d = 0; d < allPersonData[allPersonName[stuff]].length; d++){
            var findInAllTask = (allTask.indexOf(allPersonData[allPersonName[stuff]][d].taskName) > -1);
            if(!findInAllTask) allTask.push(allPersonData[allPersonName[stuff]][d].taskName);
        }

        // 建立 taskCategorize 可以放 taskCategorize["work1"] = ["20230601"];
        var taskCategorize = new Array(allTask.length);
        for(var al = 0; al < allTask.length; al++){
            taskCategorize[allTask[al]] = new Array();
        }

        // 放入確切數值, ex: taskCategorize["work1"] = ["20230601"];
        for(var d = 0; d < allPersonData[allPersonName[stuff]].length; d++){
            taskCategorize[allPersonData[allPersonName[stuff]][d].taskName].push(allPersonData[allPersonName[stuff]][d].taskDate);
        }
        for(var d = 0; d < allPersonData[allPersonName[stuff]].length; d++){
            taskCategorize[allPersonData[allPersonName[stuff]][d].taskName].sort();
        }

        // 計算 duration 和 start_date
        var taskWithDuration = [];
        for(var taskC_i = 0; taskC_i < taskCategorize.length; taskC_i++){   
            var workName = allTask[taskC_i]; // taskCategorize["work1"] 的 "work1"
            var duration = [], start = [];
            var continueDay = 0;
            var begin = taskCategorize[workName][0];
            for(var j = 0; j < taskCategorize[workName].length; j++){
                var curr = taskCategorize[workName][j];
                if(dateDiff(begin, curr) != continueDay || j == taskCategorize[workName].length-1){
                    duration.push(continueDay+1);
                    start.push(begin);
                    begin = taskCategorize[workName][j+1];
                    continueDay = 1;
                }
                else continueDay++;
            }
            taskWithDuration.push({
                taskName: workName,
                start: start,
                duration: duration
            });
        }
        finalData.push({
            name: allPersonName[stuff],
            task: taskWithDuration
        });
    }
    return finalData;
}

function dateDiff(Date1_, Date2_){ 
    var Date1 = [Date1_.slice(0, 4), Date1_.slice(4,6), Date1_.slice(6,8)].join('-') 
    var Date2 = [Date2_.slice(0, 4), Date2_.slice(4,6), Date2_.slice(6,8)].join('-') 
    
    var date1 = new Date(Date1);
    var date2 = new Date(Date2);
    var milliseconds_Time = date2.getTime() - date1.getTime();
    return milliseconds_Time / (1000 * 3600 * 24);
};