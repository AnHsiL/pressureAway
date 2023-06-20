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
                    for (var i = 0; i < Object.keys(r_data.project.daily_task).length; i++) {
                        if (req.body.date == r_data.project.daily_task[i].today) {
                            for (var j = 0; j < r_data.project.employee_num; j++) {
                                if (req.body.name == r_data.project.daily_task[i].employee[j].name) {
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
    getAllPressureData(req, res, next) {

        CRUD.readAllData()
            .then((r_data) => {
                var allPressStatusArr = allPressStatus(r_data.project);
                res.json({
                    allPressStatusArr: allPressStatusArr
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
    getOriSched(req, res, next) {
        CRUD.readAllData()
            .then((r_data) => {
                var oriSched = formatSched(r_data);
                res.json({
                    oriSched: oriSched
                });
            });
    }
    getNewSched(req, res, next) {
        CRUD.readAllData()
            .then((r_data) => {
                var allPressStatusArr = allPressStatus(r_data.project);
                var newSched = newSch(r_data.project, allPressStatusArr);
                res.json({
                    newSched: newSched
                });
            });
    }

}

function dateDiff(Date1_, Date2_) {
    var Date1 = [Date1_.slice(0, 4), Date1_.slice(4, 6), Date1_.slice(6, 8)].join('-')
    var Date2 = [Date2_.slice(0, 4), Date2_.slice(4, 6), Date2_.slice(6, 8)].join('-')

    var date1 = new Date(Date1);
    var date2 = new Date(Date2);
    var milliseconds_Time = date2.getTime() - date1.getTime();
    return milliseconds_Time / (1000 * 3600 * 24);
};

function allPressStatus(data) {
    var totalDay = dateDiff(data.start_date, data.deadline);
    var allPressData = [];

    var stuff_num = data.employee_num;

    var sugarContinue = new Array(stuff_num).fill(0);
    var cntSugarDay = new Array(stuff_num).fill(0);
    var totalSugar = new Array(stuff_num).fill(0);

    for (var day = 0; day < data.daily_task.length; day++) {
        var lastDay = dateDiff(data.daily_task[day].today, data.deadline);

        for (var stuff = 0; stuff < stuff_num; stuff++) {
            var eachPressureFactor = data.daily_task[day].employee[stuff].pressure_factor;
            if (eachPressureFactor.sugar - totalSugar[stuff] / cntSugarDay[stuff] >= 2) {
                sugarContinue[stuff] += 1;
            }
            else {
                sugarContinue[stuff] = 0;
                cntSugarDay[stuff] += 1;
                totalSugar[stuff] += eachPressureFactor.sugar;
            }
            eachPressureFactor.over_suager_day = sugarContinue[stuff];

            var eachTask = data.daily_task[day].employee[stuff].task;
            var taskUnfinished = 0;
            for (var k = 0; k < eachTask.length; k++)
                taskUnfinished++;
            data.daily_task[day].employee[stuff].complete_pa = 0;
            if (taskUnfinished > 0)
                data.daily_task[day].employee[stuff].complete_pa = (taskUnfinished / eachTask.length) * totalDay / lastDay;
            else data.daily_task[day].employee[stuff].complete_pa = 1;
        }
    }

    for (var day = 0; day < data.daily_task.length; day++) {
        var dailyPressData_pressArr = [];

        for (var stuff = 0; stuff < stuff_num; stuff++) {
            var personalData = data.daily_task[day].employee[stuff];

            var personalPress = {
                name: personalData.name,
                pressure_factor: {
                    is_nap: personalData.pressure_factor.is_nap,
                    is_foodout: personalData.pressure_factor.is_foodout,
                    screen_worktime: personalData.pressure_factor.screen_worktime,
                    makeup: personalData.pressure_factor.makeup,
                    over_suager_day: personalData.pressure_factor.over_suager_day,
                    is_meeting: personalData.is_meeting,
                    is_co_meeting: personalData.is_co_meeting,
                    complete_pa: personalData.complete_pa
                }
            };

            var score = PressureScore(personalPress.pressure_factor);
            dailyPressData_pressArr.push(score);
        }

        allPressData.push({
            date: data.daily_task[day].today,
            pressArr: dailyPressData_pressArr
        })
    }
    return allPressData;
};

function PressureScore(pressureFactor) {
    var score = 0;

    var nap_weight = 8;
    var foodout_weight = 7;
    var screen_weight = 8;
    var suager_weight = 9;
    var meeting_weight = 10;
    var co_meeting_weight = 16;
    var complete_weight = 42;

    if (pressureFactor.makeup > 0) {
        nap_weight = 7;
        foodout_weight = 6;
        screen_weight = 7;
        suager_weight = 9;
        meeting_weight = 10;
        co_meeting_weight = 15;
        complete_weight = 41;
        if (pressureFactor.makeup == 0) score += 5;
        else if (pressureFactor.makeup == 5) score += 3;
    }

    if (pressureFactor.is_nap) score += nap_weight;
    if (pressureFactor.is_foodout) score += foodout_weight;

    if (pressureFactor.over_suager_day >= 3) score += suager_weight * 1.1;
    else if (pressureFactor.over_suager_day >= 2) score += suager_weight * 0.6;
    else if (pressureFactor.over_suager_day >= 1) score += suager_weight * 0.2;

    var screenTime = pressureFactor.screen_worktime / (7 * 60);
    if (pressureFactor.is_meeting) {
        score += meeting_weight;
        screenTime = pressureFactor.screen_worktime / (5 * 60);
    }
    if (pressureFactor.is_co_meeting) {
        score += co_meeting_weight;
        screenTime = pressureFactor.screen_worktime / (3 * 60);
    }
    score += screenTime * screen_weight;

    if (pressureFactor.complete_pa > 10) score += 1.1 * complete_weight;
    else if (pressureFactor.complete_pa > 5) score += complete_weight;
    else if (pressureFactor.complete_pa > 3) score += 80 / 100 * complete_weight;
    else if (pressureFactor.complete_pa > 1) score += 60 / 100 * pressureFactor.complete_pa * complete_weight;
    else if (pressureFactor.complete_pa > -1) score += 20 / 100 * complete_weight;
    else if (pressureFactor.complete_pa > -3) score += 10 / 100 * complete_weight;
    return Math.round(score);
}

function formatSched(sched) {
    var dailyTask = sched.project.daily_task;

    var allPersonName = new Array(sched.project.employee_num);
    for (var day = 0; day < dailyTask.length; day++) {
        for (var stuff = 0; stuff < dailyTask[day].employee.length; stuff++) {
            allPersonName[stuff] = dailyTask[day].employee[stuff].name;
        }
    }

    var allPersonData = new Array(sched.project.employee_num);
    for (var stuff = 0; stuff < allPersonName.length; stuff++)
        allPersonData[allPersonName[stuff]] = new Array();
    for (var day = 0; day < dailyTask.length; day++) {
        var today = dailyTask[day].today;
        for (var stuff = 0; stuff < dailyTask[day].employee.length; stuff++) {
            var personalName = dailyTask[day].employee[stuff].name;
            var personalTask = dailyTask[day].employee[stuff].task;
            if (personalTask) {
                for (var task_num = 0; task_num < personalTask.length; task_num++) {
                    allPersonData[personalName].push({
                        taskDate: today,
                        taskName: personalTask[task_num]
                    });
                }
            }
        }
    }

    var finalData = [];
    for (var stuff = 0; stuff < sched.project.employee_num; stuff++) {
        // 建立 allTask 紀錄目前這個 stuff 有的所有任務名字
        var allTask = [];
        for (var d = 0; d < allPersonData[allPersonName[stuff]].length; d++) {
            var findInAllTask = (allTask.indexOf(allPersonData[allPersonName[stuff]][d].taskName) > -1);
            if (!findInAllTask) allTask.push(allPersonData[allPersonName[stuff]][d].taskName);
        }

        // 建立 taskCategorize 可以放 taskCategorize["work1"] = ["20230601"];
        var taskCategorize = new Array(allTask.length);
        for (var al = 0; al < allTask.length; al++) {
            taskCategorize[allTask[al]] = new Array();
        }

        // 放入確切數值, ex: taskCategorize["work1"] = ["20230601"];
        for (var d = 0; d < allPersonData[allPersonName[stuff]].length; d++) {
            taskCategorize[allPersonData[allPersonName[stuff]][d].taskName].push(allPersonData[allPersonName[stuff]][d].taskDate);
        }
        for (var d = 0; d < allPersonData[allPersonName[stuff]].length; d++) {
            taskCategorize[allPersonData[allPersonName[stuff]][d].taskName].sort();
        }

        // 計算 duration 和 start_date
        var taskWithDuration = [];
        for (var taskC_i = 0; taskC_i < taskCategorize.length; taskC_i++) {
            var workName = allTask[taskC_i]; // taskCategorize["work1"] 的 "work1"
            var duration = [], start = [];
            var continueDay = 0;
            var begin = taskCategorize[workName][0];
            for (var j = 0; j < taskCategorize[workName].length; j++) {
                var curr = taskCategorize[workName][j];
                if (dateDiff(begin, curr) != continueDay || j == taskCategorize[workName].length - 1) {
                    duration.push(continueDay + 1);
                    var startDate = [begin.slice(6, 8), begin.slice(4, 6), begin.slice(0, 4)].join('-');
                    start.push(startDate);
                    begin = taskCategorize[workName][j + 1];
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

function newSch(Alldata, allPressStatusArr) {
    var Alldata = response[0].project;
    var All = {};
    var ALL = {};
    All.name = Alldata.name;
    All.employee_num = Alldata.employee_num;
    All.start_date = Alldata.start_date;
    All.deadline = Alldata.deadline;
    All.isChanged = true;
    var changedaily_task = [];
    var changedaily_task_ = {};
    var move = [];
    var move_detail = {};
    var move_num = [];
    var web = [];
    var web_ = {};
    var test = [];
    var task_move = [];
    var task_move_ = {};
    var AllDairyTask = [];
    var AllDairyTask_ = {};
    var edit = [];
    var edit_ch = [];
    var web_be = [];
    var web_en = [];
    var task_move_re = [];
    for (var i = 0; i < Alldata.employee_num; i++) {
        move[i] = [];
        web[i] = [];
        web_be[i] = 0;
        web_en[i] = 0;
        move_num[i] = 0;
        task_move[i] = [];
        task_move_re[i] = [];
        edit_ch[i] = 0;
    }
    for (var i = 0; i < Alldata.daily_task.length; i++) {
        var change_employee = [];
        var change_employee_ = {};
        for (var j = 0; j < Alldata.daily_task[i].employee.length; ++j) {
            var change_task = [];
            var change_task_detail = [];
            var count_ = 0;
            for (var k = Alldata.daily_task[i].employee[j].task.length - 1; k >= 0; --k) {

                if (allPressStatusArr[i].pressArr[j] > 60 && Alldata.daily_task.length - i > 2) {
                    if (count_ < 2) {
                        move[j].push(JSON.parse(JSON.stringify(JSON.stringify(Alldata.daily_task[i].employee[j].task[k]))));
                        move_num[j]++;
                        count_++;
                        task_move_.name = JSON.parse(JSON.stringify(Alldata.daily_task[i].employee[j].task[k]));
                        task_move_.move_begin = JSON.parse(JSON.stringify(Alldata.daily_task[i].today));
                        task_move_.move_end = "";
                        task_move[j].push(JSON.parse(JSON.stringify(task_move_)));
                        task_move_re[j].push(JSON.parse(JSON.stringify(task_move_)));
                        web_.task_move = JSON.parse(JSON.stringify(task_move_re[j]));
                        web_.name = JSON.parse(JSON.stringify(Alldata.daily_task[i].employee[j].name));
                        if (edit_ch[j] == 0) {
                            edit.push(JSON.parse(JSON.stringify(Alldata.daily_task[i].employee[j].name)));
                            edit_ch[j] = 1;
                        }
                        web[j] = JSON.parse(JSON.stringify(web_));
                    }
                    else {
                        change_task_detail[k] = JSON.parse(JSON.stringify(Alldata.daily_task[i].employee[j].task[k]));
                    }
                }
                else {
                    change_task_detail[k] = JSON.parse(JSON.stringify(Alldata.daily_task[i].employee[j].task[k]));
                }

            }
            if (allPressStatusArr[i].pressArr[j] > 29 && move_num[j] > 0) {
                change_task_detail.push(JSON.parse(JSON.stringify(move[j][move_num[j] - 1])));
                move_num[j]--;
                web[j].task_move[web_be[j]].move_end = JSON.parse(JSON.stringify(Alldata.daily_task[i].today));
                web_be[j]++;
            }
            if (allPressStatusArr[i].pressArr[j] < 29 && move_num[j] > 0) {
                if (move_num[j] > 1) {
                    change_task_detail.push(JSON.parse(JSON.stringify(move[j][move_num[j] - 1])));
                    move_num[j]--;
                    web[j].task_move[web_be[j]].move_end = JSON.parse(JSON.stringify(Alldata.daily_task[i].today));
                    web_be[j]++;
                    change_task_detail.push(JSON.parse(JSON.stringify(move[j][move_num[j] - 1])));
                    move_num[j]--;
                    web[j].task_move[web_be[j]].move_end = JSON.parse(JSON.stringify(Alldata.daily_task[i].today));
                    web_be[j]++;
                }
                else {
                    change_task_detail.push(JSON.parse(JSON.stringify(move[j][move_num[j] - 1])));
                    move_num[j]--;
                    web[j].task_move[web_be[j]].move_end = JSON.parse(JSON.stringify(Alldata.daily_task[i].today));
                    web_be[j]++;
                }
            }
            if (i == Alldata.daily_task.length - 1) {
                while (move_num[j] > 0) {
                    change_task_detail.push(JSON.parse(JSON.stringify(move[j][move_num[j] - 1])));
                    move_num[j]--;
                    web[j].task_move[web_be[j]].move_end = JSON.parse(JSON.stringify(Alldata.daily_task[i].today));
                    web_be[j]++;
                }
            }
            change_task = JSON.parse(JSON.stringify(change_task_detail));
            change_employee_.is_meeting = Alldata.daily_task[i].employee[j].is_meeting;
            change_employee_.is_co_meeting = Alldata.daily_task[i].employee[j].is_co_meeting;
            change_employee_.name = JSON.parse(JSON.stringify(Alldata.daily_task[i].employee[j].name));
            change_employee_.task = JSON.parse(JSON.stringify(change_task));
            change_employee_.pressure_factor = JSON.parse(JSON.stringify(Alldata.daily_task[i].employee[j].pressure_factor));
            change_employee[j] = JSON.parse(JSON.stringify(change_employee_));
        }
        changedaily_task_.employee = JSON.parse(JSON.stringify(change_employee));
        changedaily_task_.today = Alldata.daily_task[i].today;
        changedaily_task[i] = JSON.parse(JSON.stringify(changedaily_task_));
    }
    All.daily_task = JSON.parse(JSON.stringify(changedaily_task));
    ALL.project = JSON.parse(JSON.stringify(All));

    return ALL;
}