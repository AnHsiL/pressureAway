const CRUD = require("../model/firebase_modules");

module.exports = class Controller {
    getAllData(req, res, next) {
        try {
            CRUD.readAllData()
                .then((data) => {
                    res.json(data);
                });
        } catch (err) {
            res.err();
        }
    }
    setPersonalTask(req, res, next) {
        var newData = req.body.dataToChange;
        try {
            CRUD.readAllData()
                .then((r_data) => {
                    for(var i = 0; i < Object.keys(r_data.project.daily_task).length; i++){
                        if(req.body.date == r_data.project.daily_task[i].today){
                            for(var j = 0; j < r_data.project.employee_num; j++){
                                if(req.body.name == r_data.project.daily_task[i].each_task[j].name){
                                    CRUD.setPersonalTask(i, j, newData)
                                    .then(() => {
                                        res.json({
                                            status: "succ",
                                        });
                                    });
                                }
                            }
                        }
                    }
                });
        } catch (err) {
            res.err();
        }
    }
    getAllPressureData(req, res, next){

        CRUD.readAllData()
        .then((r_data) => {
            var allPressStatusArr = allPressStatus(r_data.project);

            res.json({
                allPressStatusArr : allPressStatusArr
            });
        });

    }
    toUnchangedStatus(req, res, next) {
        try {
            CRUD.setIsChange(false)
                .then(() => {
                    res.json({
                        status: "succ",
                    });
                });
        } catch (err) {
            res.err();
        }
    }
    toChangedStatus(req, res, next) {
        try {
            CRUD.setIsChange(true)
                .then(() => {
                    res.json({
                        status: "succ",
                    });
                });
        } catch (err) {
            res.err();
        }
    }
}

function dateDiff(Date1_, Date2_){ 
    var Date1 = [Date1_.slice(0, 4), Date1_.slice(4,6), Date1_.slice(6,8)].join('-') 
    var Date2 = [Date2_.slice(0, 4), Date2_.slice(4,6), Date2_.slice(6,8)].join('-') 
    
    var date1 = new Date(Date1);
    var date2 = new Date(Date2);
    var milliseconds_Time = date2.getTime() - date1.getTime();
    return milliseconds_Time / (1000 * 3600 * 24);
};

function allPressStatus(data){ 
    var totalDay = dateDiff(data.start_date, data.deadline);
    var allPressData = [];

    var stuff_num = data.employee_num;

    var sugarContinue   = new Array(stuff_num).fill(0);
    var cntSugarDay     = new Array(stuff_num).fill(0);
    var totalSugar      = new Array(stuff_num).fill(0);

    for(var day = 0; day < data.daily_task.length; day++){
        var lastDay = dateDiff(data.daily_task[day].today, data.deadline);

        for(var stuff = 0; stuff < stuff_num; stuff++){
            var eachPressureFactor = data.daily_task[day].each_task[stuff].pressure_factor;
            if(eachPressureFactor.sugar - totalSugar[stuff] / cntSugarDay[stuff] >= 2){
                sugarContinue[stuff] += 1;
            }
            else {
                sugarContinue[stuff] = 0;
                cntSugarDay[stuff]+=1;
                totalSugar[stuff] += eachPressureFactor.sugar;
            }
            eachPressureFactor.over_suager_day = sugarContinue[stuff];
            
            var eachTask = data.daily_task[day].each_task[stuff].task;
            var taskUnfinished = 0;
            for(var k = 0; k < eachTask.task_detail.length; k++)
                if(!eachTask.task_detail[k].complete) 
                    taskUnfinished += eachTask.task_detail[k].compress_rate;
            eachTask.complete_pa = 0;
            if(taskUnfinished > 0)
                eachTask.complete_pa = (taskUnfinished / eachTask.task_detail.length) * totalDay / lastDay;
            else eachTask.complete_pa = 1;
        }
    }
    
    for(var day = 0; day < data.daily_task.length; day++){
        var dailyPressData_pressArr = [];

        for(var stuff = 0; stuff < stuff_num; stuff++){
            var personalData = data.daily_task[day].each_task[stuff];

            var personalPress = {
                name : personalData.name,
                pressure_factor : {
                    is_nap           : personalData.pressure_factor.is_nap,
                    is_foodout       : personalData.pressure_factor.is_foodout,
                    screen_worktime  : personalData.pressure_factor.screen_worktime,
                    makeup           : personalData.pressure_factor.makeup,
                    over_suager_day  : personalData.pressure_factor.over_suager_day,
                    is_meeting       : personalData.task.is_meeting,
                    is_co_meeting    : personalData.task.is_co_meeting,
                    complete_pa      : personalData.task.complete_pa
                }
            };

            var score = PressureScore(personalPress.pressure_factor);
            if(score >= 66) dailyPressData_pressArr.push(1);
            else if(score <= 33) dailyPressData_pressArr.push(-1);
            else dailyPressData_pressArr.push(0);
        }

        var dailyPressData = {
            date: data.daily_task[day].today,
            pressArr : dailyPressData_pressArr
        };
        allPressData.push(dailyPressData)
    }
    return allPressData;
};

function PressureScore(pressureFactor){
    var score = 0;
  
    var nap_weight = 8;
    var foodout_weight = 7;
    var screen_weight = 8;
    var suager_weight = 9;
    var meeting_weight = 10;
    var co_meeting_weight = 16;
    var complete_weight = 42;
  
    if(pressureFactor.makeup > 0){
        nap_weight = 7;
        foodout_weight = 6;
        screen_weight = 7;
        suager_weight = 9;
        meeting_weight = 10;
        co_meeting_weight = 15;
        complete_weight = 41;
        if (pressureFactor.makeup == 0)  score += 5;
        else if (pressureFactor.makeup == 5) score += 3;
    }
    if(pressureFactor.is_nap) score += nap_weight;
    if(pressureFactor.is_foodout) score += foodout_weight;
    if(pressureFactor.over_suager_day >= 3) score += suager_weight*1.3;
    else if(pressureFactor.over_suager_day >= 2) score += suager_weight*0.8;
    else if(pressureFactor.over_suager_day >= 1) score += suager_weight*0.2;
  
    var screenTime = pressureFactor.screen_worktime / (7*60);
    if(pressureFactor.is_meeting) {
      score += meeting_weight;
      screenTime = pressureFactor.screen_worktime / (5*60);
    }
    if(pressureFactor.is_co_meeting) {
        score += co_meeting_weight;
        screenTime = pressureFactor.screen_worktime / (3*60);
    }
    score += screenTime * screen_weight;

    if(pressureFactor.complete_pa > 10) score += 1.2 * complete_weight;
    else if(pressureFactor.complete_pa > 5) score += 1.1 * complete_weight;
    else if(pressureFactor.complete_pa > 3) score += complete_weight;
    else if(pressureFactor.complete_pa > 1) score += 60 / 100 * pressureFactor.complete_pa * complete_weight;
    else if(pressureFactor.complete_pa > -1) score += 20 / 100 * complete_weight;
    else if(pressureFactor.complete_pa > -3) score += 10 / 100 * complete_weight;
    return score;
}
  
  