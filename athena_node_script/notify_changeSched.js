// Line 通知

    // [v] 是否推送任務消息
    // 請求方式: post
    // url: https://bai-cloudeia.eastasia.cloudapp.azure.com/api/SetPushHData

    // 請求腳本
    var allChangedSched = $(AllEditTask);
    var context = "";
    context = context + "員工行程已變更，具體如下，詳情請至網頁頁面查看。\n";

    for(var j = 0; j < allChangedSched.length; j++){
    context = context + "[" + allChangedSched[j].name + "] " + "工作變更為: ";
    for(var i = 0; i < allChangedSched[j].task_move.length; i++){
        context = context + allChangedSched[j].task_move[i].name;
        context = context + "(" + allChangedSched[j].task_move[i].move_begin + " -> " + allChangedSched[j].task_move[i].move_end + ")";
        if(i != allChangedSched[j].task_move.length-1) context = context + ", ";
    }
    if(j != allChangedSched.length-1) context = context + ", ";
    context = context + "\n";
    };


    var lineMessageRequest = {
        "context": context,
        "targetUserId": "team49Admin"
    };

    return lineMessageRequest;

    // 返回腳本
    return {
        "success" : true,
        "processVariable" : {
        },
        "errorMessage" : ""
    };