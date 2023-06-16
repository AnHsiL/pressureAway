function dateDiff(Date1, Date2){ 
    var date1 = new Date(Date1);
    var date2 = new Date(Date2);
    var milliseconds_Time = date2.getTime() - date1.getTime();
    return milliseconds_Time / (1000 * 3600 * 24);
};
function caltotalSugar(data, dateToAsk){
    var sugarContinue = new Array(data.employee_num);
    var cntSugarDay = new Array(data.employee_num);
    var totalSugar = new Array(data.employee_num);
    for(var i = 0; i < data.employee_num; i++){
        sugarContinue[i] = 0;
        cntSugarDay[i] = 0;
        totalSugar[i] = 0;
    }

    for(var i = 0; i < data.daily_task.length; i++){
        for(var j = 0; j < data.employee_num; j++){
            var eachTask = data.daily_task[i].each_task[j].task;
            var eachPressureFactor = data.daily_task[i].each_task[j].pressure_factor;
            
            var totalDay = dateDiff(data.start_date, data.deadline);
            if(eachPressureFactor.sugar - totalSugar[j] / cntSugarDay[j] >= 3
                && eachPressureFactor.sugar >= 3){
                sugarContinue[j] += 1;
            }
            else {
                sugarContinue[j] = 0;
                cntSugarDay[j]++;
                totalSugar[j] += eachPressureFactor.sugar;
            }
            eachPressureFactor.over_suager_day = sugarContinue[j];

            var taskUnfinished = 0;
            for(var k = 0; k < eachTask.task_detail.length; k++)
                if(!eachTask.task_detail[k].complete) 
                    taskUnfinished += eachTask.task_detail[k].compress_rate;
            eachTask.complete_pa = (taskUnfinished / eachTask.task_detail.length) * totalDay / (totalDay - dateDiff(dateToAsk, data.deadline));
        }
    }
}

var ori_data = $(data);
var data = ori_data[0].project;
var editData = {};
var dateToAsk = "2023/06/29";

caltotalSugar(data, dateToAsk);
editData.stuff_num = data.employee_num;

var eachData = [];
for(var i = 0; i < data.daily_task.length; i++){
    if(data.daily_task[i].today == dateToAsk){
        for(var j = 0; j < data.employee_num; j++){
            var eachTask = data.daily_task[i].each_task[j];
            var eachPressureFactor = eachTask.pressure_factor;
            var personalData = {};
            var personalFactor = {};
            personalData.name = eachTask.name;
                personalFactor.is_nap           = eachPressureFactor.is_nap;
                personalFactor.is_foodout       = eachPressureFactor.is_foodout;
                personalFactor.screen_worktime  = eachPressureFactor.screen_worktime;
                personalFactor.makeup           = eachPressureFactor.makeup;
                personalFactor.over_suager_day  = eachPressureFactor.over_suager_day;
                personalFactor.is_meeting       = eachTask.task.is_meeting;
                personalFactor.is_co_meeting    = eachTask.task.is_co_meeting;
                personalFactor.complete_pa      = eachTask.task.complete_pa;
            personalData.pressure_factor    = personalFactor;
            eachData.push(personalData);
        }
    }
}

editData.each_data = eachData;

return {
    "success": true,
    "processVariable": {
        "data": {
            "ori_data": data,
            "editData":editData
        }
    },
    "errorMessage": ""
};