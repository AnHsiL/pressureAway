function dateDiff(Date1, Date2){ 
    var date1 = new Date(Date1);
    var date2 = new Date(Date2);
    var milliseconds_Time = date2.getTime() - date1.getTime();
    return milliseconds_Time / (1000 * 3600 * 24);
};
function caltotalSugar(data, dateToAsk){
    var sugarContinue = new Array(data.employee_num).fill(0);;
    var cntSugarDay = new Array(data.employee_num).fill(0);
    var totalSugar = new Array(data.employee_num).fill(0);

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

            var cnt_taskFinished = 0;
            for(var k = 0; k < eachTask.task_detail.length; k++)
                if(eachTask.task_detail[k].complete) 
                    cnt_taskFinished++;
            eachTask.complete_pa = (1 - cnt_taskFinished / eachTask.task_detail.length) * totalDay / (totalDay - dateDiff(dateToAsk, data.deadline));
            alert(
                "name = "+data.daily_task[i].each_task[j].name+
              "\npa = " +   eachTask.complete_pa
            );
        }
    }
}

var data = {   
    "name": "project1",
    "employee_num": 2,
    "daily_task": [
        {
            "today": "2023/06/13",
            "each_task":[
                {
                    "name": "a",
                    "pressure_factor": {
                        "is_nap": true,
                        "is_foodout": true,
                        "sugar": 3,
                        "screen_worktime": 240,
                        "makeup": -1
                    },
                    "task": {
                        "is_meeting": true,
                        "is_co_meeting": true,
                        "task_detail": [
                            {
                                "name": "work",
                                "complete": false
                            },
                            {
                                "name": "work2",
                                "complete": true
                            },
                            {
                                "name": "work3",
                                "complete": false
                            }
                        ]
                    },
                    "complete_pa": 10
                },
                {
                    "name": "b",
                    "pressure_factor": {
                        "is_nap": true,
                        "is_foodout": true,
                        "sugar": 3,
                        "screen_worktime": 240,
                        "makeup": 1
                    },
                    "task": {
                        "is_meeting": true,
                        "is_co_meeting": false,
                        "task_detail": [
                            {
                                "name": "work",
                                "complete": false
                            },
                            {
                                "name": "work2",
                                "complete": false
                            }
                        ]
                    },
                    "complete_pa": 20
                }
            ]
        },
        {
            "today": "2023/06/14",
            "each_task":[
                {
                    "name": "a",
                    "pressure_factor": {
                        "is_nap": true,
                        "is_foodout": true,
                        "sugar": 3,
                        "screen_worktime": 240,
                        "makeup": -1
                    },
                    "task": {
                        "is_meeting": true,
                        "is_co_meeting": true,
                        "task_detail": [
                            {
                                "name": "work",
                                "complete": false
                            },
                            {
                                "name": "work2",
                                "complete": true
                            },
                            {
                                "name": "work3",
                                "complete": true
                            }
                        ]
                    },
                    "complete_pa": 20
                },
              {
                    "name": "b",
                    "pressure_factor": {
                        "is_nap": true,
                        "is_foodout": true,
                        "sugar": 7,
                        "screen_worktime": 250,
                        "makeup": 1
                    },
                    "task": {
                        "is_meeting": true,
                        "is_co_meeting": false,
                        "task_detail": [
                            {
                                "name": "work",
                                "complete": false
                            },
                            {
                                "name": "work2",
                                "complete": false
                            }
                        ]
                    },
                    "complete_pa": 30
                }
            ]
        },
        {
            "today": "2023/06/15",
            "each_task":[
                {
                    "name": "a",
                    "pressure_factor": {
                        "is_nap": true,
                        "is_foodout": true,
                        "sugar": 8,
                        "screen_worktime": 240,
                        "makeup": -1
                    },
                    "task": {
                        "is_meeting": true,
                        "is_co_meeting": true,
                        "task_detail": [
                            {
                                "name": "work",
                                "complete": true
                            },
                            {
                                "name": "work2",
                                "complete": true
                            },
                            {
                                "name": "work3",
                                "complete": true
                            }
                        ]
                    },
                    "complete_pa": 20
                },
              {
                    "name": "b",
                    "pressure_factor": {
                        "is_nap": true,
                        "is_foodout": true,
                        "sugar": 7,
                        "screen_worktime": 250,
                        "makeup": 1
                    },
                    "task": {
                        "is_meeting": true,
                        "is_co_meeting": false,
                        "task_detail": [
                            {
                                "name": "work",
                                "complete": false
                            },
                            {
                                "name": "work2",
                                "complete": true
                            }
                        ]
                    },
                    "complete_pa": 30
                }
            ]
        }
    ],
    "start_date": "2023/06/13",
    "deadline": "2023/06/16"
};
var editData = {};
var dateToAsk = "2023/06/15";

var sugarContinue = caltotalSugar(data, dateToAsk);
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