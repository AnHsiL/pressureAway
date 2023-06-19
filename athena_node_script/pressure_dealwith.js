var response = $(response);
var allPressStatusArr = $(allPressStatusArr);


var Alldata = response.project;
var All = {};
var changedaily_task = [];
var changedaily_task_ = {};
var move = [];
var move_detail = {};
var move_num = [];
for (var i = 0; i < Alldata.daily_task.length; i++) {
    var change_each_task = [];
    var change_each_task_ = {};
    for (var j = 0; j < Alldata.daily_task[i].each_task.length; ++j) {
        var change_task = {};
        var change_task_detail = [];
        var count_ = 0;
        for (var k = Alldata.daily_task[i].each_task[j].task.task_detail.length - 1; k >= 0; --k) {
            var check = 0;
            if (allPressStatusArr[i].pressArr[j] == 1 && Alldata.daily_task.length - i > 2) {
                if (Alldata.daily_task[i].each_task[j].task.task_detail[k].complete == false && count_ < 2) {
                    move_detail.task_detail = JSON.parse(JSON.stringify(Alldata.daily_task[i].each_task[j].task.task_detail[k]));
                    move_detail.name = JSON.parse(JSON.stringify(Alldata.daily_task[i].each_task[j].name));
                    move_detail.date = i;
                    move[j] = push(move_detail);
                    move_num[j]++;
                    count_++;
                }
                else {
                    for (var l = 0; l < move_num[j]; ++l) {
                        if (move[j][l].task_detail[k].name == Alldata.daily_task[i].each_task[j].task.task_detail[k].name) {
                            check = 1;
                            break;
                        }
                    }
                    if (check != 1)
                        change_task_detail[k] = JSON.parse(JSON.stringify(Alldata.daily_task[i].each_task[j].task.task_detail[k]));
                }
            }
            else {
                for (var l = 0; l < move_num[j]; ++l) {
                    if (move[j][l].task_detail[k].name == Alldata.daily_task[i].each_task[j].task.task_detail[k].name) {
                        check = 1;
                        break;
                    }
                }
                if (check != 1)
                    change_task_detail[k] = JSON.parse(JSON.stringify(Alldata.daily_task[i].each_task[j].task.task_detail[k]));
            }
        }
        if (allPressStatusArr[i].pressArr[j] == 0 && move_num[j] != 0) {
            change_task_detail = push(JSON.parse(JSON.stringify(move[j][move_num[j] - 1])));
            move_num[j]--;
            var x = move[j].splice(move_num[j], 1);
        }
        if (allPressStatusArr[i].pressArr[j] == -1 && move_num[j] > 0) {
            if (move_num[j] > 1) {
                change_task_detail = push(JSON.parse(JSON.stringify(move[j][move_num[j] - 1])));
                move_num[j]--;
                var x = move[j].splice(move_num[j], 1);
                change_task_detail = push(JSON.parse(JSON.stringify(move[j][move_num[j] - 1])));
                move_num[j]--;
                var x = move[j].splice(move_num[j], 1);
            }
            else {
                change_task_detail = push(JSON.parse(JSON.stringify(move[j][move_num[j] - 1])));
                move_num[j]--;
                var x = move[j].splice(move_num[j], 1);
            }
        }
        if (i == Alldata.daily_task.length - 2) {
            for (var k = 0; k < Alldata.employee_num; k++) {
                while (move_num[k]--) {
                    change_task_detail = push(JSON.parse(JSON.stringify(move[k][move_num[k]])));
                    var x = move[k].splice(move_num[k], 1);
                }
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
        "data": All.d
    },
    "errorMessage": ""
};