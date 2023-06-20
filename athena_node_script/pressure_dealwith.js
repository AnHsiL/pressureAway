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
    },
    "errorMessage": ""
};