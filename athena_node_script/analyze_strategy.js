// http-取得零食推薦

    // 請求方式: post
    // url: http://kafka-middle-ddic2023ws.apps.digiwincloud.com/api/ai/RH

    // 請求腳本
    var context = "";
    context = context + "當前員工壓力大";

    var gptRequest = {
    "key": "0",
    "data": {
        "topic": "AI",
        "method": "ChatGPT",
        "data": {
        "prompt": [
            {
                "role": "system",
                "content": "「"+ context +"」建議該選購何種方便食用的零食來減輕壓力？請簡潔歸納出重點"
            }
        ],
        "temperature": 0.7,
        "top_p": 1
        },
        "timeout": 30
    }};
    return gptRequest;

    // 返回腳本
    var response = $(response);
    var gptMessage = response.data.trim();
    return {
        "success": true,
        "processVariable": {
            "gptMessage": gptMessage
        },
        "errorMessage": ""
    };

// Line 通知

    // [v] 是否推送任務消息
    // 請求方式: post
    // url: https://bai-cloudeia.eastasia.cloudapp.azure.com/api/SetPushHData

    // 請求腳本
    var dateToAsk = $(dateToAsk);
    var gptMessage = "$(gptMessage)";
    var context = "";

    var year = String(Math.floor(parseInt(dateToAsk)/10000));
    var month = String(Math.floor(parseInt(dateToAsk) % 10000 / 100));
    if(month.length < 2) month = "0" + month;
    var day = String(parseInt(dateToAsk) % 100);
    if(day.length < 2) day = "0" + day;

    context = context + "【警告】 " + year + "/" + month + "/" + day + "，當前員工壓力大，";
    context = context + gptMessage;

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
