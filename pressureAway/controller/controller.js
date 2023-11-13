const CRUD = require("../model/firebase_modules");
const ChatGPTAPI = require("../model/chatgpt_moudules");

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
    setNewSched(req, res, next) {
        try {
            CRUD.readAllData()
                .then((r_data) => {
                    // console.log(r_data.project)
                    var allPressStatusArr = allPressStatus(r_data.project);
                    //var newSched = newSch(r_data.project, allPressStatusArr);
                    var newSched = newSch(r_data.project, allPressStatusArr);
                    CRUD.setNewSched(newSched)
                        .then(() => {
                            res.json({
                                status: "succ",
                            });
                        });
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
    getNewSchedSub(req, res, next) {

        CRUD.readAllData()
            .then((r_data) => {
                var allPressStatusArr = allPressStatus(r_data.project);
                var getNewSchedSub = getNewSchedSubFun(r_data.project, allPressStatusArr);
                res.json({
                    getNewSchedSub: getNewSchedSub
                });
            });

    }
    getAvgPressureScore(req, res, next) {
        // var dateToAsk = req.body.today; 
        var dateToAsk = "20230717";
        CRUD.readAllData()
            .then((r_data) => {
                var allPressStatusArr = allPressStatus(r_data.project);
                var stuff_num, allPressureScore = 0;
                for (var i = 0; i < allPressStatusArr.length; i++) {
                    stuff_num = allPressStatusArr[i].pressArr.length
                    if (allPressStatusArr[i].date == dateToAsk) {
                        for (var j = 0; j < allPressStatusArr[i].pressArr.length; j++)
                            allPressureScore += allPressStatusArr[i].pressArr[j];
                    }
                }
                var avg_pressScore = Math.round(allPressureScore / stuff_num);
                res.json({
                    avg_pressScore: avg_pressScore
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
                res.json(oriSched);
            });
    }
    getNewSched(req, res, next) {
        CRUD.readAllData()
            .then((r_data) => {
                var allPressStatusArr = allPressStatus(r_data.project);
                var newSched = formatSched(newSch(r_data.project, allPressStatusArr));
                //var newSched = newSch(r_data.project, allPressStatusArr);
                res.json(newSched);
            });
    }
    getIsChanged(req, res, next) {
        try {
            CRUD.readIsChanged()
                .then((data) => {
                    console.log(data)
                    res.json(data);
                });
        } catch (err) {
            res.err();
        }
    }

    getChatgptMes(req, res, next) {
        try {
            ChatGPTAPI.helloGPT()
                .then((data) => {
                    console.log(data.message)
                    res.json(data.message);
                });
        } catch (err) {
            res.err();
        }
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
    // console.log(data)
    var allPressData = [];

    var stuff_num = data.employee_num;

    var sugarContinue = new Array(stuff_num).fill(0);
    var cntSugarDay = new Array(stuff_num).fill(0);
    var totalSugar = new Array(stuff_num).fill(0);

    for (var day = 0; day < data.daily_task.length; day++) {

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
            let avg_work = 8;
            data.daily_task[day].employee[stuff].complete_pa = (eachTask)?
                eachTask.length / avg_work : 1;
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

    if (pressureFactor.over_suager_day >= 3) score += suager_weight * 1;
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
    if (pressureFactor.complete_pa > 2) score += 150 / 100 * complete_weight;
    else if (pressureFactor.complete_pa > 1.4) score += 130 / 100 * complete_weight;
    else if (pressureFactor.complete_pa > 1.2) score += 120 / 100 * complete_weight;
    else if (pressureFactor.complete_pa > 1) score += 80 / 100 * pressureFactor.complete_pa * complete_weight;
    else if (pressureFactor.complete_pa > 0.6) score += 50 / 100 * complete_weight;
    else if (pressureFactor.complete_pa > 0.2) score += 20 / 100 * complete_weight;
    return Math.round(score);
}

function formatSched(sched) {
    var dailyTask = sched.project.daily_task;
    var test = [];
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
        };
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
                    if (j == taskCategorize[workName].length - 1) {
                        if (j > 0) {
                            if (continueDay > 0 && 1 != dateDiff(taskCategorize[workName][j - 1], curr)) {
                                var startDate = [begin.slice(6, 8), begin.slice(4, 6), begin.slice(0, 4)].join('-');
                                start.push(startDate);
                                begin = taskCategorize[workName][j];
                                duration.push(continueDay);
                                duration.push(1);
                            }
                            else
                                duration.push(continueDay + 1);
                        }
                        else
                            duration.push(continueDay + 1);
                    }
                    else
                        duration.push(continueDay);
                    var startDate = [begin.slice(6, 8), begin.slice(4, 6), begin.slice(0, 4)].join('-');
                    start.push(startDate);
                    begin = taskCategorize[workName][j];
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
function getNewSchedSubFun(Alldata, allPressStatusArr) {
    var arr = [];
    var arr_ = {};
    var re_arr = [];
    var count_day = [];
    var count;
    var test2 = [];
    var check2;
    var check3;
    var place = 0;
    var All = {};
    var Allproject = {};
    for (var i = 0; i < Alldata.employee_num; ++i) {
        re_arr[i] = [];
    }
    for (var i = 0; i < 10; i++) {
        var b = [];
        for (var j = 0; j < 100; j++) {
            b[j] = 0;
        }
        count_day[i] = b;
    }

    for (var i = 0; i < Alldata.employee_num; ++i) {
        for (var j = 0; j < Alldata.daily_task.length; ++j) {
            if (allPressStatusArr[j].pressArr[i] > 60 && count_day[i][j] < 2) {
                if (Alldata.daily_task[j].employee[i].task) {
                    count = 0;
                    for (var k = 0; k < Alldata.daily_task[j].employee[i].task.length; ++k) {
                        if (Alldata.daily_task[j].employee[i].task.length < 3) {
                            break;
                        }
                        if (count > 1) {
                            break;
                        }
                        work = Alldata.daily_task[j].employee[i].task[k];
                        for (var l = j; l < Alldata.daily_task.length; ++l) {
                            var check = 0;
                            if (Alldata.daily_task[l].employee[i].task) {
                                for (var m = 0; m < Alldata.daily_task[l].employee[i].task.length; ++m) {
                                    for (var z = 0; z < arr.length; z++) {
                                        if (work == arr[z].name && Alldata.daily_task[l].today == arr[z].to && arr[z].employee == i) {
                                            check = 1;
                                            break;
                                        }
                                    }
                                    if (check) {
                                        break;
                                    }
                                    if (Alldata.daily_task[l].employee[i].task[m] == work || allPressStatusArr[l].pressArr[i] > 60) {
                                        check = 1;
                                        break;
                                    }
                                }
                            }
                            if (check) {
                                continue;
                            }
                            else {
                                if (count_day[i][l] < -1 || l > 26)
                                    continue;
                                arr_.begin = Alldata.daily_task[j].today;
                                arr_.to = Alldata.daily_task[l].today;
                                arr_.name = work;
                                arr_.employee = i;
                                re_arr[i].push(work);
                                arr.push(JSON.parse(JSON.stringify(arr_)));
                                count_day[i][j]++;
                                count_day[i][l]--;
                                count++;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    return re_arr;
}
function newSch(Alldata, allPressStatusArr) {
    var arr = [];
    var arr_ = {};
    var re_arr = [];
    var count_day = [];
    var count;
    var test2 = [];
    var check2;
    var check3;
    var place = 0;
    var All = {};
    var Allproject = {};
    for (var i = 0; i < Alldata.employee_num; ++i) {
        re_arr[i] = [];
    }
    for (var i = 0; i < 10; i++) {
        var b = [];
        for (var j = 0; j < 100; j++) {
            b[j] = 0;
        }
        count_day[i] = b;
    }

    for (var i = 0; i < Alldata.employee_num; ++i) {
        for (var j = 0; j < Alldata.daily_task.length; ++j) {
            if (allPressStatusArr[j].pressArr[i] > 60 && count_day[i][j] < 2) {
                if (Alldata.daily_task[j].employee[i].task) {
                    count = 0;
                    for (var k = 0; k < Alldata.daily_task[j].employee[i].task.length; ++k) {
                        if (Alldata.daily_task[j].employee[i].task.length < 3) {
                            break;
                        }
                        if (count > 1) {
                            break;
                        }
                        work = Alldata.daily_task[j].employee[i].task[k];
                        for (var l = j; l < Alldata.daily_task.length; ++l) {
                            var check = 0;
                            if (Alldata.daily_task[l].employee[i].task) {
                                for (var m = 0; m < Alldata.daily_task[l].employee[i].task.length; ++m) {
                                    for (var z = 0; z < arr.length; z++) {
                                        if (work == arr[z].name && Alldata.daily_task[l].today == arr[z].to && arr[z].employee == i) {
                                            check = 1;
                                            break;
                                        }
                                    }
                                    if (check) {
                                        break;
                                    }
                                    if (Alldata.daily_task[l].employee[i].task[m] == work || allPressStatusArr[l].pressArr[i] > 60) {
                                        check = 1;
                                        break;
                                    }
                                }
                            }
                            if (check) {
                                continue;
                            }
                            else {
                                if (count_day[i][l] < -1 || l > 26)
                                    continue;
                                arr_.begin = Alldata.daily_task[j].today;
                                arr_.to = Alldata.daily_task[l].today;
                                arr_.name = work;
                                arr_.employee = i;
                                re_arr[i].push(work);
                                arr.push(JSON.parse(JSON.stringify(arr_)));
                                count_day[i][j]++;
                                count_day[i][l]--;
                                count++;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    var daily_list = [];
    for (var i = 0; i < Alldata.daily_task.length; ++i) {
        var daily = {};
        var employee_list = [];
        for (var j = 0; j < Alldata.daily_task[i].employee.length; ++j) {
            var employee_ = {};
            var task_list = [];
            if (Alldata.daily_task[i].employee[j].task) {
                for (var k = 0; k < Alldata.daily_task[i].employee[j].task.length; ++k) {
                    check2 = 0;

                    for (m = 0; m < arr.length; ++m) {
                        if (Alldata.daily_task[i].today == arr[m].begin && arr[m].employee == j && arr[m].name == Alldata.daily_task[i].employee[j].task[k]) {
                            check2 = 1;
                            break;
                        }
                    }
                    if (check2 == 1) {
                        continue;
                    }
                    if (check2 == 0) {
                        task_list.push(Alldata.daily_task[i].employee[j].task[k]);
                    }
                }
                for (m = 0; m < arr.length; ++m) {
                    if (Alldata.daily_task[i].today == arr[m].to && arr[m].employee == j) {
                        task_list.push(arr[m].name);
                    }
                }
            }
            employee_.task = task_list;
            employee_.name = Alldata.daily_task[i].employee[j].name;
            employee_.pressure_factor = Alldata.daily_task[i].employee[j].pressure_factor;
            employee_.is_meeting = Alldata.daily_task[i].employee[j].is_meeting;
            employee_.is_co_meeting = Alldata.daily_task[i].employee[j].is_co_meeting;
            employee_list.push(employee_);

        }
        daily.today = Alldata.daily_task[i].today;
        daily.employee = employee_list;
        daily_list.push(daily);
    }
    Allproject.name = Alldata.name;
    Allproject.employee_num = Alldata.employee_num;
    Allproject.start_date = Alldata.start_date;
    Allproject.deadline = Alldata.deadline;
    Allproject.daily_task = daily_list;
    Allproject.isChanged = true;
    All.project = Allproject;
    return All;
}
