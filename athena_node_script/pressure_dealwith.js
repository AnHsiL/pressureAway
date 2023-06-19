var response = $(response);
var allPressStatusArr = $(allPressStatusArr);


var Alldata = response.project;
var All = {};
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
}
for (var i = 0; i < Alldata.daily_task.length; i++) {
    var change_each_task = [];
    var change_each_task_ = {};
    for (var j = 0; j < Alldata.daily_task[i].each_task.length; ++j) {
        var change_task = {};
        var change_task_detail = [];
        var count_ = 0;
        for (var k = Alldata.daily_task[i].each_task[j].task.task_detail.length - 1; k >= 0; --k) {
            var check = 0;
            for (var l = 0; l < move_num[j]; ++l) {
                if (move[j][l].task_detail.name == Alldata.daily_task[i].each_task[j].task.task_detail[k].name && move[j][l].name == Alldata.daily_task[i].each_task[j].name) {
                    check = 1;
                    break;
                }
            }
            test.push(allPressStatusArr[i].pressArr[j] == 1);
            if (allPressStatusArr[i].pressArr[j] == 1 && Alldata.daily_task.length - i > 2) {
                if (Alldata.daily_task[i].each_task[j].task.task_detail[k].complete == false && count_ < 2 && check != 1) {
                    move_detail.task_detail = JSON.parse(JSON.stringify(Alldata.daily_task[i].each_task[j].task.task_detail[k]));
                    move_detail.name = JSON.parse(JSON.stringify(Alldata.daily_task[i].each_task[j].name));
                    move_detail.date = JSON.parse(JSON.stringify(Alldata.daily_task[i].today));
                    move[j].push(JSON.parse(JSON.stringify(move_detail)));
                    move_num[j]++;
                    count_++;
                    task_move_.name = JSON.parse(JSON.stringify(Alldata.daily_task[i].each_task[j].task.task_detail[k].name));
                    task_move_.move_begin = JSON.parse(JSON.stringify(Alldata.daily_task[i].today));
                    task_move_.move_end = "";
                    task_move[j].push(JSON.parse(JSON.stringify(task_move_)));
                    task_move_re[j].push(JSON.parse(JSON.stringify(task_move_)));
                    web_.task_move = JSON.parse(JSON.stringify(task_move_re[j]));
                    web_.name = JSON.parse(JSON.stringify(Alldata.daily_task[i].each_task[j].name));

                    web[j] = JSON.parse(JSON.stringify(web_));
                }
                else {
                    if (check != 1)
                        change_task_detail[k] = JSON.parse(JSON.stringify(Alldata.daily_task[i].each_task[j].task.task_detail[k]));
                }
            }
            else {
                if (check != 1)
                    change_task_detail[k] = JSON.parse(JSON.stringify(Alldata.daily_task[i].each_task[j].task.task_detail[k]));
            }
        }
        if (allPressStatusArr[i].pressArr[j] == 0 && move_num[j] > 0) {
            change_task_detail.push(JSON.parse(JSON.stringify(move[j][move_num[j] - 1])));
            move_num[j]--;
            web[j].task_move[web_be[j]].move_end = JSON.parse(JSON.stringify(Alldata.daily_task[i].today));
            web_be[j]++;
        }
        if (allPressStatusArr[i].pressArr[j] == -1 && move_num[j] > 0) {
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
        change_task.task_detail = JSON.parse(JSON.stringify(change_task_detail));
        change_each_task_.name = JSON.parse(JSON.stringify(Alldata.daily_task[i].each_task[j].name));
        change_each_task_.task = JSON.parse(JSON.stringify(change_task));
        change_each_task[j] = JSON.parse(JSON.stringify(change_each_task_));
    }
    changedaily_task_.each_task = JSON.parse(JSON.stringify(change_each_task));
    changedaily_task[i] = JSON.parse(JSON.stringify(changedaily_task_));
}
All.d = JSON.parse(JSON.stringify(changedaily_task));




return {
    "success": true,
    "processVariable": {
        "AllEditTask": web,
        "newSched": All.d,
        "test": test
    },
    "errorMessage": ""
};