var response = $(data);
var allPressStatusArr = $(allPressStatusArr);


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



return {
    "success": true,
    "processVariable": {
        "AllEditTask": edit,
        "newSched": ALL,
    },
    "errorMessage": ""
};