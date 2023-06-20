// Line 通知

    // [v] 是否推送任務消息
    // 請求方式: post
    // url: https://bai-cloudeia.eastasia.cloudapp.azure.com/api/SetPushHData

    // 請求腳本
    var dateToAsk = $(dateToAsk);
    var context = "";

    var year = String(Math.floor(parseInt(dateToAsk)/10000));
    var month = String(Math.floor(parseInt(dateToAsk) % 10000 / 100));
    if(month.length < 2) month = "0" + month;
    var day = String(parseInt(dateToAsk) % 100);
    if(day.length < 2) day = "0" + day;

    context = year + "/" + month + "/" + day + ", 員工狀態良好~";

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