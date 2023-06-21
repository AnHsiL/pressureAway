<<<<<<<< < Temporary merge branch 1
function dateDiff(Date1, Date2) {
    var date1 = new Date(Date1);
    var date2 = new Date(Date2);
    var milliseconds_Time = date2.getTime() - date1.getTime();
    return milliseconds_Time / (1000 * 3600 * 24);
};

var all_data = $(data);
var data = all_data.ori_data;
var changedata = {};
var pressureStatus = all_data.pressureStatus;
changedata.name = data.name;
changedata.employee_num = data.employee_num;
changedata.start_date = data.start_date;
changedata.deadline = data.deadline;
var changedaily_task = [];
var move_task = [];
var move_task_ = {};
var place = 0;
var move_task_pre = [];
var move_task_pre_ = {};
var place_pre = 0;
for (var i = 0; i < data.daily_task.length; i++) {
    var change_daily_task = {};
    var change_each_task = [];
    for (var j = 0; j < data.employee_num; j++) {
        var change_each_task_ = {};
        var change_e = {};
        var change_task_detail = [];
        change_each_task_.name = data.daily_task[i].each_task[j].name;
        move_task_.name = data.daily_task[i].each_task[j].name;
        change_each_task_.pressure_factor = data.daily_task[i].each_task[j].pressure_factor;
        for (k = 0; k < data.daily_task[i].each_task[j].task.task_detail.length; k++) {
            var count_ = 0;
            if (pressureStatus[i] == 1 && data.daily_task[i].each_task[j].task.task_detail.complete == false && count_ < 2) {
                count_++;
                move_task_.move_task_detail = data.daily_task[i].each_task[j].task.task_detail[k]
                move_task_.is = false;
                move_task_.date = i;
                move_task[place] = move_task_;
                place++;
            }
            else
                change_task_detail[k] = data.daily_task[i].each_task[j].task.task_detail[k];
        }
        for (k = 0; k < move_task.length; k++) {
            if (move_task[k].date != i && move_task[k].name == data.daily_task[i].each_task[j].name && move_task_.is == false && pressureStatus[i] != 1) {
                change_task_detail[change_task_detail.length] = move_task[k].task_detail;
                move_task.is = true;
            }
        }
        change_e.is_co_meeting = data.daily_task[i].each_task[j].is_co_meeting;
        change_e.is_meeting = data.daily_task[i].each_task[j].is_meeting;
        change_e.task_detail = change_task_detail;
        change_each_task_.task = change_e;
        change_each_task[j] = change_each_task_;
    }
    change_daily_task.each_task = change_each_task_;
    change_daily_task.today = data.daily_task[i].today;
    changedaily_task[i] = change_daily_task;
}
changedata.daily_task = changedaily_task;
changedata.deadline = data.deadline;
changedata.name = data.name;
changedata.employee_num = data.employee_num;
changedata.start_date = data.start_date;

return {
    "success": true,
    "processVariable": {
        "data": {
            "ori_data": data,
            "editData": changedata
        }
=========
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
>>>>>>>>> Temporary merge branch 2
    },
    "errorMessage": ""
};