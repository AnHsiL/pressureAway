var ori_data = $(data);
var data = ori_data[0].project;
var editData = {};

editData.name = data.name;
editData.employee_num = data.employee_num;
editData.start_date = data.start_date;
editData.deadline = data.deadline;

var edit_dailyTask = [];

for(var i = 0; i < data.daily_task.length; i++){
    var edit_dailyTask_ = {};
    var edit_eachTask = [];
    for(var j = 0; j < data.employee_num; j++){
        var edit_eachTask_ = {};
      	var e ={};
        var task_detail_ = [];
        edit_eachTask_.name = data.daily_task[i].each_task[j].name;
        for(var k = 0; k < data.daily_task[i].each_task[j].task.task_detail.length; k++){
            task_detail_[k] = data.daily_task[i].each_task[j].task.task_detail[k];
        }
        e.task_detail = task_detail_;
        edit_eachTask_.task = e;
        edit_eachTask[j] = edit_eachTask_;
    }
    edit_dailyTask_.today = data.daily_task[i].today;
    edit_dailyTask_.each_task = edit_eachTask;
    edit_dailyTask[i] = edit_dailyTask_;
}

editData.daily_task = edit_eachTask;

return {
    "success": true,
    "processVariable": {
        "data": {
            "editData":editData
        }
    },
    "errorMessage": ""
};