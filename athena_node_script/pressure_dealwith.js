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
changedaily_task = {};
for (var i = 0; i < data.daily_task.length; i++) {
    var change_daily_task = [];
    var change_each_task = {};
    for (var j = 0; j < data.employee_num; j++) {
        var change_each_task_ = {};
        var change_factor = {};
        var change_task_detail = [];
        change_each_task.name = data.daily_task[i].each_task[j].name;
        for (k = 0; k < data.daily_task[i].each_task[j].task.task_detail.length; k++) {
            change_task_detail[k] = data.daily_task[i].each_task[j].task.task_detail[k];
        }

    }
}